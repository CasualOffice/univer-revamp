/**
 * Copyright 2026-present CasualOffice.
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

import type { Injector } from '@univerjs/core';
import type { BaseObject, IRichTextProps, Scene } from '@univerjs/engine-render';
import type { IColorScheme, IPageElement } from '../../../types/interfaces/i-slide-data';
import { Inject, LocaleService } from '@univerjs/core';
import { Group, Rect, RichText } from '@univerjs/engine-render';
import { resolveThemeColor } from '../../../basics/theme-color';
import { PageElementType } from '../../../types/interfaces/i-slide-data';
import { CanvasObjectProviderRegistry, ObjectAdaptor } from '../adaptor';

const CELL_PADDING = 4;

function prefixSums(sizes: number[], origin: number): number[] {
    const out: number[] = [origin];
    for (let i = 0; i < sizes.length; i++) {
        out.push(out[i] + (sizes[i] || 0));
    }
    return out;
}

// Renders a TABLE element (OOXML a:tbl) as a Group of per-cell Rects (fill +
// border) plus cell RichText. Column widths / row heights are absolute page
// coords; spanned-over cells (merged) render nothing; the originating cell
// spans the summed widths/heights of its colSpan/rowSpan.
export class TableAdaptor extends ObjectAdaptor {
    override zIndex = 2;

    override viewKey = PageElementType.TABLE;

    constructor(@Inject(LocaleService) private readonly _localeService: LocaleService) {
        super();
    }

    override check(type: PageElementType) {
        if (type !== this.viewKey) {
            return;
        }
        return this;
    }

    override convert(pageElement: IPageElement, _mainScene?: Scene, colorScheme?: IColorScheme): BaseObject | undefined {
        const { id, zIndex, left = 0, top = 0, angle, flipX, flipY } = pageElement;
        const table = pageElement.table;
        if (!table) return undefined;

        const { columnWidths = [], rowHeights = [], rows = [] } = table;
        const xs = prefixSums(columnWidths, left);
        const ys = prefixSums(rowHeights, top);

        const objects: BaseObject[] = [];

        for (let r = 0; r < rows.length; r++) {
            const cells = rows[r]?.cells ?? [];
            for (let c = 0; c < cells.length; c++) {
                const cell = cells[c];
                if (!cell || cell.merged) continue;

                const colSpan = Math.max(1, cell.colSpan ?? 1);
                const rowSpan = Math.max(1, cell.rowSpan ?? 1);
                const cellLeft = xs[c] ?? left;
                const cellTop = ys[r] ?? top;
                const cellWidth = (xs[Math.min(c + colSpan, columnWidths.length)] ?? cellLeft) - cellLeft;
                const cellHeight = (ys[Math.min(r + rowSpan, rowHeights.length)] ?? cellTop) - cellTop;

                const stroke = resolveThemeColor(cell.border?.outlineFill, colorScheme) || 'rgba(0,0,0,0.4)';
                objects.push(new Rect(`${id}_cell_${r}_${c}`, {
                    left: cellLeft,
                    top: cellTop,
                    width: cellWidth,
                    height: cellHeight,
                    zIndex,
                    fill: resolveThemeColor(cell.fill, colorScheme) || 'rgba(0,0,0,0)',
                    stroke,
                    strokeWidth: cell.border?.weight ?? 1,
                    forceRender: true,
                }));

                const cellText = cell.text;
                if (cellText && (cellText.text != null || cellText.rich != null)) {
                    let textConfig: IRichTextProps = {
                        left: cellLeft + CELL_PADDING,
                        top: cellTop + CELL_PADDING,
                        width: Math.max(0, cellWidth - CELL_PADDING * 2),
                        height: Math.max(0, cellHeight - CELL_PADDING * 2),
                        zIndex: (zIndex ?? 0) + 1,
                        forceRender: true,
                    };
                    if (cellText.text != null) {
                        const { text, ff, fs, it, bl, ul, st, ol, bg, bd, cl } = cellText;
                        textConfig = { ...textConfig, text, ff, fs, it, bl, ul, st, ol, bg, bd, cl };
                    } else {
                        textConfig = { ...textConfig, richText: cellText.rich };
                    }
                    objects.push(new RichText(this._localeService, `${id}_text_${r}_${c}`, textConfig));
                }
            }
        }

        if (objects.length === 0) return undefined;

        const group = new Group(id, ...objects);
        if (angle) group.transformByState({ angle });
        if (flipX != null || flipY != null) group.transformByState({ flipX, flipY });
        return group;
    }
}

export class TableAdaptorFactory {
    readonly zIndex = 8;

    create(injector: Injector): TableAdaptor {
        return injector.createInstance(TableAdaptor);
    }
}

CanvasObjectProviderRegistry.add(new TableAdaptorFactory());
