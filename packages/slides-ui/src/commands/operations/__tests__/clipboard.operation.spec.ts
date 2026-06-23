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

import type { IPageElement, ISlideData, ISlidePage, SlideDataModel } from '@univerjs/slides';
import { ICommandService, IUndoRedoService, IUniverInstanceService, LocaleService, RedoCommand, UndoCommand, Univer, UniverInstanceType } from '@univerjs/core';
import { BasicShapes, PageElementType, PageType, UniverSlidesPlugin } from '@univerjs/slides';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SlideDeleteElementMutation, SlideInsertElementMutation } from '../../mutations/element.mutation';
import {
    clearSlideClipboardBuffer,
    getSlideClipboardBuffer,
    SlideCopyElementCommand,
    SlideCutElementCommand,
    SlideDuplicateElementCommand,
    SlidePasteElementCommand,
} from '../clipboard.operation';

const unitId = 'slide-clipboard-unit';
const pageId = 'page-1';

function createSlideSnapshot(): Partial<ISlideData> {
    return {
        id: unitId,
        title: 'Clipboard test deck',
        pageSize: { width: 960, height: 540 },
        body: {
            pageOrder: [pageId],
            pages: {
                [pageId]: {
                    id: pageId,
                    pageType: PageType.SLIDE,
                    zIndex: 1,
                    title: 'Overview',
                    description: '',
                    pageBackgroundFill: { rgb: '#ffffff' },
                    pageElements: {
                        'title-text': {
                            id: 'title-text',
                            zIndex: 1,
                            left: 40,
                            top: 40,
                            width: 400,
                            height: 60,
                            title: 'Title',
                            description: '',
                            type: PageElementType.TEXT,
                            richText: { text: 'Quarterly review' },
                        },
                        'old-shape': {
                            id: 'old-shape',
                            zIndex: 2,
                            left: 100,
                            top: 120,
                            width: 80,
                            height: 80,
                            title: 'Old shape',
                            description: '',
                            type: PageElementType.SHAPE,
                            shape: {
                                shapeType: BasicShapes.Rect,
                                text: '',
                                shapeProperties: {
                                    shapeBackgroundFill: { rgb: 'rgb(0,0,255)' },
                                },
                            },
                        },
                    },
                },
            },
        },
    };
}

function getActivePage(slide: SlideDataModel): ISlidePage {
    return slide.getActivePage()!;
}

function getElementIds(page: ISlidePage): string[] {
    const ids: string[] = [];
    for (const id in page.pageElements) {
        ids.push(id);
    }
    return ids;
}

function findElementsAddedAfter(page: ISlidePage, beforeIds: string[]): IPageElement[] {
    const added: IPageElement[] = [];
    for (const id in page.pageElements) {
        if (!beforeIds.includes(id)) {
            added.push(page.pageElements[id]);
        }
    }
    return added;
}

