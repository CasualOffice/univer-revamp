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

import type { Injector } from '@univerjs/core';
import type { Scene } from '@univerjs/engine-render';
import type { IColorScheme, IPageElement } from '../../../types/interfaces/i-slide-data';
import { Circle, Path, Rect } from '@univerjs/engine-render';
import { resolveThemeColor } from '../../../basics/theme-color';
import { BasicShapes } from '../../../types/enum/prst-geom-type';
import { PageElementType } from '../../../types/interfaces/i-slide-data';
import { CanvasObjectProviderRegistry, ObjectAdaptor } from '../adaptor';
import { getPresetGeometryPath, isStrokeOnlyPreset } from './preset-geometry';
import { buildGradientFill, buildShadowProps, dashStyleToArray } from './shape-style';

export class ShapeAdaptor extends ObjectAdaptor {
    override zIndex = 2;

    override viewKey = PageElementType.SHAPE;

    override check(type: PageElementType) {
        if (type !== this.viewKey) {
            return;
        }
        return this;
    }

    override convert(pageElement: IPageElement, _mainScene?: Scene, colorScheme?: IColorScheme) {
        const {
            id,
            zIndex,
            left = 0,
            top = 0,
            width,
            height,
            angle,
            scaleX,
            scaleY,
            skewX,
            skewY,
            flipX,
            flipY,
            title,
            description,
        } = pageElement;
        const { shapeType, text, shapeProperties, placeholder, link } = pageElement.shape || {};

        const fill =
            shapeProperties == null ? '' : resolveThemeColor(shapeProperties.shapeBackgroundFill, colorScheme) || 'rgba(255,255,255,1)';

        const outline = shapeProperties?.outline;
        // strokeStyle carries every shared paint prop (stroke, dash, shadow) so
        // each shape branch only needs `...strokeStyle`.
        const strokeStyle: Record<string, unknown> = {};
        if (outline) {
            const { outlineFill, weight, dashStyle } = outline;

            strokeStyle.strokeWidth = weight;
            strokeStyle.stroke = resolveThemeColor(outlineFill, colorScheme) || 'rgba(0,0,0,1)';

            const dashArray = dashStyleToArray(dashStyle);
            if (dashArray) {
                strokeStyle.strokeDashArray = dashArray;
            }
        }

        const shadowProps = buildShadowProps(shapeProperties?.shadow);
        if (shadowProps) {
            Object.assign(strokeStyle, shadowProps);
        }

        // Gradient fill takes precedence over the solid fill at render time.
        const gradientFill = buildGradientFill(shapeProperties?.gradientFill);
        if (gradientFill) {
            strokeStyle.gradientFill = gradientFill;
        }

        if (shapeType === BasicShapes.Rect) {
            return new Rect(id, {
                fill,
                top,
                left,
                width,
                height,
                zIndex,
                angle,
                scaleX,
                scaleY,
                skewX,
                skewY,
                flipX,
                flipY,
                forceRender: true,
                ...strokeStyle,
            });
        }
        if (shapeType === BasicShapes.RoundRect) {
            const radius = shapeProperties?.radius || 0;
            return new Rect(id, {
                fill,
                top,
                left,
                width,
                height,
                zIndex,
                angle,
                scaleX,
                scaleY,
                skewX,
                skewY,
                flipX,
                flipY,
                forceRender: true,
                radius,
                ...strokeStyle,
            });
        }
        if (shapeType === BasicShapes.Ellipse) {
            const radius = shapeProperties?.radius || 0;
            return new Circle(id, {
                fill,
                top,
                left,
                width,
                height,
                zIndex,
                angle,
                scaleX,
                scaleY,
                skewX,
                skewY,
                flipX,
                flipY,
                forceRender: true,
                radius,
                ...strokeStyle,
            });
        }

        // Every other preset geometry renders through an SVG path. Path
        // rescales the unit-box data to width/height itself (it overrides
        // scaleX/scaleY in _setFixBoundingBox), so we don't forward scale/skew.
        const presetPath = getPresetGeometryPath(shapeType);
        if (presetPath) {
            const strokeOnly = isStrokeOnlyPreset(shapeType);
            // A line with no explicit outline still needs a visible stroke.
            const lineDefaultStroke =
                strokeOnly && outline == null ? { strokeWidth: 1, stroke: 'rgba(0,0,0,1)' } : {};
            return new Path(id, {
                data: presetPath,
                fill: strokeOnly ? 'rgba(0,0,0,0)' : fill,
                top,
                left,
                width,
                height,
                zIndex,
                angle,
                flipX,
                flipY,
                forceRender: true,
                ...lineDefaultStroke,
                ...strokeStyle,
            });
        }
    }
}

export class ShapeAdaptorFactory {
    readonly zIndex = 2;

    create(injector: Injector): ShapeAdaptor {
        const shapeAdaptor = injector.createInstance(ShapeAdaptor);
        return shapeAdaptor;
    }
}

CanvasObjectProviderRegistry.add(new ShapeAdaptorFactory());
