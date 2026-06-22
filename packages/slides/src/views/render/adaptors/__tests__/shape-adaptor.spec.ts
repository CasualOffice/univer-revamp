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

import type { IPageElement } from '../../../../types/interfaces/i-slide-data';
import { BorderStyleTypes } from '@univerjs/core';
import { Circle, Path, Rect } from '@univerjs/engine-render';
import { describe, expect, it } from 'vitest';
import { ArrowsAndMarkersShapes, BasicShapes } from '../../../../types/enum/prst-geom-type';
import { PageElementType } from '../../../../types/interfaces/i-slide-data';
import { getPresetGeometryPath, isStrokeOnlyPreset } from '../preset-geometry';
import { ShapeAdaptor } from '../shape-adaptor';
import { buildShadowProps, dashStyleToArray } from '../shape-style';

function shapeElement(shapeType: string): IPageElement {
    return {
        id: 'el-1',
        zIndex: 1,
        left: 10,
        top: 20,
        width: 200,
        height: 100,
        title: 'shape',
        description: '',
        type: PageElementType.SHAPE,
        shape: {
            shapeType: shapeType as never,
            text: '',
            shapeProperties: { shapeBackgroundFill: { rgb: 'rgb(255,0,0)' } },
        },
    } as IPageElement;
}

const PRESET_SAMPLES = [
    BasicShapes.Triangle,
    BasicShapes.RtTriangle,
    BasicShapes.Diamond,
    BasicShapes.Parallelogram,
    BasicShapes.Trapezoid,
    BasicShapes.Pentagon,
    BasicShapes.Hexagon,
    BasicShapes.Heptagon,
    BasicShapes.Octagon,
    BasicShapes.Star4,
    BasicShapes.Star5,
    BasicShapes.Star6,
    BasicShapes.Star8,
    ArrowsAndMarkersShapes.RightArrow,
    ArrowsAndMarkersShapes.LeftArrow,
    ArrowsAndMarkersShapes.UpArrow,
    ArrowsAndMarkersShapes.DownArrow,
    ArrowsAndMarkersShapes.Chevron,
    ArrowsAndMarkersShapes.HomePlate,
];

describe('ShapeAdaptor preset geometry', () => {
    const adaptor = new ShapeAdaptor();

    it('keeps rect / round-rect / ellipse on native primitives', () => {
        expect(adaptor.convert(shapeElement(BasicShapes.Rect))).toBeInstanceOf(Rect);
        expect(adaptor.convert(shapeElement(BasicShapes.RoundRect))).toBeInstanceOf(Rect);
        expect(adaptor.convert(shapeElement(BasicShapes.Ellipse))).toBeInstanceOf(Circle);
    });

    it('renders every sampled preset polygon/arrow as a Path with real geometry', () => {
        for (const shapeType of PRESET_SAMPLES) {
            const obj = adaptor.convert(shapeElement(shapeType)) as Path;
            expect(obj, shapeType).toBeInstanceOf(Path);
            // Non-trivial command list = the SVG path actually parsed.
            expect(obj.dataArray.length, shapeType).toBeGreaterThan(2);
        }
    });

    it('renders lines as stroke-only paths', () => {
        expect(isStrokeOnlyPreset(BasicShapes.Line)).toBe(true);
        expect(isStrokeOnlyPreset(BasicShapes.Triangle)).toBe(false);
        const line = adaptor.convert(shapeElement(BasicShapes.Line)) as Path;
        expect(line).toBeInstanceOf(Path);
        expect(line.dataArray.length).toBeGreaterThan(0);
    });

    it('leaves unmapped / decorative presets to legacy handling (undefined path)', () => {
        // RoundRect/Ellipse are handled natively, never via the preset map.
        expect(getPresetGeometryPath(BasicShapes.RoundRect)).toBeUndefined();
        // Not yet authored (issue #9 follow-up): smiley/heart/cloud/callouts/…
        expect(getPresetGeometryPath('smileyFace')).toBeUndefined();
        expect(getPresetGeometryPath(undefined)).toBeUndefined();
    });

    it('produces parseable SVG path data for every sampled preset', () => {
        for (const shapeType of PRESET_SAMPLES) {
            const data = getPresetGeometryPath(shapeType)!;
            expect(data, shapeType).toBeTruthy();
            // The first command of a well-formed path is an absolute moveto.
            expect(data.startsWith('M'), shapeType).toBe(true);
            expect(Path.parsePathData(data).length, shapeType).toBeGreaterThan(2);
        }
    });

    it('maps outline dashStyle to a stroke dash array on the rendered shape', () => {
        const el = shapeElement(BasicShapes.Rect);
        el.shape!.shapeProperties!.outline = {
            outlineFill: { rgb: 'rgb(0,0,0)' },
            weight: 2,
            dashStyle: BorderStyleTypes.DASHED,
        };
        const rect = adaptor.convert(el) as Rect;
        expect(rect.strokeDashArray).toEqual([6, 4]);
        expect(rect.strokeWidth).toBe(2);
    });

    it('applies a drop shadow to the rendered shape', () => {
        const el = shapeElement(BasicShapes.Triangle);
        el.shape!.shapeProperties!.shadow = {
            color: { rgb: 'rgb(0,0,0)' },
            blur: 8,
            offsetX: 3,
            offsetY: 4,
            opacity: 0.5,
        };
        const path = adaptor.convert(el) as Path;
        expect(path.shadowEnabled).toBe(true);
        expect(path.shadowBlur).toBe(8);
        expect(path.shadowColor).toBe('#000000');
    });

    it('dashStyleToArray: dashed/dotted/dash-dot patterns, solid → undefined', () => {
        expect(dashStyleToArray(BorderStyleTypes.DOTTED)).toEqual([1, 3]);
        expect(dashStyleToArray(BorderStyleTypes.DASHED)).toEqual([6, 4]);
        expect(dashStyleToArray(BorderStyleTypes.DASH_DOT)).toEqual([6, 3, 1, 3]);
        expect(dashStyleToArray(BorderStyleTypes.DASH_DOT_DOT)).toEqual([6, 3, 1, 3, 1, 3]);
        expect(dashStyleToArray(BorderStyleTypes.THIN)).toBeUndefined();
        expect(dashStyleToArray(BorderStyleTypes.NONE)).toBeUndefined();
        expect(dashStyleToArray(undefined)).toBeUndefined();
    });

    it('buildShadowProps: undefined passes through, defaults fill in', () => {
        expect(buildShadowProps(undefined)).toBeUndefined();
        const props = buildShadowProps({ color: { rgb: 'rgb(1,2,3)' } })!;
        expect(props.shadowEnabled).toBe(true);
        expect(props.shadowColor).toBe('#010203');
        // Defaults for omitted fields.
        expect(props.shadowBlur).toBe(4);
        expect(props.shadowOffsetX).toBe(2);
        expect(props.shadowOpacity).toBe(1);
    });
});
