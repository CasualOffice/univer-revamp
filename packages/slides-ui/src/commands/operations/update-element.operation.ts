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
import type { ISlideUpdateElementMutationParams } from '../mutations/element.mutation';
import { CommandType, ICommandService, IUndoRedoService, IUniverInstanceService } from '@univerjs/core';
import { SlideUpdateElementMutation } from '../mutations/element.mutation';

export interface IUpdateElementOperationParams {
    unitId: string;
    oKey: string;
    props: Partial<IPageElement> & Record<string, unknown>;
};

// Public command. Captures the element's previous state to build the inverse
// mutation, then dispatches the forward mutation through ICommandService so
// it broadcasts to collab peers and lands in undo/redo.
//
// Naming kept as `UpdateSlideElementOperation` for backwards compatibility
// with callers (drag/resize handlers) that already reference this id —
// `slide.operation.update-element`. The CommandType is now COMMAND (was
// OPERATION); the state-changing piece moves to SlideUpdateElementMutation.
export const UpdateSlideElementOperation: ICommand<IUpdateElementOperationParams> = {
    id: 'slide.operation.update-element',
    type: CommandType.COMMAND,
    handler: (accessor, params) => {
        if (!params) return false;
        const { oKey, props, unitId } = params;
        const commandService = accessor.get(ICommandService);
        const undoRedoService = accessor.get(IUndoRedoService);
        const instances = accessor.get(IUniverInstanceService);

        const model = instances.getUnit<SlideDataModel>(unitId);
        if (!model) return false;

        const activePage = model.getActivePage();
        if (!activePage) return false;

        const before = activePage.pageElements[oKey];
        if (!before) return false;
        // Shallow copy is sufficient for the inverse — the mutation `merge`s
        // recursively, so restoring the captured snapshot recreates the prior
        // state. Deep clone would be defensive but unnecessary; nested objects
        // are not mutated in place by the mutation handler.
        const beforeProps = { ...before };

        const forward: ISlideUpdateElementMutationParams = {
            unitId,
            pageId: activePage.id,
            elementId: oKey,
            props,
        };
        const inverse: ISlideUpdateElementMutationParams = {
            unitId,
            pageId: activePage.id,
            elementId: oKey,
            props: beforeProps,
        };

        const ok = commandService.syncExecuteCommand(SlideUpdateElementMutation.id, forward);
        if (!ok) return false;

        undoRedoService.pushUndoRedo({
            unitID: unitId,
            undoMutations: [{ id: SlideUpdateElementMutation.id, params: inverse }],
            redoMutations: [{ id: SlideUpdateElementMutation.id, params: forward }],
        });

        return true;
    },
};
