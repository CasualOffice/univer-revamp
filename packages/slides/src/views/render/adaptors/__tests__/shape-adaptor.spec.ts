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
import type { IColorScheme } from '../../../../types/interfaces/i-slide-data';
import { BorderStyleTypes, ThemeColorType } from '@univerjs/core';
import { Circle, createCanvasGradient, Path, Rect } from '@univerjs/engine-render';
import { describe, expect, it } from 'vitest';
import { ArrowsAndMarkersShapes, BasicShapes } from '../../../../types/enum/prst-geom-type';
import { PageElementType } from '../../../../types/interfaces/i-slide-data';
import { getPresetGeometryPath, isStrokeOnlyPreset } from '../preset-geometry';
import { ShapeAdaptor } from '../shape-adaptor';
import { buildGradientFill, buildShadowProps, dashStyleToArray } from '../shape-style';

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

    it('resolves a theme-color fill against the deck color scheme', () => {
        const scheme: IColorScheme = { [ThemeColorType.ACCENT1]: 'rgb(255,0,0)' };
        const el = shapeElement(BasicShapes.Rect);
        el.shape!.shapeProperties!.shapeBackgroundFill = { th: ThemeColorType.ACCENT1 };
        // Without a scheme it falls back to the Office default; with the deck
        // scheme it resolves to the scheme color.
        const withScheme = adaptor.convert(el, undefined, scheme) as Rect;
        expect(withScheme.fill).toBe('#ff0000');
        const withoutScheme = adaptor.convert(el) as Rect;
        expect(withoutScheme.fill).not.toBe('#ff0000'); // Office default, not the scheme
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

    it('buildGradientFill: resolves IColorStyle stops to CSS strings', () => {
        expect(buildGradientFill(undefined)).toBeUndefined();
        expect(buildGradientFill({ type: 'linear', stops: [] })).toBeUndefined();
        const g = buildGradientFill({
            type: 'linear',
            angle: 90,
            stops: [
                { position: 0, color: { rgb: 'rgb(255,0,0)' } },
                { position: 1, color: { rgb: 'rgb(0,0,255)' } },
            ],
        })!;
        expect(g.type).toBe('linear');
        expect(g.angle).toBe(90);
        expect(g.stops).toEqual([
            { position: 0, color: '#ff0000' },
            { position: 1, color: '#0000ff' },
        ]);
    });

    it('buildGradientFill: resolves theme-color stops against the deck scheme', () => {
        const scheme: IColorScheme = { [ThemeColorType.ACCENT1]: 'rgb(0,128,0)' };
        const g = buildGradientFill({
            type: 'linear',
            stops: [
                { position: 0, color: { th: ThemeColorType.ACCENT1 } },
                { position: 1, color: { rgb: 'rgb(0,0,0)' } },
            ],
        }, scheme)!;
        expect(g.stops[0].color).toBe('#008000');
        expect(g.stops[1].color).toBe('#000000');
    });

    it('forwards a gradient fill onto the rendered shape', () => {
        const el = shapeElement(BasicShapes.Rect);
        el.shape!.shapeProperties!.gradientFill = {
            type: 'linear',
            angle: 45,
            stops: [
                { position: 0, color: { rgb: 'rgb(0,0,0)' } },
                { position: 1, color: { rgb: 'rgb(255,255,255)' } },
            ],
        };
        const rect = adaptor.convert(el) as Rect;
        expect(rect.gradientFill).toBeDefined();
        expect(rect.gradientFill!.type).toBe('linear');
        expect(rect.gradientFill!.stops[0].color).toBe('#000000');
    });
});

describe('createCanvasGradient', () => {
    function fakeCtx() {
        const calls: { linear?: number[]; radial?: number[]; stops: Array<[number, string]> } = { stops: [] };
        const gradient = { addColorStop: (p: number, c: string) => calls.stops.push([p, c]) };
        const ctx = {
            createLinearGradient: (x0: number, y0: number, x1: number, y1: number) => {
                calls.linear = [x0, y0, x1, y1];
                return gradient;
            },
            createRadialGradient: (x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) => {
                calls.radial = [x0, y0, r0, x1, y1, r1];
                return gradient;
            },
        };
        return { ctx, calls };
    }

    it('builds a linear gradient across the box for the given angle', () => {
        const { ctx, calls } = fakeCtx();
        const g = createCanvasGradient(ctx as never, {
            type: 'linear',
            angle: 0,
            stops: [{ position: 0, color: '#000' }, { position: 1, color: '#fff' }],
        }, 100, 50);
        expect(g).toBeTruthy();
        // angle 0 → horizontal across full width at vertical center.
        expect(calls.linear).toEqual([0, 25, 100, 25]);
        expect(calls.stops).toEqual([[0, '#000'], [1, '#fff']]);
    });

    it('builds a radial gradient from the box center', () => {
        const { ctx, calls } = fakeCtx();
        createCanvasGradient(ctx as never, {
            type: 'radial',
            stops: [{ position: 0, color: '#000' }],
        }, 100, 50);
        expect(calls.radial).toEqual([50, 25, 0, 50, 25, 50]);
    });

    it('returns null when the context cannot create gradients or there are no stops', () => {
        const { ctx } = fakeCtx();
        expect(createCanvasGradient(ctx as never, { type: 'linear', stops: [] }, 10, 10)).toBeNull();
        expect(createCanvasGradient({} as never, { type: 'linear', stops: [{ position: 0, color: '#000' }] }, 10, 10)).toBeNull();
    });
});
