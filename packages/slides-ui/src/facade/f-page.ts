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

import type { ISlidePage, SlideDataModel } from '@univerjs/slides';
import { FBaseInitialable } from '@univerjs/core/facade';
import { Inject, Injector } from '@univerjs/core';
import { FElement } from './f-element';

/**
 * Facade wrapper for a slide page (a slide, layout, master, or notes page).
 */
export class FPage extends FBaseInitialable {
    constructor(
        private readonly _model: SlideDataModel,
        private readonly _pageId: string,
        @Inject(Injector) protected override readonly _injector: Injector
    ) {
        super(_injector);
    }

    getId(): string {
        return this._pageId;
    }

    /** The live page, or undefined if it has been removed. */
    getRaw(): ISlidePage | undefined {
        return this._model.getPage(this._pageId);
    }

    getTitle(): string | undefined {
        return this.getRaw()?.title;
    }

    getElementCount(): number {
        const elements = this._model.getElementsByPage(this._pageId);
        return elements ? Object.keys(elements).length : 0;
    }

    getElements(): FElement[] {
        const elements = this._model.getElementsByPage(this._pageId);
        if (!elements) return [];
        return Object.keys(elements).map((elementId) => this._createElement(elementId));
    }

    getElementById(elementId: string): FElement | null {
        if (!this._model.getElement(this._pageId, elementId)) return null;
        return this._createElement(elementId);
    }

    private _createElement(elementId: string): FElement {
        return this._injector.createInstance(FElement, this._model, this._pageId, elementId);
    }
}
