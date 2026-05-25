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
import type { IPageElement, SlideDataModel } from '@univerjs/slides';
import { CommandType, IUniverInstanceService } from '@univerjs/core';

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
