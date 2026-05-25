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
import type { SlideDataModel } from '@univerjs/slides';
import type { ISlideDeleteElementMutationParams, ISlideInsertElementMutationParams } from '../mutations/element.mutation';
import { CommandType, ICommandService, IUndoRedoService, IUniverInstanceService } from '@univerjs/core';
import { CanvasView } from '../../controllers/canvas-view';
import { SlideDeleteElementMutation, SlideInsertElementMutation } from '../mutations/element.mutation';

export interface IDeleteElementOperationParams {
    unitId: string;
    id: string;
};

// Captures the element about to be deleted so the inverse (insert) can
// restore it. Goes through SlideDeleteElementMutation → broadcast + undo
// stack. The canvas hint runs on the originator; peers re-render via the
// renderer's own subscription path.
export const DeleteSlideElementOperation: ICommand<IDeleteElementOperationParams> = {
    id: 'slide.operation.delete-element',
    type: CommandType.COMMAND,
    handler: (accessor, params) => {
        if (!params?.id || !params.unitId) return false;

        const commandService = accessor.get(ICommandService);
        const undoRedoService = accessor.get(IUndoRedoService);
        const instances = accessor.get(IUniverInstanceService);

        const model = instances.getUnit<SlideDataModel>(params.unitId);
        if (!model) return false;

        const activePage = model.getActivePage();
        if (!activePage) return false;

        const element = activePage.pageElements[params.id];
        if (!element) return false;

        const deleteParams: ISlideDeleteElementMutationParams = {
            unitId: params.unitId,
            pageId: activePage.id,
            elementId: params.id,
        };
        const insertParams: ISlideInsertElementMutationParams = {
            unitId: params.unitId,
            pageId: activePage.id,
            element: { ...element },
        };

        const ok = commandService.syncExecuteCommand(SlideDeleteElementMutation.id, deleteParams);
        if (!ok) return false;

        const canvasview = accessor.get(CanvasView);
        canvasview.removeObjectById(params.id, activePage.id, params.unitId);

        undoRedoService.pushUndoRedo({
            unitID: params.unitId,
            undoMutations: [{ id: SlideInsertElementMutation.id, params: insertParams }],
            redoMutations: [{ id: SlideDeleteElementMutation.id, params: deleteParams }],
        });

        return true;
    },
};
