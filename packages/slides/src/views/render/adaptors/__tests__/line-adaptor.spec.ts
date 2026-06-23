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
import { Path } from '@univerjs/engine-render';
import { describe, expect, it } from 'vitest';
import { PageElementType } from '../../../../types/interfaces/i-slide-data';
import { LineAdaptor } from '../line-adaptor';

function lineElement(line: IPageElement['line'], width = 100, height = 50): IPageElement {
    return {
        id: 'line-1',
        zIndex: 1,
        left: 10,
        top: 20,
        width,
        height,
        title: 'connector',
        description: '',
        type: PageElementType.LINE,
        line,
    } as IPageElement;
}

describe('LineAdaptor', () => {
    const adaptor = new LineAdaptor();

    it('renders a diagonal line as a stroke-only Path', () => {
        const p = adaptor.convert(lineElement({ start: { x: 0, y: 0 }, end: { x: 100, y: 50 } })) as Path;
        expect(p).toBeInstanceOf(Path);
        expect(p.dataArray.length).toBeGreaterThan(0);
        expect(p.fill).toBe('rgba(0,0,0,0)');
        expect(p.stroke).toBe('rgba(0,0,0,1)');
        // finite transform — no NaN from bbox scaling
        expect(Number.isFinite(p.scaleX as number)).toBe(true);
        expect(Number.isFinite(p.scaleY as number)).toBe(true);
    });

    it('handles an axis-aligned (zero-height) line without NaN scale', () => {
        const p = adaptor.convert(lineElement({ start: { x: 0, y: 0 }, end: { x: 100, y: 0 } }, 100, 0)) as Path;
        expect(p).toBeInstanceOf(Path);
        expect(Number.isFinite(p.scaleX as number)).toBe(true);
        expect(Number.isFinite(p.scaleY as number)).toBe(true);
    });

    it('applies outline weight / color / dash', () => {
        const p = adaptor.convert(lineElement({
            start: { x: 0, y: 0 },
            end: { x: 100, y: 50 },
            lineProperties: {
                shapeBackgroundFill: { rgb: 'rgb(0,0,0)' },
                outline: { outlineFill: { rgb: 'rgb(255,0,0)' }, weight: 3, dashStyle: BorderStyleTypes.DASHED },
            },
        })) as Path;
        expect(p.strokeWidth).toBe(3);
        expect(p.stroke).toBe('#ff0000');
        expect(p.strokeDashArray).toEqual([6, 4]);
    });

    it('defaults endpoints to the bounding-box diagonal when absent', () => {
        const p = adaptor.convert(lineElement({})) as Path;
        expect(p).toBeInstanceOf(Path);
        expect(p.dataArray.length).toBeGreaterThan(0);
    });
});
