/**
 * Copyright 2026-present CasualOffice.
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
import { CommandType, ICommandService, IUndoRedoService, IUniverInstanceService, UniverInstanceType } from '@univerjs/core';
import { DRAWING_IMAGE_ALLOW_IMAGE_LIST, getImageSize, IImageIoService } from '@univerjs/drawing';
import { PageElementType } from '@univerjs/slides';
import { ILocalFileService } from '@univerjs/ui';
import { CanvasView } from '../../controllers/canvas-view';
import { SlideDeleteElementMutation, SlideInsertElementMutation } from '../mutations/element.mutation';

// File picker → image io → IPageElement synthesis happens here (same as
// before). The state-changing piece — page.pageElements[imageId] = data +
// updatePage — moves to SlideInsertElementMutation so it broadcasts on the
// collab bus. Inverse for undo is SlideDeleteElementMutation against the
// new image id.
// eslint-disable-next-line ts/no-empty-object-type
export const InsertSlideFloatImageCommand: ICommand<{}> = {
    id: 'slide.command.insert-float-image',
    type: CommandType.COMMAND,
    handler: async (accessor) => {
        const commandService = accessor.get(ICommandService);
        const undoRedoService = accessor.get(IUndoRedoService);
        const instances = accessor.get(IUniverInstanceService);
        const unitId = instances.getCurrentUnitOfType(UniverInstanceType.UNIVER_SLIDE)?.getUnitId();
        if (!unitId) return false;

        const files = await accessor.get(ILocalFileService).openFile({
            multiple: true,
            accept: DRAWING_IMAGE_ALLOW_IMAGE_LIST.map((img) => `.${img.replace('image/', '')}`).join(','),
        });
        if (files.length !== 1) return false;

        const imageParam = await accessor.get(IImageIoService).saveImage(files[0]);
        if (!imageParam) return false;

        const { imageId, imageSourceType, source, base64Cache } = imageParam;
        const { width, height, image } = await getImageSize(base64Cache || '');

        const model = instances.getUnit<SlideDataModel>(unitId);
        if (!model) return false;
        const activePage = model.getActivePage();
        if (!activePage) return false;

        const existing = Object.values(activePage.pageElements);
        const maxZIndex = existing.length ? Math.max(...existing.map((e) => e.zIndex)) : 20;
        const element: IPageElement = {
            id: imageId,
            zIndex: maxZIndex + 1,
            left: 0,
            top: 0,
            width,
            height,
            title: '',
            description: '',
            type: PageElementType.IMAGE,
            image: {
                imageProperties: {
                    contentUrl: base64Cache,
                    imageSourceType,
                    source,
                    base64Cache,
                    image,
                    // eslint-disable-next-line ts/no-explicit-any
                } as any,
            },
        };

        const insertParams: ISlideInsertElementMutationParams = {
            unitId,
            pageId: activePage.id,
            element,
        };
        const ok = commandService.syncExecuteCommand(SlideInsertElementMutation.id, insertParams);
        if (!ok) return false;

        const canvasView = accessor.get(CanvasView);
        const sceneObject = canvasView.createObjectToPage(element, activePage.id, unitId);
        if (sceneObject) canvasView.setObjectActiveByPage(sceneObject, activePage.id, unitId);

        const deleteParams: ISlideDeleteElementMutationParams = {
            unitId,
            pageId: activePage.id,
            elementId: imageId,
        };
        undoRedoService.pushUndoRedo({
            unitID: unitId,
            undoMutations: [{ id: SlideDeleteElementMutation.id, params: deleteParams }],
            redoMutations: [{ id: SlideInsertElementMutation.id, params: insertParams }],
        });

        return true;
    },
};
