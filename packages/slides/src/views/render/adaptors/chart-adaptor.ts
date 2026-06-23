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

// Renders a CHART element as its cached preview image (previewUrl), or a neutral
// placeholder rect when none is available. Native chart rendering (drawing the
// data from `spec`) is a follow-up that wants a dedicated renderer + visual QA;
// this makes imported charts visible while their OOXML part is preserved
// verbatim for lossless export (see IChartElement.embeddedPart).
export class ChartAdaptor extends ObjectAdaptor {
    override zIndex = 1;

    override viewKey = PageElementType.CHART;

    override check(type: PageElementType) {
        if (type !== this.viewKey) {
            return;
        }
        return this;
    }

    override convert(pageElement: IPageElement): BaseObject {
        const { id, zIndex, left = 0, top = 0, width, height, angle, flipX, flipY } = pageElement;
        const previewUrl = pageElement.chart?.previewUrl;

        const base = { top, left, width, height, zIndex, angle, flipX, flipY, forceRender: true };

        if (previewUrl) {
            return new Image(id, { url: previewUrl, ...base });
        }
        return new Rect(id, { fill: 'rgba(0,0,0,0.04)', stroke: 'rgba(0,0,0,0.25)', strokeWidth: 1, ...base });
    }
}

export class ChartAdaptorFactory {
    readonly zIndex = 7;

    create(injector: Injector): ChartAdaptor {
        return injector.createInstance(ChartAdaptor);
    }
}

CanvasObjectProviderRegistry.add(new ChartAdaptorFactory());
