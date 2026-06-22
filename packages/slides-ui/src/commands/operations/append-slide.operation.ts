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
import type { ISlideDeletePageMutationParams, ISlideInsertPageMutationParams } from '../mutations/element.mutation';

import { CommandType, ICommandService, IUndoRedoService, IUniverInstanceService } from '@univerjs/core';
import { CanvasView } from '../../controllers/canvas-view';
import { SlideDeletePageMutation, SlideInsertPageMutation } from '../mutations/element.mutation';

export interface IAppendSlideOperationParams {
    unitId: string;
}

// The COMMAND layer mints the new page id (so all peers agree on it via the
// broadcast payload), then routes through SlideInsertPageMutation. Inverse
// is SlideDeletePageMutation for undo support. The canvas hint
// (createPageScene + slide.addPageScene) runs on the originator via
// CanvasView.appendPage; peers re-render through the renderer's own
// subscription path.
export const AppendSlideOperation: ICommand<IAppendSlideOperationParams> = {
    id: 'slide.operation.append-slide',
    type: CommandType.COMMAND,
    handler: (accessor, params) => {
        if (!params?.unitId) return false;
        const commandService = accessor.get(ICommandService);
        const undoRedoService = accessor.get(IUndoRedoService);
        const instances = accessor.get(IUniverInstanceService);

        const model = instances.getUnit<SlideDataModel>(params.unitId);
        if (!model) return false;

        // Mint the new page via the model's helper so id/defaults match the
        // shape the rest of slides-ui already produces.
        const newPage = model.getBlankPage();

        // Insert directly after the active page (PowerPoint "New Slide"
        // semantics) rather than at the very end. Fall back to append when
        // there's no active page or it isn't found in the order.
        const pageOrder = model.getPageOrder() ?? [];
        const activeId = model.getActivePage()?.id;
        const activeIdx = activeId ? pageOrder.indexOf(activeId) : -1;
        const insertIndex = activeIdx >= 0 ? activeIdx + 1 : undefined;

        const insertParams: ISlideInsertPageMutationParams = {
            unitId: params.unitId,
            page: newPage,
            index: insertIndex,
        };
        const deleteParams: ISlideDeletePageMutationParams = {
            unitId: params.unitId,
            pageId: newPage.id,
        };

        const ok = commandService.syncExecuteCommand(SlideInsertPageMutation.id, insertParams);
        if (!ok) return false;

        // Canvas hint — create the page scene on the originator's renderer.
        // CanvasView.appendPage takes a single unitId arg and internally
        // pulls the most recent page off the model. We bypass that and
        // poke the renderer's slide controller directly via the public
        // canvas-view path so the page we just inserted is the one
        // rendered, even if other mutations land between.
        const canvasView = accessor.get(CanvasView);
        canvasView.appendPage(params.unitId);

        undoRedoService.pushUndoRedo({
            unitID: params.unitId,
            undoMutations: [{ id: SlideDeletePageMutation.id, params: deleteParams }],
            redoMutations: [{ id: SlideInsertPageMutation.id, params: insertParams }],
        });

        return true;
    },
};
