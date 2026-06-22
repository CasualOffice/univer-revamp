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
import { Image } from '@univerjs/engine-render';
import { describe, expect, it } from 'vitest';
import { PageElementType } from '../../../../types/interfaces/i-slide-data';
import { ImageAdaptor } from '../image-adaptor';
import { buildImageAdjustments } from '../image-style';

function imageElement(imageProperties: Record<string, unknown>): IPageElement {
    return {
        id: 'img-1',
        zIndex: 1,
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        title: 'image',
        description: '',
        type: PageElementType.IMAGE,
        image: { imageProperties: { contentUrl: '', ...imageProperties } },
    } as unknown as IPageElement;
}

describe('buildImageAdjustments', () => {
    it('maps transparency to opacity (1 - t, clamped)', () => {
        expect(buildImageAdjustments({ contentUrl: '', transparency: 0.25 }).opacity).toBe(0.75);
        expect(buildImageAdjustments({ contentUrl: '', transparency: 0 }).opacity).toBe(1);
        expect(buildImageAdjustments({ contentUrl: '', transparency: 1 }).opacity).toBe(0);
    });

    it('maps brightness/contrast to a CSS filter (1 + v multipliers)', () => {
        expect(buildImageAdjustments({ contentUrl: '', brightness: 0.5 }).filter).toBe('brightness(1.5)');
        expect(buildImageAdjustments({ contentUrl: '', contrast: -0.5 }).filter).toBe('contrast(0.5)');
        expect(buildImageAdjustments({ contentUrl: '', brightness: 0.2, contrast: 0.3 }).filter)
            .toBe('brightness(1.2) contrast(1.3)');
    });

    it('omits opacity/filter when there is nothing to adjust', () => {
        expect(buildImageAdjustments({ contentUrl: '' })).toEqual({});
        // Zero brightness/contrast are no-ops (no filter emitted).
        expect(buildImageAdjustments({ contentUrl: '', brightness: 0, contrast: 0 }).filter).toBeUndefined();
        expect(buildImageAdjustments(undefined)).toEqual({});
    });
});

describe('ImageAdaptor adjustments', () => {
    const adaptor = new ImageAdaptor();

    it('passes opacity and filter through to the rendered Image', () => {
        const img = adaptor.convert(
            imageElement({ transparency: 0.25, brightness: 0.5, contrast: -0.5 })
        ) as Image;
        expect(img).toBeInstanceOf(Image);
        expect(img.opacity).toBe(0.75);
        expect(img.filter).toBe('brightness(1.5) contrast(0.5)');
    });

    it('leaves a plain image with default opacity and no filter', () => {
        const img = adaptor.convert(imageElement({})) as Image;
        expect(img.opacity).toBe(1);
        expect(img.filter).toBeUndefined();
    });
});
