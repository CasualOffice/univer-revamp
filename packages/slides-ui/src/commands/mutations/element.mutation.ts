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

import type { IMutation } from '@univerjs/core';
import type { IPageElement, ISlidePage, SlideDataModel } from '@univerjs/slides';
import { CommandType, IUniverInstanceService, merge } from '@univerjs/core';

// State-changing mutations for slide page elements. These are the unit of
// collab broadcast — anything that needs to round-trip to peers must go
// through one of these. ICommandService.onMutationExecutedForCollab fires
// only for CommandType.MUTATION commands.
//
// The previous slide element operations (insert-text, insert-shape, etc.)
// were declared as CommandType.OPERATION, which by Univer's own convention
// means "transient/UI state, no persisted snapshot change" — so the collab
// hook silently dropped them. This file is the corrected layer.

export interface ISlideInsertElementMutationParams {
    unitId: string;
    pageId: string;
    element: IPageElement;
}

export const SlideInsertElementMutation: IMutation<ISlideInsertElementMutationParams> = {
    id: 'slide.mutation.insert-element',
    type: CommandType.MUTATION,
    handler: (accessor, params) => {
        if (!params) return false;
        const instances = accessor.get(IUniverInstanceService);
        const model = instances.getUnit<SlideDataModel>(params.unitId);
        if (!model) return false;

        const page = model.getPage(params.pageId);
        if (!page) return false;

        page.pageElements[params.element.id] = params.element;
        model.updatePage(params.pageId, page);
        model.incrementRev();
        return true;
    },
};

export interface ISlideDeleteElementMutationParams {
    unitId: string;
    pageId: string;
    elementId: string;
}

export const SlideDeleteElementMutation: IMutation<ISlideDeleteElementMutationParams> = {
    id: 'slide.mutation.delete-element',
    type: CommandType.MUTATION,
    handler: (accessor, params) => {
        if (!params) return false;
        const instances = accessor.get(IUniverInstanceService);
        const model = instances.getUnit<SlideDataModel>(params.unitId);
        if (!model) return false;

        const page = model.getPage(params.pageId);
        if (!page) return false;

        delete page.pageElements[params.elementId];
        model.updatePage(params.pageId, page);
        model.incrementRev();
        return true;
    },
};

export interface ISlideUpdateElementMutationParams {
    unitId: string;
    pageId: string;
    elementId: string;
    /**
     * Deep-merged into the existing element via @univerjs/core `merge`.
     * Passing the full IPageElement is the simplest path — small transform
     * diffs (left/top/width/height) work equally well as a partial.
     */
    props: Partial<IPageElement> & Record<string, unknown>;
}

export const SlideUpdateElementMutation: IMutation<ISlideUpdateElementMutationParams> = {
    id: 'slide.mutation.update-element',
    type: CommandType.MUTATION,
    handler: (accessor, params) => {
        if (!params) return false;
        const instances = accessor.get(IUniverInstanceService);
        const model = instances.getUnit<SlideDataModel>(params.unitId);
        if (!model) return false;

        const page = model.getPage(params.pageId);
        if (!page) return false;
        const existing = page.pageElements[params.elementId];
        if (!existing) return false;

        page.pageElements[params.elementId] = merge(existing, params.props) as IPageElement;
        model.updatePage(params.pageId, page);
        model.incrementRev();
        return true;
    },
};

export interface ISlideInsertPageMutationParams {
    unitId: string;
    page: ISlidePage;
    /**
     * Optional 0-based insertion index in pageOrder. If omitted, the page
     * is appended at the end. Reusing the SlideDataModel.appendPage helper
     * means we get its active-page anchoring for free; for inserts in the
     * middle, the COMMAND layer can normalize before dispatch.
     */
    index?: number;
}

export const SlideInsertPageMutation: IMutation<ISlideInsertPageMutationParams> = {
    id: 'slide.mutation.insert-page',
    type: CommandType.MUTATION,
    handler: (accessor, params) => {
        if (!params) return false;
        const instances = accessor.get(IUniverInstanceService);
        const model = instances.getUnit<SlideDataModel>(params.unitId);
        if (!model) return false;

        const snapshot = model.getSnapshot();
        if (!snapshot.body) return false;

        snapshot.body.pages[params.page.id] = params.page;
        if (typeof params.index === 'number' && params.index >= 0 && params.index <= snapshot.body.pageOrder.length) {
            snapshot.body.pageOrder.splice(params.index, 0, params.page.id);
        } else {
            snapshot.body.pageOrder.push(params.page.id);
        }
        model.incrementRev();
        return true;
    },
};

export interface ISlideUpdatePageMutationParams {
    unitId: string;
    pageId: string;
    /** Partial page-level fields to merge in (background fill, color scheme, title, description). */
    patch: Partial<ISlidePage> & Record<string, unknown>;
}

export const SlideUpdatePageMutation: IMutation<ISlideUpdatePageMutationParams> = {
    id: 'slide.mutation.update-page',
    type: CommandType.MUTATION,
    handler: (accessor, params) => {
        if (!params) return false;
        const instances = accessor.get(IUniverInstanceService);
        const model = instances.getUnit<SlideDataModel>(params.unitId);
        if (!model) return false;
        const page = model.getPage(params.pageId);
        if (!page) return false;

        // Merge a shallow patch of page-level fields. pageElements (the
        // big object map) is left alone — element changes go through
        // SlideUpdateElementMutation.
        const merged = merge(page, params.patch) as ISlidePage;
        model.updatePage(params.pageId, merged);
        model.incrementRev();
        return true;
    },
};

export interface ISlideDeletePageMutationParams {
    unitId: string;
    pageId: string;
}

export const SlideDeletePageMutation: IMutation<ISlideDeletePageMutationParams> = {
    id: 'slide.mutation.delete-page',
    type: CommandType.MUTATION,
    handler: (accessor, params) => {
        if (!params) return false;
        const instances = accessor.get(IUniverInstanceService);
        const model = instances.getUnit<SlideDataModel>(params.unitId);
        if (!model) return false;

        const snapshot = model.getSnapshot();
        if (!snapshot.body) return false;

        delete snapshot.body.pages[params.pageId];
        const orderIdx = snapshot.body.pageOrder.indexOf(params.pageId);
        if (orderIdx !== -1) snapshot.body.pageOrder.splice(orderIdx, 1);
        model.incrementRev();
        return true;
    },
};
