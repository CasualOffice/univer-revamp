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

import type { IPageElement, PageElementType, SlideDataModel } from '@univerjs/slides';
import type { ISlideDeleteElementMutationParams, ISlideUpdateElementMutationParams } from '../commands/mutations/element.mutation';
import { FBaseInitialable } from '@univerjs/core/facade';
import { ICommandService, Inject, Injector } from '@univerjs/core';
import { SlideDeleteElementMutation, SlideUpdateElementMutation } from '../commands/mutations/element.mutation';

export interface IFElementTransform {
    left: number;
    top: number;
    width?: number;
    height?: number;
    /** Rotation in degrees. */
    rotation?: number;
}

/**
 * Facade wrapper for a single page element. Reads are live against the model;
 * writes go through the element MUTATIONs (collab-safe, page-targeted).
 *
 * Note: facade writes dispatch the mutation directly and do not push an
 * undo/redo entry — use the UI command operations for undoable edits.
 */
export class FElement extends FBaseInitialable {
    constructor(
        private readonly _model: SlideDataModel,
        private readonly _pageId: string,
        private readonly _elementId: string,
        @Inject(Injector) protected override readonly _injector: Injector,
        @ICommandService private readonly _commandService: ICommandService
    ) {
        super(_injector);
    }

    getId(): string {
        return this._elementId;
    }

    /** The live element, or undefined if it has been removed. */
    getRaw(): IPageElement | undefined {
        return this._model.getElement(this._pageId, this._elementId);
    }

    getType(): PageElementType | undefined {
        return this.getRaw()?.type;
    }

    getTransform(): IFElementTransform | undefined {
        const el = this.getRaw();
        if (!el) return undefined;
        return { left: el.left ?? 0, top: el.top ?? 0, width: el.width, height: el.height, rotation: el.angle };
    }

    /** Merge transform/props into the element via SlideUpdateElementMutation. */
    setTransform(transform: IFElementTransform): boolean {
        const props: Partial<IPageElement> & Record<string, unknown> = {
            left: transform.left,
            top: transform.top,
        };
        if (transform.width !== undefined) props.width = transform.width;
        if (transform.height !== undefined) props.height = transform.height;
        if (transform.rotation !== undefined) props.angle = transform.rotation;

        const params: ISlideUpdateElementMutationParams = {
            unitId: this._model.getUnitId(),
            pageId: this._pageId,
            elementId: this._elementId,
            props,
        };
        return this._commandService.syncExecuteCommand(SlideUpdateElementMutation.id, params);
    }

    /** Remove this element from its page via SlideDeleteElementMutation. */
    remove(): boolean {
        const params: ISlideDeleteElementMutationParams = {
            unitId: this._model.getUnitId(),
            pageId: this._pageId,
            elementId: this._elementId,
        };
        return this._commandService.syncExecuteCommand(SlideDeleteElementMutation.id, params);
    }
}
