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

import type { ISlideData, SlideDataModel } from '@univerjs/slides';
import { FBaseInitialable } from '@univerjs/core/facade';
import { ICommandService, Inject, Injector } from '@univerjs/core';
import { AppendSlideOperation } from '../commands/operations/append-slide.operation';
import { FPage } from './f-page';

/**
 * Facade wrapper for a presentation (a slide deck / unit).
 */
export class FSlide extends FBaseInitialable {
    constructor(
        private readonly _model: SlideDataModel,
        @Inject(Injector) protected override readonly _injector: Injector,
        @ICommandService private readonly _commandService: ICommandService
    ) {
        super(_injector);
    }

    /** The underlying data model. */
    getModel(): SlideDataModel {
        return this._model;
    }

    getId(): string {
        return this._model.getUnitId();
    }

    getName(): string {
        return this._model.getSnapshot().title;
    }

    setName(name: string): void {
        this._model.setName(name);
    }

    /** A detached, canonical snapshot (see SlideDataModel.serialize). */
    serialize(): ISlideData {
        return this._model.serialize();
    }

    getActivePageId(): string | null {
        return this._model.getActivePage()?.id ?? null;
    }

    getActivePage(): FPage | null {
        const id = this.getActivePageId();
        return id ? this._createPage(id) : null;
    }

    getPageCount(): number {
        return this._model.getPageOrder()?.length ?? 0;
    }

    /** Pages in presentation order. */
    getPages(): FPage[] {
        const order = this._model.getPageOrder() ?? [];
        return order.map((pageId) => this._createPage(pageId));
    }

    getPageById(pageId: string): FPage | null {
        if (!this._model.getPage(pageId)) return null;
        return this._createPage(pageId);
    }

    /** Append a blank slide after the active page; returns the new FPage. */
    appendSlide(): FPage | null {
        const before = new Set(this._model.getPageOrder() ?? []);
        const ok = this._commandService.syncExecuteCommand(AppendSlideOperation.id, { unitId: this.getId() });
        if (!ok) return null;
        const after = this._model.getPageOrder() ?? [];
        const newId = after.find((id) => !before.has(id));
        return newId ? this._createPage(newId) : null;
    }

    private _createPage(pageId: string): FPage {
        return this._injector.createInstance(FPage, this._model, pageId);
    }
}