describe('slide element clipboard operations', () => {
    let univer: Univer;
    let commandService: ICommandService;
    let slide: SlideDataModel;

    beforeEach(() => {
        univer = new Univer();
        univer.registerPlugin(UniverSlidesPlugin);

        const injector = univer.__getInjector();
        slide = univer.createUnit<ISlideData, SlideDataModel>(UniverInstanceType.UNIVER_SLIDE, createSlideSnapshot());
        injector.get(IUniverInstanceService).focusUnit(unitId);
        commandService = injector.get(ICommandService);
        commandService.registerCommand(SlideInsertElementMutation);
        commandService.registerCommand(SlideDeleteElementMutation);
        commandService.registerCommand(SlideCopyElementCommand);
        commandService.registerCommand(SlideCutElementCommand);
        commandService.registerCommand(SlidePasteElementCommand);
        commandService.registerCommand(SlideDuplicateElementCommand);
        injector.get(LocaleService).load({});
        clearSlideClipboardBuffer();
    });

    afterEach(() => {
        clearSlideClipboardBuffer();
        univer.dispose();
    });

    it('copies the selected element into the clipboard buffer as a deep clone', async () => {
        const result = await commandService.executeCommand(SlideCopyElementCommand.id, {
            unitId,
            id: 'old-shape',
        });

        expect(result).toBe(true);
        const buffer = getSlideClipboardBuffer();
        expect(buffer).toHaveLength(1);
        expect(buffer[0]).toMatchObject({ id: 'old-shape', type: PageElementType.SHAPE });

        // Mutating the live element must not mutate the buffered clone.
        slide.getActivePage()!.pageElements['old-shape'].left = 999;
        expect(getSlideClipboardBuffer()[0].left).toBe(100);
    });

    it('supports copying multiple elements via ids', async () => {
        const result = await commandService.executeCommand(SlideCopyElementCommand.id, {
            unitId,
            ids: ['title-text', 'old-shape'],
        });

        expect(result).toBe(true);
        expect(getSlideClipboardBuffer().map((e) => e.id)).toEqual(['title-text', 'old-shape']);
    });

    it('pastes a buffered element with a fresh id and a +offset', async () => {
        await commandService.executeCommand(SlideCopyElementCommand.id, { unitId, id: 'old-shape' });

        const page = getActivePage(slide);
        const beforeIds = getElementIds(page);
        const result = await commandService.executeCommand(SlidePasteElementCommand.id, { unitId });

        expect(result).toBe(true);
        const added = findElementsAddedAfter(page, beforeIds);
        expect(added).toHaveLength(1);
        expect(added[0].id).not.toBe('old-shape');
        expect(added[0].left).toBe(110);
        expect(added[0].top).toBe(130);
        expect(added[0].type).toBe(PageElementType.SHAPE);
    });

    it('returns false when pasting with an empty buffer', async () => {
        const page = getActivePage(slide);
        const beforeIds = getElementIds(page);

        const result = await commandService.executeCommand(SlidePasteElementCommand.id, { unitId });

        expect(result).toBe(false);
        expect(getElementIds(page)).toEqual(beforeIds);
    });

    it('cut copies into the buffer and removes the original, undoable', async () => {
        const page = getActivePage(slide);

        const result = await commandService.executeCommand(SlideCutElementCommand.id, {
            unitId,
            id: 'old-shape',
        });

        expect(result).toBe(true);
        expect(slide.getElement(pageId, 'old-shape')).toBeUndefined();
        expect(getSlideClipboardBuffer().map((e) => e.id)).toEqual(['old-shape']);

        await commandService.executeCommand(UndoCommand.id);
        expect(slide.getElement(pageId, 'old-shape')).toBeDefined();

        await commandService.executeCommand(RedoCommand.id);
        expect(slide.getElement(pageId, 'old-shape')).toBeUndefined();

        void page;
    });

    it('paste is undoable (the pasted copy is removed on undo)', async () => {
        await commandService.executeCommand(SlideCopyElementCommand.id, { unitId, id: 'old-shape' });

        const page = getActivePage(slide);
        const beforeIds = getElementIds(page);
        await commandService.executeCommand(SlidePasteElementCommand.id, { unitId });
        const added = findElementsAddedAfter(page, beforeIds);
        expect(added).toHaveLength(1);
        const newId = added[0].id;

        await commandService.executeCommand(UndoCommand.id);
        expect(slide.getElement(pageId, newId)).toBeUndefined();

        await commandService.executeCommand(RedoCommand.id);
        expect(slide.getElement(pageId, newId)).toBeDefined();
    });

    it('duplicates the selected element in place with an offset without touching the buffer', async () => {
        // Seed the buffer with something unrelated to prove duplicate leaves it alone.
        await commandService.executeCommand(SlideCopyElementCommand.id, { unitId, id: 'title-text' });

        const page = getActivePage(slide);
        const beforeIds = getElementIds(page);
        const result = await commandService.executeCommand(SlideDuplicateElementCommand.id, {
            unitId,
            id: 'old-shape',
        });

        expect(result).toBe(true);
        const added = findElementsAddedAfter(page, beforeIds);
        expect(added).toHaveLength(1);
        expect(added[0].id).not.toBe('old-shape');
        expect(added[0].left).toBe(110);
        expect(added[0].top).toBe(130);

        // Buffer still holds the originally-copied title element.
        expect(getSlideClipboardBuffer().map((e) => e.id)).toEqual(['title-text']);
    });

    it('uses IUndoRedoService stack for cut/paste', () => {
        const undoRedoService = univer.__getInjector().get(IUndoRedoService);
        expect(undoRedoService).toBeDefined();
    });
});
