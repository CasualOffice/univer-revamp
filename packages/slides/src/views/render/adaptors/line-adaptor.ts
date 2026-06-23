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
import type { Scene } from '@univerjs/engine-render';
import type { IColorScheme, IPageElement } from '../../../types/interfaces/i-slide-data';
import { Path } from '@univerjs/engine-render';
import { resolveThemeColor } from '../../../basics/theme-color';
import { PageElementType } from '../../../types/interfaces/i-slide-data';
import { CanvasObjectProviderRegistry, ObjectAdaptor } from '../adaptor';
import { dashStyleToArray } from './shape-style';

// Renders a LINE / connector element as a single stroke-only Path from its
// start to end point. The Path's zero-extent guard handles purely horizontal /
// vertical lines (0 natural width or height). Arrowheads and elbow routing are
// follow-ups; this covers straight connectors.
export class LineAdaptor extends ObjectAdaptor {
    override zIndex = 2;

    override viewKey = PageElementType.LINE;

    override check(type: PageElementType) {
        if (type !== this.viewKey) {
            return;
        }
        return this;
    }

    override convert(pageElement: IPageElement, _mainScene?: Scene, colorScheme?: IColorScheme) {
        const { id, zIndex, left = 0, top = 0, width = 0, height = 0, angle, flipX, flipY } = pageElement;
        const { start, end, lineProperties } = pageElement.line || {};

        // Default to the bounding-box diagonal when explicit endpoints are absent.
        const sx = start?.x ?? 0;
        const sy = start?.y ?? 0;
        const ex = end?.x ?? width;
        const ey = end?.y ?? height;

        const outline = lineProperties?.outline;
        const strokeStyle: Record<string, unknown> = {
            stroke: resolveThemeColor(outline?.outlineFill, colorScheme) || 'rgba(0,0,0,1)',
            strokeWidth: outline?.weight ?? 1,
        };
        const dashArray = dashStyleToArray(outline?.dashStyle);
        if (dashArray) {
            strokeStyle.strokeDashArray = dashArray;
        }

        return new Path(id, {
            data: `M ${sx},${sy} L ${ex},${ey}`,
            fill: 'rgba(0,0,0,0)',
            top,
            left,
            width,
            height,
            zIndex,
            angle,
            flipX,
            flipY,
            forceRender: true,
            ...strokeStyle,
        });
    }
}

export class LineAdaptorFactory {
    readonly zIndex = 5;

    create(injector: Injector): LineAdaptor {
        return injector.createInstance(LineAdaptor);
    }
}

CanvasObjectProviderRegistry.add(new LineAdaptorFactory());
