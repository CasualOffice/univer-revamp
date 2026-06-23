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

import type { ISlideData, SlideDataModel } from '@univerjs/slides';
import { ICommandService, IUniverInstanceService, Univer, UniverInstanceType } from '@univerjs/core';
import { FUniver } from '@univerjs/core/facade';
import { BasicShapes, PageElementType, PageType, UniverSlidesPlugin } from '@univerjs/slides';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AppendSlideOperation } from '../../commands/operations/append-slide.operation';
import {
    SlideDeleteElementMutation,
    SlideDeletePageMutation,
    SlideInsertElementMutation,
    SlideInsertPageMutation,
    SlideUpdateElementMutation,
    SlideUpdatePageMutation,
} from '../../commands/mutations/element.mutation';
import { CanvasView } from '../../controllers/canvas-view';
import '../index';

const UNIT_ID = 'facade-slide';
const PAGE_ID = 'p1';

class TestCanvasView {
    appendPage() { /* render-only hint */ }
    createObjectToPage() { return null; }
    setObjectActiveByPage() { /* noop */ }
}

function snapshot(): Partial<ISlideData> {
    return {
        id: UNIT_ID,
        title: 'Facade deck',
        pageSize: { width: 960, height: 540 },
        body: {
            pageOrder: [PAGE_ID],
            pages: {
                [PAGE_ID]: {
                    id: PAGE_ID,
                    pageType: PageType.SLIDE,
                    zIndex: 1,
                    title: 'Slide 1',
                    description: '',
                    pageBackgroundFill: { rgb: '#ffffff' },
                    pageElements: {
                        shape1: {
                            id: 'shape1',
                            zIndex: 1,
                            left: 10,
                            top: 20,
                            width: 100,
                            height: 50,
                            title: 'shape',
                            description: '',
                            type: PageElementType.SHAPE,
                            shape: { shapeType: BasicShapes.Rect, text: '', shapeProperties: { shapeBackgroundFill: { rgb: 'rgb(0,0,255)' } } },
                        },
                    },
                },
            },
        },
    };
}

describe('Slides facade', () => {
    let univer: Univer;
    let univerAPI: FUniver;

    beforeEach(() => {
        univer = new Univer();
        univer.registerPlugin(UniverSlidesPlugin);
        const injector = univer.__getInjector();
        injector.add([CanvasView, { useClass: TestCanvasView as never }]);

        univer.createUnit<ISlideData, SlideDataModel>(UniverInstanceType.UNIVER_SLIDE, snapshot());
        injector.get(IUniverInstanceService).focusUnit(UNIT_ID);

        const commandService = injector.get(ICommandService);
        [
            SlideInsertElementMutation,
            SlideDeleteElementMutation,
            SlideUpdateElementMutation,
            SlideInsertPageMutation,
            SlideDeletePageMutation,
            SlideUpdatePageMutation,
            AppendSlideOperation,
        ].forEach((c) => commandService.registerCommand(c));

        univerAPI = FUniver.newAPI(injector);
    });

    afterEach(() => univer.dispose());

    it('getActiveSlide returns an FSlide for the focused unit', () => {
        const slide = univerAPI.getActiveSlide();
        expect(slide).not.toBeNull();
        expect(slide!.getId()).toBe(UNIT_ID);
        expect(slide!.getName()).toBe('Facade deck');
        expect(slide!.getPageCount()).toBe(1);
        expect(univerAPI.getSlide(UNIT_ID)!.getId()).toBe(UNIT_ID);
        expect(univerAPI.getSlide('missing')).toBeNull();
    });

    it('navigates pages and elements', () => {
        const slide = univerAPI.getActiveSlide()!;
        const pages = slide.getPages();
        expect(pages).toHaveLength(1);
        expect(pages[0].getId()).toBe(PAGE_ID);

        const active = slide.getActivePage()!;
        expect(active.getId()).toBe(PAGE_ID);
        expect(active.getElementCount()).toBe(1);

        const el = active.getElementById('shape1')!;
        expect(el.getType()).toBe(PageElementType.SHAPE);
        expect(el.getTransform()).toMatchObject({ left: 10, top: 20, width: 100, height: 50 });
        expect(active.getElementById('nope')).toBeNull();
    });

    it('FElement.setTransform updates the model via mutation', () => {
        const el = univerAPI.getActiveSlide()!.getActivePage()!.getElementById('shape1')!;
        expect(el.setTransform({ left: 200, top: 80, rotation: 45 })).toBe(true);
        const raw = el.getRaw()!;
        expect(raw.left).toBe(200);
        expect(raw.top).toBe(80);
        expect(raw.angle).toBe(45);
        // unchanged fields preserved (mutation merges)
        expect(raw.width).toBe(100);
    });

    it('FElement.remove deletes the element', () => {
        const page = univerAPI.getActiveSlide()!.getActivePage()!;
        expect(page.getElementById('shape1')!.remove()).toBe(true);
        expect(page.getElementById('shape1')).toBeNull();
        expect(page.getElementCount()).toBe(0);
    });

    it('appendSlide adds a page and returns it', () => {
        const slide = univerAPI.getActiveSlide()!;
        const newPage = slide.appendSlide();
        expect(newPage).not.toBeNull();
        expect(slide.getPageCount()).toBe(2);
        expect(slide.getPageById(newPage!.getId())).not.toBeNull();
    });

    it('serialize returns a detached canonical snapshot', () => {
        const slide = univerAPI.getActiveSlide()!;
        const s = slide.serialize();
        expect(s.schemaVersion).toBe(1);
        s.title = 'mutated copy';
        expect(slide.getName()).toBe('Facade deck');
    });
});
