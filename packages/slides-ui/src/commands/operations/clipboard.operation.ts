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

import type { IAccessor, ICommand, IMutationInfo } from '@univerjs/core';
import type { IPageElement, SlideDataModel } from '@univerjs/slides';
import type {
    ISlideDeleteElementMutationParams,
    ISlideInsertElementMutationParams,
} from '../mutations/element.mutation';
import { CommandType, generateRandomId, ICommandService, IUndoRedoService, IUniverInstanceService } from '@univerjs/core';
import { SlideDeleteElementMutation, SlideInsertElementMutation } from '../mutations/element.mutation';

// In-memory clipboard buffer for page elements. Module-level so it survives
// across command invocations within a session. Holds deep clones so later
// edits to the live model never leak into a previously copied element.
let clipboardBuffer: IPageElement[] = [];

const PASTE_OFFSET = 10;

/** Deep clone an element so the buffer is decoupled from the live model. */
function cloneElement(element: IPageElement): IPageElement {
    if (typeof structuredClone === 'function') {
        return structuredClone(element);
    }
    return JSON.parse(JSON.stringify(element)) as IPageElement;
}

/** Test-friendly accessor for the current buffer contents (read-only copy). */
export function getSlideClipboardBuffer(): IPageElement[] {
    return clipboardBuffer.map((element) => cloneElement(element));
}

export function clearSlideClipboardBuffer(): void {
    clipboardBuffer = [];
}

/** Normalize the params into a non-empty id list, falling back to a single id. */
function resolveIds(params?: { ids?: string[]; id?: string }): string[] {
    if (!params) return [];
    if (params.ids && params.ids.length) return params.ids;
    if (params.id) return [params.id];
    return [];
}

export interface ISlideCopyElementCommandParams {
    unitId: string;
    /** Element ids to copy. A single `id` is also accepted. */
    ids?: string[];
    id?: string;
}

/**
 * Copy the selected element(s) on the active page into the in-memory buffer.
 * Elements are cloned deeply on copy so the buffer is a stable snapshot.
 */
export const SlideCopyElementCommand: ICommand<ISlideCopyElementCommandParams> = {
    id: 'slide.command.copy-element',
    type: CommandType.COMMAND,
    handler: (accessor: IAccessor, params?: ISlideCopyElementCommandParams) => {
        if (!params?.unitId) return false;
        const instances = accessor.get(IUniverInstanceService);
        const model = instances.getUnit<SlideDataModel>(params.unitId);
        if (!model) return false;

        const activePage = model.getActivePage();
        if (!activePage) return false;

        const ids = resolveIds(params);
        if (!ids.length) return false;

        const cloned: IPageElement[] = [];
        for (const id of ids) {
            const element = activePage.pageElements[id];
            if (element) cloned.push(cloneElement(element));
        }
        if (!cloned.length) return false;

        clipboardBuffer = cloned;
        return true;
    },
};

export interface ISlideCutElementCommandParams {
    unitId: string;
    ids?: string[];
    id?: string;
}

/**
 * Cut = copy into the buffer, then delete the originals via
 * SlideDeleteElementMutation (with an insert inverse pushed to undo/redo).
 */
export const SlideCutElementCommand: ICommand<ISlideCutElementCommandParams> = {
    id: 'slide.command.cut-element',
    type: CommandType.COMMAND,
    handler: (accessor: IAccessor, params?: ISlideCutElementCommandParams) => {
        if (!params?.unitId) return false;
        const commandService = accessor.get(ICommandService);
        const undoRedoService = accessor.get(IUndoRedoService);
        const instances = accessor.get(IUniverInstanceService);
        const model = instances.getUnit<SlideDataModel>(params.unitId);
        if (!model) return false;

        const activePage = model.getActivePage();
        if (!activePage) return false;

        const ids = resolveIds(params);
        if (!ids.length) return false;

        // Resolve the live elements first so we can both buffer them and
        // build the undo (re-insert) inverse before they are removed.
        const targets: IPageElement[] = [];
        for (const id of ids) {
            const element = activePage.pageElements[id];
            if (element) targets.push(element);
        }
        if (!targets.length) return false;

        clipboardBuffer = targets.map((element) => cloneElement(element));

        const redoMutations: IMutationInfo[] = [];
        const undoMutations: IMutationInfo[] = [];
        for (const element of targets) {
            const deleteParams: ISlideDeleteElementMutationParams = {
                unitId: params.unitId,
                pageId: activePage.id,
                elementId: element.id,
            };
            const ok = commandService.syncExecuteCommand(SlideDeleteElementMutation.id, deleteParams);
            if (!ok) continue;

            redoMutations.push({ id: SlideDeleteElementMutation.id, params: deleteParams });
            const insertParams: ISlideInsertElementMutationParams = {
                unitId: params.unitId,
                pageId: activePage.id,
                element: cloneElement(element),
            };
            undoMutations.unshift({ id: SlideInsertElementMutation.id, params: insertParams });
        }

        if (!redoMutations.length) return false;

        undoRedoService.pushUndoRedo({
            unitID: params.unitId,
            undoMutations,
            redoMutations,
        });

        return true;
    },
};

