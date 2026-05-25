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

import type { ICommand } from '@univerjs/core';
import type { IPageElement, ISlidePage, SlideDataModel } from '@univerjs/slides';
import type { ISlideDeletePageMutationParams, ISlideInsertPageMutationParams } from '../mutations/element.mutation';
import { CommandType, generateRandomId, ICommandService, IUndoRedoService, IUniverInstanceService } from '@univerjs/core';
import { CanvasView } from '../../controllers/canvas-view';
import { SlideDeletePageMutation, SlideInsertPageMutation } from '../mutations/element.mutation';

export interface IDuplicateSlideParams {
    unitId?: string;
    pageId?: string;
}

// Clone an existing slide and insert it after the current active page.
// Standard Google Slides / PowerPoint expectation; missing from upstream
// Univer Slides. Uses the SlideInsertPageMutation + SlideDeletePageMutation
// pair we already have for collab-safe broadcast + undo support.
//
// The clone re-mints every id (page + each element) so we don't collide
// with the source — the slide model uses id-as-primary-key everywhere.
export const SlideDuplicateSlideCommand: ICommand<IDuplicateSlideParams> = {
    id: 'slide.command.duplicate-slide',
    type: CommandType.COMMAND,
    handler: (accessor, params) => {
        const commandService = accessor.get(ICommandService);
        const undoRedoService = accessor.get(IUndoRedoService);
        const instances = accessor.get(IUniverInstanceService);

        const unitId = params?.unitId ?? instances.getFocusedUnit()?.getUnitId();
        if (!unitId) return false;
        const model = instances.getUnit<SlideDataModel>(unitId);
        if (!model) return false;

        const sourcePage = params?.pageId ? model.getPage(params.pageId) : model.getActivePage();
        if (!sourcePage) return false;

        const order = model.getPageOrder();
        if (!order) return false;
        const sourceIdx = order.indexOf(sourcePage.id);
        const newPageId = generateRandomId(6);

        // Deep clone elements with fresh ids so they don't collide with
        // the source. We only re-id at the page-element layer; nested
        // shape/text properties stay intact.
        const clonedElements: { [id: string]: IPageElement } = {};
        for (const original of Object.values(sourcePage.pageElements ?? {})) {
            const newId = generateRandomId(6);
            clonedElements[newId] = { ...original, id: newId };
        }

        const clone: ISlidePage = {
            ...sourcePage,
            id: newPageId,
            pageElements: clonedElements,
        };

        const insertParams: ISlideInsertPageMutationParams = {
            unitId,
            page: clone,
            index: sourceIdx === -1 ? undefined : sourceIdx + 1,
        };
        const deleteParams: ISlideDeletePageMutationParams = {
            unitId,
            pageId: newPageId,
        };

        const ok = commandService.syncExecuteCommand(SlideInsertPageMutation.id, insertParams);
        if (!ok) return false;

        // Canvas hint — same path AppendSlide uses. CanvasView reads the
        // most recently appended page off the model and creates its scene.
        accessor.get(CanvasView).appendPage(unitId);

        undoRedoService.pushUndoRedo({
            unitID: unitId,
            undoMutations: [{ id: SlideDeletePageMutation.id, params: deleteParams }],
            redoMutations: [{ id: SlideInsertPageMutation.id, params: insertParams }],
        });

        return true;
    },
};

// Remove a slide. Uses SlideDeletePageMutation; undo restores via the
// SlideInsertPageMutation with the captured snapshot.
export const SlideDeleteSlideCommand: ICommand<IDuplicateSlideParams> = {
    id: 'slide.command.delete-slide',
    type: CommandType.COMMAND,
    handler: (accessor, params) => {
        const commandService = accessor.get(ICommandService);
        const undoRedoService = accessor.get(IUndoRedoService);
        const instances = accessor.get(IUniverInstanceService);

        const unitId = params?.unitId ?? instances.getFocusedUnit()?.getUnitId();
        if (!unitId) return false;
        const model = instances.getUnit<SlideDataModel>(unitId);
        if (!model) return false;

        const page = params?.pageId ? model.getPage(params.pageId) : model.getActivePage();
        if (!page) return false;

        const order = model.getPageOrder();
        if (!order || order.length <= 1) return false; // refuse to delete the last slide

        const sourceIdx = order.indexOf(page.id);
        const captured: ISlidePage = JSON.parse(JSON.stringify(page));

        const deleteParams: ISlideDeletePageMutationParams = { unitId, pageId: page.id };
        const insertParams: ISlideInsertPageMutationParams = {
            unitId,
            page: captured,
            index: sourceIdx,
        };

        const ok = commandService.syncExecuteCommand(SlideDeletePageMutation.id, deleteParams);
        if (!ok) return false;

        undoRedoService.pushUndoRedo({
            unitID: unitId,
            undoMutations: [{ id: SlideInsertPageMutation.id, params: insertParams }],
            redoMutations: [{ id: SlideDeletePageMutation.id, params: deleteParams }],
        });

        return true;
    },
};
