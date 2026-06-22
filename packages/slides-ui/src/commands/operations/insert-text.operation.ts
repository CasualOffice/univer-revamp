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
import type { IPageElement, SlideDataModel } from '@univerjs/slides';
import type { ISlideDeleteElementMutationParams, ISlideInsertElementMutationParams } from '../mutations/element.mutation';
import { CommandType, generateRandomId, ICommandService, IUndoRedoService, IUniverInstanceService } from '@univerjs/core';
import { PageElementType } from '@univerjs/slides';
import { CanvasView } from '../../controllers/canvas-view';
import { SlideDeleteElementMutation, SlideInsertElementMutation } from '../mutations/element.mutation';

export interface ISlideAddTextParam {
    text: string;
    unitId: string;
};

export const SlideAddTextCommand: ICommand = {
    id: 'slide.command.add-text',
    type: CommandType.COMMAND,
    handler: async (accessor) => {
        const commandService = accessor.get(ICommandService);
        const univerInstanceService = accessor.get(IUniverInstanceService);
        const unitId = univerInstanceService.getFocusedUnit()?.getUnitId();
        return await commandService.executeCommand(SlideAddTextOperation.id, { unitId });
    },

};

// Inserting a text frame is a persisted snapshot change, so it must route
// through SlideInsertElementMutation (CommandType.MUTATION) — not mutate
// pageElements directly. This mirrors insertShape(): dispatch the mutation,
// optimistically paint on the originator's canvas, then push the
// (delete, insert) pair to undo/redo. See element.mutation.ts for why.
export const SlideAddTextOperation: ICommand<ISlideAddTextParam> = {
    id: 'slide.operation.add-text',
    type: CommandType.COMMAND,
    handler: (accessor, params) => {
        const unitId = params?.unitId;
        if (!unitId) return false;

        const commandService = accessor.get(ICommandService);
        const undoRedoService = accessor.get(IUndoRedoService);
        const univerInstanceService = accessor.get(IUniverInstanceService);

        const slideData = univerInstanceService.getUnit<SlideDataModel>(unitId);
        if (!slideData) return false;

        const activePage = slideData.getActivePage();
        if (!activePage) return false;

        const elementId = generateRandomId(6);
        const elements = Object.values(activePage.pageElements);
        const maxIndex = elements.length ? Math.max(...elements.map((element) => element.zIndex)) : 21;
        const textContent = params?.text || 'A New Text';
        const element: IPageElement = {
            id: elementId,
            zIndex: maxIndex + 1,
            left: 230,
            top: 142,
            width: 220,
            height: 40,
            title: 'text',
            description: '',
            type: PageElementType.TEXT,
            richText: {
                text: textContent,
                fs: 30,
                cl: {
                    rgb: 'rgb(51, 51, 51)',
                },
                bl: 1,
            },
        };

        const insertParams: ISlideInsertElementMutationParams = {
            unitId,
            pageId: activePage.id,
            element,
        };
        const ok = commandService.syncExecuteCommand(SlideInsertElementMutation.id, insertParams);
        if (!ok) return false;

        const canvasview = accessor.get(CanvasView);
        const sceneObject = canvasview.createObjectToPage(element, activePage.id, unitId);
        // make object active: a control rect wrap the object.
        if (sceneObject) {
            canvasview.setObjectActiveByPage(sceneObject, activePage.id, unitId);
        }

        const deleteParams: ISlideDeleteElementMutationParams = {
            unitId,
            pageId: activePage.id,
            elementId,
        };
        undoRedoService.pushUndoRedo({
            unitID: unitId,
            undoMutations: [{ id: SlideDeleteElementMutation.id, params: deleteParams }],
            redoMutations: [{ id: SlideInsertElementMutation.id, params: insertParams }],
        });

        return true;
    },
};
