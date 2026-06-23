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

import type { Injector } from '@univerjs/core';
import type { BaseObject } from '@univerjs/engine-render';
import type { IPageElement } from '../../../types/interfaces/i-slide-data';
import { Image, Rect } from '@univerjs/engine-render';
import { PageElementType } from '../../../types/interfaces/i-slide-data';
import { CanvasObjectProviderRegistry, ObjectAdaptor } from '../adaptor';

// Renders a VIDEO element as its poster frame (an Image), or a neutral
// placeholder rect when no poster is available. Playback + a play-button
// overlay are product/QA-gated follow-ups; this makes imported media visible
// and selectable on the canvas.
export class VideoAdaptor extends ObjectAdaptor {
    override zIndex = 1;

    override viewKey = PageElementType.VIDEO;

    override check(type: PageElementType) {
        if (type !== this.viewKey) {
            return;
        }
        return this;
    }

    override convert(pageElement: IPageElement): BaseObject {
        const { id, zIndex, left = 0, top = 0, width, height, angle, flipX, flipY } = pageElement;
        const posterUrl = pageElement.video?.posterUrl;

        const base = { top, left, width, height, zIndex, angle, flipX, flipY, forceRender: true };

        if (posterUrl) {
            return new Image(id, { url: posterUrl, ...base });
        }
        // Neutral placeholder so the element is visible/selectable pre-playback.
        return new Rect(id, { fill: 'rgba(0,0,0,0.06)', stroke: 'rgba(0,0,0,0.25)', strokeWidth: 1, ...base });
    }
}

export class VideoAdaptorFactory {
    readonly zIndex = 6;

    create(injector: Injector): VideoAdaptor {
        return injector.createInstance(VideoAdaptor);
    }
}

CanvasObjectProviderRegistry.add(new VideoAdaptorFactory());
