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

import type { Workbook } from '@univerjs/core';
import { DataValidationStatus, Disposable, Inject, IUniverInstanceService, UniverInstanceType } from '@univerjs/core';
import { SheetDataValidationModel } from '@univerjs/sheets-data-validation';
import { CellAlertManagerService, CellAlertType, HoverManagerService } from '@univerjs/sheets-ui';
import { IZenZoneService } from '@univerjs/ui';
import { debounceTime } from 'rxjs';

const INPUT_MSG_KEY = 'SHEET_DATA_VALIDATION_INPUT_MESSAGE';

/**
 * Excel's Data Validation "Input Message" — when a cell carrying a rule with
 * `showInputMessage` and a prompt is pointed at, show an informational popup
 * with the prompt title + text (guidance, not an error). Mirrors the alert
 * controller's cell-popup mechanism; only shows for VALID cells so it never
 * collides with the error alert (which owns the invalid case).
 */
export class DataValidationInputMessageController extends Disposable {
    constructor(
        @Inject(HoverManagerService) private readonly _hoverManagerService: HoverManagerService,
        @Inject(CellAlertManagerService) private readonly _cellAlertManagerService: CellAlertManagerService,
        @IUniverInstanceService private readonly _univerInstanceService: IUniverInstanceService,
        @IZenZoneService private readonly _zenZoneService: IZenZoneService,
        @Inject(SheetDataValidationModel) private readonly _dataValidationModel: SheetDataValidationModel
    ) {
        super();
        this._init();
    }

    private _init() {
        this.disposeWithMe(this._hoverManagerService.currentCell$.pipe(debounceTime(100)).subscribe((cellPos) => {
            if (!cellPos) {
                this._cellAlertManagerService.removeAlert(INPUT_MSG_KEY);
                return;
            }
            const workbook = this._univerInstanceService.getUnit<Workbook>(cellPos.location.unitId, UniverInstanceType.UNIVER_SHEET)!;
            const worksheet = workbook?.getSheetBySheetId(cellPos.location.subUnitId);
            if (!worksheet) {
                this._cellAlertManagerService.removeAlert(INPUT_MSG_KEY);
                return;
            }
            const rule = this._dataValidationModel.getRuleByLocation(cellPos.location.unitId, cellPos.location.subUnitId, cellPos.location.row, cellPos.location.col);
            const title = rule?.promptTitle ?? '';
            const message = rule?.prompt ?? '';
            // Only when the rule opts into an input message AND carries text.
            if (!rule || !rule.showInputMessage || (!title && !message)) {
                this._cellAlertManagerService.removeAlert(INPUT_MSG_KEY);
                return;
            }
            // Defer to the error alert when the cell value is invalid.
            const validStatus = this._dataValidationModel.validator(rule, { ...cellPos.location, workbook, worksheet });
            if (validStatus === DataValidationStatus.INVALID) {
                this._cellAlertManagerService.removeAlert(INPUT_MSG_KEY);
                return;
            }

            const current = this._cellAlertManagerService.currentAlert.get(INPUT_MSG_KEY);
            const loc = current?.alert?.location;
            if (
                loc &&
                loc.row === cellPos.location.row &&
                loc.col === cellPos.location.col &&
                loc.subUnitId === cellPos.location.subUnitId &&
                loc.unitId === cellPos.location.unitId
            ) {
                return; // already showing for this cell
            }

            this._cellAlertManagerService.showAlert({
                type: CellAlertType.INFO,
                title,
                message,
                location: cellPos.location,
                width: 200,
                height: 74,
                key: INPUT_MSG_KEY,
            });
        }));

        this.disposeWithMe(this._zenZoneService.visible$.subscribe((visible) => {
            if (visible) this._cellAlertManagerService.removeAlert(INPUT_MSG_KEY);
        }));
    }
}
