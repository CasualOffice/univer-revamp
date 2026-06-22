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

import { ArrowsAndMarkersShapes, BasicShapes } from '../../../types/enum/prst-geom-type';

// Preset-geometry (OOXML `prstGeom`) → SVG path data, authored in a 100×100
// unit box. The engine-render `Path` shape rescales the data to the element's
// width/height (see Path._setFixBoundingBox), so these paths only need correct
// proportions, not absolute size.
//
// This is the first slice of the preset-shape catalog: the common geometric
// shapes, block arrows, and lines. Decorative/parametric presets (callouts,
// smiley/heart/cloud, action buttons, can/cube/bevel, …) are not yet mapped —
// they fall through to the legacy Rect/Circle handling. See issue #9.

const BOX = 100;
const CENTER = BOX / 2;
const RADIUS = BOX / 2;

function round(n: number): number {
    return Math.round(n * 100) / 100;
}

function polygonPath(points: Array<[number, number]>): string {
    return `${points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${round(x)},${round(y)}`).join(' ')} z`;
}

/** Regular n-gon inscribed in the unit box, first vertex pointing up. */
function regularPolygon(sides: number, startAngleDeg = -90): Array<[number, number]> {
    const points: Array<[number, number]> = [];
    for (let i = 0; i < sides; i++) {
        const a = ((startAngleDeg + (i * 360) / sides) * Math.PI) / 180;
        points.push([CENTER + RADIUS * Math.cos(a), CENTER + RADIUS * Math.sin(a)]);
    }
    return points;
}

/** n-point star, alternating outer/inner radius, first point up. */
function starPolygon(pointCount: number, innerRatio: number, startAngleDeg = -90): Array<[number, number]> {
    const points: Array<[number, number]> = [];
    for (let i = 0; i < pointCount * 2; i++) {
        const r = i % 2 === 0 ? RADIUS : RADIUS * innerRatio;
        const a = ((startAngleDeg + (i * 180) / pointCount) * Math.PI) / 180;
        points.push([CENTER + r * Math.cos(a), CENTER + r * Math.sin(a)]);
    }
    return points;
}

const PRESET_PATHS: Partial<Record<string, string>> = {
    // --- Basic geometric shapes ---
    [BasicShapes.Triangle]: 'M50,0 L100,100 L0,100 z',
    [BasicShapes.RtTriangle]: 'M0,0 L0,100 L100,100 z',
    [BasicShapes.Diamond]: 'M50,0 L100,50 L50,100 L0,50 z',
    [BasicShapes.Parallelogram]: 'M25,0 L100,0 L75,100 L0,100 z',
    [BasicShapes.Trapezoid]: 'M25,0 L75,0 L100,100 L0,100 z',
    [BasicShapes.NonIsocelesTrapezoid]: 'M20,0 L70,0 L100,100 L0,100 z',
    [BasicShapes.Pentagon]: polygonPath(regularPolygon(5)),
    [BasicShapes.Hexagon]: 'M25,0 L75,0 L100,50 L75,100 L25,100 L0,50 z',
    [BasicShapes.Heptagon]: polygonPath(regularPolygon(7)),
    [BasicShapes.Octagon]: 'M30,0 L70,0 L100,30 L100,70 L70,100 L30,100 L0,70 L0,30 z',
    [BasicShapes.Decagon]: polygonPath(regularPolygon(10)),
    [BasicShapes.Dodecagon]: polygonPath(regularPolygon(12)),
    [BasicShapes.Star4]: polygonPath(starPolygon(4, 0.4)),
    [BasicShapes.Star5]: polygonPath(starPolygon(5, 0.382)),
    [BasicShapes.Star6]: polygonPath(starPolygon(6, 0.5)),
    [BasicShapes.Star7]: polygonPath(starPolygon(7, 0.5)),
    [BasicShapes.Star8]: polygonPath(starPolygon(8, 0.5)),
    [BasicShapes.Star10]: polygonPath(starPolygon(10, 0.5)),
    [BasicShapes.Star12]: polygonPath(starPolygon(12, 0.55)),
    [BasicShapes.Star16]: polygonPath(starPolygon(16, 0.6)),
    [BasicShapes.Star24]: polygonPath(starPolygon(24, 0.65)),
    [BasicShapes.Star32]: polygonPath(starPolygon(32, 0.7)),
    // Diagonal lines (stroke-only — see isStrokeOnlyPreset).
    [BasicShapes.Line]: 'M0,0 L100,100',
    [BasicShapes.LineInv]: 'M0,100 L100,0',

    // --- Block arrows & markers ---
    [ArrowsAndMarkersShapes.RightArrow]: 'M0,30 L60,30 L60,10 L100,50 L60,90 L60,70 L0,70 z',
    [ArrowsAndMarkersShapes.LeftArrow]: 'M100,30 L40,30 L40,10 L0,50 L40,90 L40,70 L100,70 z',
    [ArrowsAndMarkersShapes.UpArrow]: 'M30,100 L30,40 L10,40 L50,0 L90,40 L70,40 L70,100 z',
    [ArrowsAndMarkersShapes.DownArrow]: 'M30,0 L30,60 L10,60 L50,100 L90,60 L70,60 L70,0 z',
    [ArrowsAndMarkersShapes.LeftRightArrow]: 'M0,50 L25,25 L25,40 L75,40 L75,25 L100,50 L75,75 L75,60 L25,60 L25,75 z',
    [ArrowsAndMarkersShapes.UpDownArrow]: 'M50,0 L75,25 L60,25 L60,75 L75,75 L50,100 L25,75 L40,75 L40,25 L25,25 z',
    [ArrowsAndMarkersShapes.NotchedRightArrow]: 'M0,30 L60,30 L60,10 L100,50 L60,90 L60,70 L0,70 L20,50 z',
    [ArrowsAndMarkersShapes.HomePlate]: 'M0,0 L75,0 L100,50 L75,100 L0,100 z',
    [ArrowsAndMarkersShapes.Chevron]: 'M0,0 L75,0 L100,50 L75,100 L0,100 L25,50 z',
};

/**
 * SVG path data (in a 100×100 box) for a preset geometry, or undefined when the
 * shape isn't mapped yet (caller should fall back to legacy handling).
 */
export function getPresetGeometryPath(shapeType?: string): string | undefined {
    if (!shapeType) return undefined;
    return PRESET_PATHS[shapeType];
}

/** Open paths (lines) render with stroke only — no fill. */
export function isStrokeOnlyPreset(shapeType?: string): boolean {
    return shapeType === BasicShapes.Line || shapeType === BasicShapes.LineInv;
}
