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

import type { IAccessor, ICommand } from '@univerjs/core';
import type { IPageElement, SlideDataModel } from '@univerjs/slides';
import type { ISlideDeleteElementMutationParams, ISlideInsertElementMutationParams } from '../mutations/element.mutation';
import { CommandType, generateRandomId, ICommandService, IUndoRedoService, IUniverInstanceService, LocaleService } from '@univerjs/core';
import { ObjectType } from '@univerjs/engine-render';
import { BasicShapes, PageElementType } from '@univerjs/slides';
import { ISidebarService } from '@univerjs/ui';
import { CanvasView } from '../../controllers/canvas-view';
import { COMPONENT_SLIDE_SIDEBAR } from '../../views/sidebar/Sidebar';
import { SlideDeleteElementMutation, SlideInsertElementMutation } from '../mutations/element.mutation';

export interface IInsertShapeOperationParams {
    unitId: string;
}

// Common path: synthesize the shape element, dispatch SlideInsertElementMutation,
// optimistically paint on the originator's canvas, push the (delete, insert)
// pair to undo/redo. Each variant (rect / ellipse) supplies its own element
// factory; everything else is shared.
function insertShape(
    accessor: IAccessor,
    unitId: string | undefined,
    buildElement: (id: string, zIndex: number) => IPageElement
): boolean {
    if (!unitId) return false;
    const commandService = accessor.get(ICommandService);
    const undoRedoService = accessor.get(IUndoRedoService);
    const instances = accessor.get(IUniverInstanceService);
    const model = instances.getUnit<SlideDataModel>(unitId);
    if (!model) return false;
    const activePage = model.getActivePage();
    if (!activePage) return false;

    const elementId = generateRandomId(6);
    const existing = Object.values(activePage.pageElements);
    const maxZIndex = existing.length ? Math.max(...existing.map((e) => e.zIndex)) : 20;
    const element = buildElement(elementId, maxZIndex + 1);

    const insertParams: ISlideInsertElementMutationParams = {
        unitId,
        pageId: activePage.id,
        element,
    };
    const ok = commandService.syncExecuteCommand(SlideInsertElementMutation.id, insertParams);
    if (!ok) return false;

    const canvasview = accessor.get(CanvasView);
    const sceneObject = canvasview.createObjectToPage(element, activePage.id, unitId);
    if (sceneObject) canvasview.setObjectActiveByPage(sceneObject, activePage.id, unitId);

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
}

export const InsertSlideShapeRectangleCommand: ICommand = {
    id: 'slide.command.insert-float-shape.rectangle',
    type: CommandType.COMMAND,
    handler: (accessor: IAccessor) => {
        const unitId = accessor.get(IUniverInstanceService).getFocusedUnit()?.getUnitId();
        const commandService = accessor.get(ICommandService);
        return commandService.syncExecuteCommand(InsertSlideShapeRectangleOperation.id, { unitId });
    },
};

export const InsertSlideShapeRectangleOperation: ICommand<IInsertShapeOperationParams> = {
    id: 'slide.operation.insert-float-shape.rectangle',
    type: CommandType.COMMAND,
    handler: (accessor, params) =>
        insertShape(accessor, params?.unitId, (id, zIndex) => ({
            id,
            zIndex,
            left: 378,
            top: 142,
            width: 250,
            height: 250,
            title: id,
            description: '',
            type: PageElementType.SHAPE,
            shape: {
                shapeType: BasicShapes.Rect,
                text: '',
                shapeProperties: {
                    shapeBackgroundFill: { rgb: 'rgb(0,0,255)' },
                },
            },
        })),
};

export interface IToggleSlideEditSidebarOperation {
    visible: string;
    objectType: ObjectType;
}

export const ToggleSlideEditSidebarOperation: ICommand = {
    id: 'sidebar.operation.slide-shape',
    type: CommandType.COMMAND,
    handler: async (accessor: IAccessor, params: IToggleSlideEditSidebarOperation) => {
        const { visible, objectType } = params;

        const sidebarService = accessor.get(ISidebarService);
        const localeService = accessor.get(LocaleService);

        let title = '';
        let children = '';
        if (objectType === ObjectType.RECT) {
            title = 'slides-ui.sidebar.shape';
            children = COMPONENT_SLIDE_SIDEBAR;
        } else if (objectType === ObjectType.IMAGE) {
            title = 'slides-ui.sidebar.image';
            children = COMPONENT_SLIDE_SIDEBAR;
        } else if (objectType === ObjectType.RICH_TEXT) {
            title = 'slides-ui.sidebar.text';
            children = COMPONENT_SLIDE_SIDEBAR;
        }

        if (visible) {
            sidebarService.open({
                header: { title: localeService.t(title) },
                children: { label: children },
                onClose: () => {
                        // drawingManagerService.focusDrawing(null);
                },
                width: 360,
            });
        } else {
            sidebarService.close();
        }
        return true;
    },
};

export const InsertSlideShapeEllipseCommand: ICommand = {
    id: 'slide.command.insert-float-shape.ellipse',
    type: CommandType.COMMAND,
    handler: (accessor: IAccessor) => {
        const unitId = accessor.get(IUniverInstanceService).getFocusedUnit()?.getUnitId();
        const commandService = accessor.get(ICommandService);
        return commandService.syncExecuteCommand(InsertSlideShapeEllipseOperation.id, { unitId });
    },
};

export const InsertSlideShapeEllipseOperation: ICommand<IInsertShapeOperationParams> = {
    id: 'slide.operation.insert-float-shape.ellipse',
    type: CommandType.COMMAND,
    handler: (accessor, params) =>
        insertShape(accessor, params?.unitId, (id, zIndex) => ({
            id,
            zIndex,
            left: 378,
            top: 142,
            width: 250,
            height: 250,
            title: id,
            description: '',
            type: PageElementType.SHAPE,
            shape: {
                shapeType: BasicShapes.Ellipse,
                text: '',
                shapeProperties: {
                    radius: 100,
                    shapeBackgroundFill: { rgb: 'rgb(0,0,255)' },
                },
            },
        })),
};
