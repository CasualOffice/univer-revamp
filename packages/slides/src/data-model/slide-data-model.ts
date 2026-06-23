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

import type { Nullable } from '@univerjs/core';
import type { Observable } from 'rxjs';
import type { ISlideData, ISlidePage } from '../types/interfaces/i-slide-data';
import { generateRandomId, UnitModel, UniverInstanceType } from '@univerjs/core';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_SLIDE } from '../basics/const/default-slide';
import { PageType } from '../types/interfaces/i-slide-data';
import { migrateSlideSnapshot, serializeSlideSnapshot } from './migrate';

export class SlideDataModel extends UnitModel<ISlideData, UniverInstanceType.UNIVER_SLIDE> {
    override type: UniverInstanceType.UNIVER_SLIDE = UniverInstanceType.UNIVER_SLIDE;
    private readonly _activePage$ = new BehaviorSubject<Nullable<ISlidePage>>(null);
    private get _activePage(): Nullable<ISlidePage> {
        const activePage = this._activePage$.getValue();

        if (!activePage) {
            const activePageId = this.getPageOrder()?.[0];
            if (!activePageId) {
                return null;
            }

            return this.getPages()?.[activePageId];
        }

        return activePage;
    }

    readonly activePage$ = this._activePage$.asObservable();

    private readonly _name$: BehaviorSubject<string>;
    override name$: Observable<string>;

    private _snapshot: ISlideData;

    private _unitId: string;

    constructor(snapshot: Partial<ISlideData>) {
        super();

        // Migrate to the current canonical schema (stamps schemaVersion and
        // guarantees a structurally consistent body/pageOrder).
        this._snapshot = migrateSlideSnapshot({ ...DEFAULT_SLIDE, ...snapshot });
        this._unitId = this._snapshot.id ?? generateRandomId(6);

        this._name$ = new BehaviorSubject(this._snapshot.title);
        this.name$ = this._name$.asObservable();
    }

    override setName(name: string): void {
        this._snapshot.title = name;
        this._name$.next(name);
        this._unitId = this._snapshot.id ?? generateRandomId(6);
    }

    override getRev(): number {
        return this._snapshot.rev ?? 1; // revision starts from one, matching Workbook
    }

    override incrementRev(): void {
        this._snapshot.rev = this.getRev() + 1;
    }

    override setRev(rev: number): void {
        this._snapshot.rev = rev;
    }

    getSnapshot() {
        return this._snapshot;
    }

    /**
     * Canonical, deeply-cloned snapshot for persistence/transport. Detached from
     * the live model, so later edits don't mutate the serialized copy. Feeding
     * it back through `migrateSlideSnapshot` (or `new SlideDataModel`) round-trips
     * losslessly.
     */
    serialize(): ISlideData {
        return serializeSlideSnapshot(this._snapshot);
    }

    getUnitId(): string {
        return this._unitId;
    }

    getPages() {
        return this._snapshot.body?.pages;
    }

    getPageOrder() {
        return this._snapshot.body?.pageOrder;
    }

    getPage(pageId: string) {
        const pages = this.getPages();
        return pages?.[pageId];
    }

    getElementsByPage(pageId: string) {
        return this.getPage(pageId)?.pageElements;
    }

    getElement(pageId: string, elementId: string) {
        return this.getElementsByPage(pageId)?.[elementId];
    }

    getPageSize() {
        return this._snapshot.pageSize;
    }

    getBlankPage() {
        const id = generateRandomId(6);

        const page = {
            id,
            pageType: PageType.SLIDE,
            zIndex: 10,
            title: id,
            description: '',
            pageBackgroundFill: {
                rgb: 'rgb(255,255,255)',
            },
            pageElements: {},
        };

        return page;
    }

    setActivePage(page: Nullable<ISlidePage>) {
        this._activePage$.next(page);
    }

    getActivePage() {
        return this._activePage;
    }

    updatePage(pageId: string, page: ISlidePage) {
        if (!this._snapshot.body) return;

        this._snapshot.body.pages[pageId] = page;
    }

    appendPage(page: ISlidePage) {
        if (!this._snapshot.body) return;

        this._snapshot.body.pages[page.id] = page;

        const activePage = this._activePage;
        const index = this._snapshot.body.pageOrder.indexOf(activePage?.id ?? '');
        this._snapshot.body.pageOrder.splice(index + 1, 0, page.id);
    }
}
