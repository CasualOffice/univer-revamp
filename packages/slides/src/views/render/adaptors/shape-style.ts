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

import type { IGradientFill, IShapeShadow } from '@univerjs/core';
import type { IGradientFillProps } from '@univerjs/engine-render';
import { BorderStyleTypes, getColorStyle } from '@univerjs/core';

// Maps the slide shape style model (outline dash + drop shadow) onto the props
// the engine-render Shape already understands (strokeDashArray, shadow*). Kept
// separate from the geometry mapping so both can be unit-tested in isolation.

/**
 * Convert an outline `dashStyle` (BorderStyleTypes) to a canvas dash pattern.
 * Returns undefined for solid styles (the caller should omit strokeDashArray).
 * Patterns are in px and scale reasonably across typical outline weights.
 */
export function dashStyleToArray(dashStyle?: BorderStyleTypes): number[] | undefined {
    switch (dashStyle) {
        case BorderStyleTypes.HAIR:
            return [1, 2];
        case BorderStyleTypes.DOTTED:
            return [1, 3];
        case BorderStyleTypes.DASHED:
        case BorderStyleTypes.MEDIUM_DASHED:
            return [6, 4];
        case BorderStyleTypes.DASH_DOT:
        case BorderStyleTypes.MEDIUM_DASH_DOT:
        case BorderStyleTypes.SLANT_DASH_DOT:
            return [6, 3, 1, 3];
        case BorderStyleTypes.DASH_DOT_DOT:
        case BorderStyleTypes.MEDIUM_DASH_DOT_DOT:
            return [6, 3, 1, 3, 1, 3];
        default:
            // NONE / THIN / DOUBLE / MEDIUM / THICK / undefined → solid line.
            return undefined;
    }
}

export interface IShadowRenderProps {
    shadowEnabled: boolean;
    shadowColor: string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowOpacity: number;
}

/**
 * Build the engine-render shadow props from a shape shadow model, or undefined
 * when there's no shadow (so the caller can spread nothing). Defaults match a
 * subtle PowerPoint-style outer shadow.
 */
export function buildShadowProps(shadow?: IShapeShadow): IShadowRenderProps | undefined {
    if (!shadow) return undefined;
    return {
        shadowEnabled: true,
        shadowColor: getColorStyle(shadow.color) || 'rgba(0,0,0,0.4)',
        shadowBlur: shadow.blur ?? 4,
        shadowOffsetX: shadow.offsetX ?? 2,
        shadowOffsetY: shadow.offsetY ?? 2,
        shadowOpacity: shadow.opacity ?? 1,
    };
}

/**
 * Resolve a slide gradient fill (IColorStyle stops) into the engine-render
 * gradient descriptor (CSS string stops). Returns undefined when there's no
 * usable gradient, so the caller falls back to the solid fill.
 */
export function buildGradientFill(gradient?: IGradientFill): IGradientFillProps | undefined {
    if (!gradient || !gradient.stops || gradient.stops.length === 0) return undefined;
    return {
        type: gradient.type,
        angle: gradient.angle,
        stops: gradient.stops.map((stop) => ({
            position: stop.position,
            color: getColorStyle(stop.color) || 'rgba(0,0,0,1)',
        })),
    };
}
