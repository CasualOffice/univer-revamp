/**
 * Copyright 2023-present DreamNum Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { IAccessor, Nullable, Workbook } from '@univerjs/core';
import type { ISelectionWithStyle } from '@univerjs/sheets';
import { IUniverInstanceService, RANGE_TYPE, Rectangle, UniverInstanceType } from '@univerjs/core';
import { MERGE_CELL_INTERCEPTOR_CHECK, MergeCellController, RangeProtectionRuleModel, SheetsSelectionsService } from '@univerjs/sheets';
import { combineLatest, map, of, switchMap } from 'rxjs';

export function getSheetSelectionsDisabled$(accessor: IAccessor) {
    const selectionManagerService = accessor.get(SheetsSelectionsService);
    const rangeProtectionRuleModel = accessor.get(RangeProtectionRuleModel);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const mergeCellController = accessor.get(MergeCellController);

    const workbook$ = univerInstanceService.getCurrentTypeOfUnit$<Workbook>(UniverInstanceType.UNIVER_SHEET);
    return combineLatest([
        selectionManagerService.selectionMoveEnd$,
        workbook$.pipe(map((workbook) => workbook?.getUnitId() ?? '')),
        workbook$.pipe(switchMap((workbook) => workbook?.activeSheet$ ?? of(null))),
    ]).pipe(
        map(([selection, unitId, sheet]) => {
            if (!sheet) return false;
            if (!selection || selection.length === 0) return false;
            const subUnitId = sheet.getSheetId();

            const selectionRanges = selection.map((sel) => sel.range);
            const disableResByInterceptor = mergeCellController.interceptor.fetchThroughInterceptors(MERGE_CELL_INTERCEPTOR_CHECK)(false, selectionRanges);

            if (disableResByInterceptor) {
                return true;
            }

            const subUnitRuleRange = rangeProtectionRuleModel.getSubunitRuleList(unitId, subUnitId)
                .map((rule) => rule.ranges)
                .flat();

            if (selection.length < 2) {
                const range = selection[0].range;
                const rangeIsOverlap = subUnitRuleRange.some((ruleRange) => {
                    return Rectangle.intersects(ruleRange, range) && !Rectangle.contains(ruleRange, range);
                });
                return rangeIsOverlap;
            }

            for (let i = 0; i < selection.length; i++) {
                for (let j = i + 1; j < selection.length; j++) {
                    if (Rectangle.intersects(selection[i].range, selection[j].range)) {
                        return true;
                    }
                }
            }
            return false;
        })
    );
}

/**
 * Detect if this row is selected
 * @param selections
 * @param rowIndex
 * @returns boolean
 */
export function isThisRowSelected(
    selections: Readonly<ISelectionWithStyle[]>,
    rowIndex: number
): boolean {
    return !!matchedSelectionByRowColIndex(selections, rowIndex, RANGE_TYPE.ROW);
}

/**
 * Detect if this col is selected
 * @param selections
 * @param colIndex
 * @returns boolean
 */
export function isThisColSelected(
    selections: Readonly<ISelectionWithStyle[]>,
    colIndex: number
): boolean {
    return !!matchedSelectionByRowColIndex(selections, colIndex, RANGE_TYPE.COLUMN);
}

/**
 * Memo of (selections-array → per-index lookup maps), keyed weakly so a
 * replaced selections array is collected without explicit invalidation.
 *
 * The original `.find()` walked every selection per call — with ctrl-click
 * patterns producing 50+ selections, a header click paid O(N). The maps
 * here trade O(K) initial build (K = number of indices covered by ROW/
 * COLUMN-type selections, typically the row/column count of the range)
 * for O(1) lookups on subsequent calls against the same selections
 * reference.
 *
 * Why a WeakMap and not state on a service: the function's contract is
 * stateless — selections come in as a parameter from various sites
 * (`getCurrentSelections()`, test fixtures, etc.). A WeakMap keyed on
 * the array reference lets us cache derived state without entangling
 * lifecycle with any specific selection service.
 */
interface IndexedSelections {
    rowIndex: Map<number, ISelectionWithStyle>;
    colIndex: Map<number, ISelectionWithStyle>;
}
const _selectionIndexCache = new WeakMap<Readonly<ISelectionWithStyle[]>, IndexedSelections>();

function _getOrBuildSelectionIndex(selections: Readonly<ISelectionWithStyle[]>): IndexedSelections {
    let cached = _selectionIndexCache.get(selections);
    if (cached) return cached;
    const rowIndex = new Map<number, ISelectionWithStyle>();
    const colIndex = new Map<number, ISelectionWithStyle>();
    for (const sel of selections) {
        const range = sel.range;
        const rangeType = range.rangeType;
        // Match the original .find() filter: ALL and NORMAL ranges never
        // match a row/column header click — only pure ROW or COLUMN ranges
        // do. Anything else is skipped entirely.
        if (rangeType === RANGE_TYPE.ROW) {
            for (let i = range.startRow; i <= range.endRow; i++) {
                // First-wins semantics — matches Array.prototype.find().
                if (!rowIndex.has(i)) rowIndex.set(i, sel);
            }
        } else if (rangeType === RANGE_TYPE.COLUMN) {
            for (let i = range.startColumn; i <= range.endColumn; i++) {
                if (!colIndex.has(i)) colIndex.set(i, sel);
            }
        }
    }
    cached = { rowIndex, colIndex };
    _selectionIndexCache.set(selections, cached);
    return cached;
}

/**
 * Detect this row/col is in selections.
 * @param selections
 * @param indexOfRowCol
 * @param rowOrCol
 * @returns the matched selection (same object reference as `selections`
 * contained, for downstream identity checks), or undefined.
 */
export function matchedSelectionByRowColIndex(
    selections: Readonly<ISelectionWithStyle[]>,
    indexOfRowCol: number,
    rowOrCol: RANGE_TYPE.ROW | RANGE_TYPE.COLUMN
): Nullable<ISelectionWithStyle> {
    const { rowIndex, colIndex } = _getOrBuildSelectionIndex(selections);
    return rowOrCol === RANGE_TYPE.ROW
        ? rowIndex.get(indexOfRowCol)
        : colIndex.get(indexOfRowCol);
}
