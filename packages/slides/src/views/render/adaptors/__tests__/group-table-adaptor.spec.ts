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

import type { IPageElement } from '../../../../types/interfaces/i-slide-data';
import { ConfigService, ContextService, IConfigService, IContextService, Injector, LocaleService } from '@univerjs/core';
import { Group } from '@univerjs/engine-render';
import { describe, expect, it } from 'vitest';
import { BasicShapes } from '../../../../types/enum/prst-geom-type';
import { PageElementType } from '../../../../types/interfaces/i-slide-data';
import { ObjectProvider } from '../../object-provider';
import { TableAdaptor } from '../table-adaptor';

function makeInjector(): Injector {
    const injector = new Injector();
    injector.add([LocaleService, { useClass: LocaleService }]);
    injector.add([IContextService, { useClass: ContextService }]);
    injector.add([IConfigService, { useClass: ConfigService }]);
    return injector;
}

function shapeChild(id: string, left: number, top: number): IPageElement {
    return {
        id, zIndex: 1, left, top, width: 50, height: 50, title: id, description: '',
        type: PageElementType.SHAPE,
        shape: { shapeType: BasicShapes.Rect, text: '', shapeProperties: { shapeBackgroundFill: { rgb: '#fff' } } },
    } as IPageElement;
}

describe('group rendering (ObjectProvider recursion)', () => {
    it('wraps a GROUP element\'s children in an engine Group', () => {
        const provider = makeInjector().createInstance(ObjectProvider);
        const groupEl = {
            id: 'g1', zIndex: 1, left: 0, top: 0, width: 200, height: 100, title: 'g', description: '',
            type: PageElementType.GROUP,
            group: { children: [shapeChild('c1', 0, 0), shapeChild('c2', 60, 0)] },
        } as IPageElement;

        const obj = provider.convertToRenderObject(groupEl, undefined as never);
        expect(obj).toBeInstanceOf(Group);
        expect((obj as Group).getObjects()).toHaveLength(2);
    });

    it('recurses nested groups', () => {
        const provider = makeInjector().createInstance(ObjectProvider);
        const nested = {
            id: 'g0', zIndex: 1, left: 0, top: 0, width: 200, height: 100, title: 'g', description: '',
            type: PageElementType.GROUP,
            group: { children: [
                shapeChild('c1', 0, 0),
                { id: 'g1', zIndex: 1, left: 0, top: 0, width: 100, height: 50, title: 'g', description: '', type: PageElementType.GROUP, group: { children: [shapeChild('c2', 0, 0)] } } as IPageElement,
            ] },
        } as IPageElement;

        const obj = provider.convertToRenderObject(nested, undefined as never) as Group;
        expect(obj).toBeInstanceOf(Group);
        expect(obj.getObjects()).toHaveLength(2);
        expect(obj.getObjects().some((o) => o instanceof Group)).toBe(true);
    });
});

describe('TableAdaptor', () => {
    const adaptor = makeInjector().createInstance(TableAdaptor);

    function tableEl(): IPageElement {
        return {
            id: 't1', zIndex: 1, left: 10, top: 20, width: 200, height: 100, title: 't', description: '',
            type: PageElementType.TABLE,
            table: {
                columnWidths: [100, 100],
                rowHeights: [50, 50],
                rows: [
                    { cells: [{ text: { text: 'A' }, fill: { rgb: '#eeeeee' } }, { text: { text: 'B' } }] },
                    { cells: [{ text: { text: 'C' } }, { merged: true }] },
                ],
            },
        } as IPageElement;
    }

    it('renders a table as a Group of cell rects + text', () => {
        const obj = adaptor.convert(tableEl()) as Group;
        expect(obj).toBeInstanceOf(Group);
        // 3 non-merged cells → 3 rects + 3 texts = 6 objects (merged cell skipped).
        expect(obj.getObjects().length).toBe(6);
    });

    it('skips merged cells', () => {
        const el = tableEl();
        // make the whole second row merged → only row 0 renders (2 cells)
        el.table!.rows[1].cells = [{ merged: true }, { merged: true }];
        const obj = adaptor.convert(el) as Group;
        // row 0: 2 rects + 2 texts = 4
        expect(obj.getObjects().length).toBe(4);
    });

    it('returns undefined for an empty table', () => {
        const el = tableEl();
        el.table = { columnWidths: [], rowHeights: [], rows: [] };
        expect(adaptor.convert(el)).toBeUndefined();
    });
});
