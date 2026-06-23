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

import type { BaseObject, Scene } from '@univerjs/engine-render';
import type { IColorScheme, IPageElement } from '../../types/interfaces/i-slide-data';
import type { ObjectAdaptor } from './adaptor';
import { Inject, Injector, sortRules } from '@univerjs/core';
import { Group } from '@univerjs/engine-render';
import { PageElementType } from '../../types/interfaces/i-slide-data';
import { CanvasObjectProviderRegistry } from './adaptor';
import './adaptors';

export class ObjectProvider {
    private _adaptors: ObjectAdaptor[] = [];

    constructor(@Inject(Injector) private readonly _injector: Injector) {
        this._adaptorLoader();
    }

    convertToRenderObjects(pageElements: { [elementId: string]: IPageElement }, mainScene: Scene, colorScheme?: IColorScheme) {
        const pageKeys = Object.keys(pageElements);
        const objects: BaseObject[] = [];
        pageKeys.forEach((key) => {
            const pageElement = pageElements[key];
            const o = this._executor(pageElement, mainScene, colorScheme);
            if (o != null) {
                objects.push(o);
            }
        });
        return objects;
    }

    convertToRenderObject(pageElement: IPageElement, mainScene: Scene, colorScheme?: IColorScheme) {
        return this._executor(pageElement, mainScene, colorScheme);
    }

    private _executor(pageElement: IPageElement, mainScene: Scene, colorScheme?: IColorScheme): BaseObject | undefined {
        const { id: pageElementId, type } = pageElement;

        // Group: recursively convert children (which keep absolute page coords)
        // and wrap them in an engine Group. Nested groups recurse naturally.
        if (type === PageElementType.GROUP) {
            const children = (pageElement.group?.children ?? [])
                .map((child) => this._executor(child, mainScene, colorScheme))
                .filter((o): o is BaseObject => o != null);
            if (children.length === 0) return undefined;
            return new Group(pageElementId, ...children);
        }

        for (const adaptor of this._adaptors) {
            const o = adaptor.check(type)?.convert(pageElement, mainScene, colorScheme);
            if (o != null) {
                return o;
            }
        }
    }

    private _adaptorLoader() {
        CanvasObjectProviderRegistry.getData()
            .sort(sortRules)
            .forEach((adaptorFactory: ObjectAdaptor) => {
                this._adaptors.push(adaptorFactory.create(this._injector) as unknown as ObjectAdaptor);
            });
    }
}