/**
 * Shared paste path. Inserts each buffered element onto the given page with a
 * fresh id and a small offset, dispatching SlideInsertElementMutation and
 * pushing a (delete, insert) pair to undo/redo. Returns the ids created.
 */
function pasteElements(
    accessor: IAccessor,
    unitId: string,
    pageId: string,
    source: IPageElement[]
): string[] {
    if (!source.length) return [];
    const commandService = accessor.get(ICommandService);
    const undoRedoService = accessor.get(IUndoRedoService);

    const redoMutations: IMutationInfo[] = [];
    const undoMutations: IMutationInfo[] = [];
    const createdIds: string[] = [];

    for (const buffered of source) {
        const element = cloneElement(buffered);
        element.id = generateRandomId(6);
        element.title = element.id;
        element.left = (element.left ?? 0) + PASTE_OFFSET;
        element.top = (element.top ?? 0) + PASTE_OFFSET;

        const insertParams: ISlideInsertElementMutationParams = {
            unitId,
            pageId,
            element,
        };
        const ok = commandService.syncExecuteCommand(SlideInsertElementMutation.id, insertParams);
        if (!ok) continue;

        createdIds.push(element.id);
        redoMutations.push({ id: SlideInsertElementMutation.id, params: insertParams });
        const deleteParams: ISlideDeleteElementMutationParams = {
            unitId,
            pageId,
            elementId: element.id,
        };
        undoMutations.unshift({ id: SlideDeleteElementMutation.id, params: deleteParams });
    }

    if (createdIds.length) {
        undoRedoService.pushUndoRedo({
            unitID: unitId,
            undoMutations,
            redoMutations,
        });
    }

    return createdIds;
}

export interface ISlidePasteElementCommandParams {
    unitId: string;
}

/**
 * Paste the buffered element(s) onto the active page. Each pasted copy gets a
 * fresh id and a +offset so it does not overlap the source exactly.
 */
export const SlidePasteElementCommand: ICommand<ISlidePasteElementCommandParams> = {
    id: 'slide.command.paste-element',
    type: CommandType.COMMAND,
    handler: (accessor: IAccessor, params?: ISlidePasteElementCommandParams) => {
        if (!params?.unitId) return false;
        if (!clipboardBuffer.length) return false;
        const instances = accessor.get(IUniverInstanceService);
        const model = instances.getUnit<SlideDataModel>(params.unitId);
        if (!model) return false;

        const activePage = model.getActivePage();
        if (!activePage) return false;

        const createdIds = pasteElements(accessor, params.unitId, activePage.id, clipboardBuffer);
        return createdIds.length > 0;
    },
};

export interface ISlideDuplicateElementCommandParams {
    unitId: string;
    ids?: string[];
    id?: string;
}

/**
 * Duplicate the selected element(s) in place: copy then paste in one step,
 * each duplicate getting a fresh id and a +offset. Does not disturb the
 * persistent clipboard buffer.
 */
export const SlideDuplicateElementCommand: ICommand<ISlideDuplicateElementCommandParams> = {
    id: 'slide.command.duplicate-element',
    type: CommandType.COMMAND,
    handler: (accessor: IAccessor, params?: ISlideDuplicateElementCommandParams) => {
        if (!params?.unitId) return false;
        const instances = accessor.get(IUniverInstanceService);
        const model = instances.getUnit<SlideDataModel>(params.unitId);
        if (!model) return false;

        const activePage = model.getActivePage();
        if (!activePage) return false;

        const ids = resolveIds(params);
        if (!ids.length) return false;

        const source: IPageElement[] = [];
        for (const id of ids) {
            const element = activePage.pageElements[id];
            if (element) source.push(cloneElement(element));
        }
        if (!source.length) return false;

        const createdIds = pasteElements(accessor, params.unitId, activePage.id, source);
        return createdIds.length > 0;
    },
};
