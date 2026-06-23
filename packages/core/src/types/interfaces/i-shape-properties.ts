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

import type { BorderStyleTypes } from '../enum/border-style-types';
import type { IColorStyle } from './i-style-data';

/**
 * ShapeProperties
 */
export interface IShapeProperties {
    shapeBackgroundFill: IColorStyle;
    radius?: number;
    outline?: IOutline;
    shadow?: IShapeShadow;
    /**
     * Gradient fill. When present it takes precedence over the solid
     * `shapeBackgroundFill` at render time.
     */
    gradientFill?: IGradientFill;
}

export interface IGradientStop {
    /** Position along the gradient, 0..1. */
    position: number;
    color: IColorStyle;
}

/**
 * Linear or radial gradient fill. For `linear`, `angle` is the gradient
 * direction in degrees (0 = left→right, 90 = top→bottom). For `radial`, the
 * gradient runs from the shape center outward.
 */
export interface IGradientFill {
    type: 'linear' | 'radial';
    angle?: number;
    stops: IGradientStop[];
}

export interface IOutline {
    outlineFill: IColorStyle;
    weight: number;
    dashStyle?: BorderStyleTypes;
}

/**
 * Drop shadow for a shape. Maps onto the engine-render Shape shadow props
 * (shadowColor/Blur/OffsetX/OffsetY/Opacity). Offsets are in px; opacity is
 * 0..1. Mirrors the OOXML `a:effectLst`/`a:outerShdw` subset we support.
 */
export interface IShapeShadow {
    color?: IColorStyle;
    blur?: number;
    offsetX?: number;
    offsetY?: number;
    /** 0 (transparent) .. 1 (opaque). */
    opacity?: number;
}
