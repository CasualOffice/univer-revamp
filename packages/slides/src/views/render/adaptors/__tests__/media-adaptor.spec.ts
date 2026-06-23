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
import { Image, Rect } from '@univerjs/engine-render';
import { describe, expect, it } from 'vitest';
import { PageElementType } from '../../../../types/interfaces/i-slide-data';
import { ChartAdaptor } from '../chart-adaptor';
import { VideoAdaptor } from '../video-adaptor';

function element(type: PageElementType, extra: Partial<IPageElement>): IPageElement {
    return {
        id: 'm-1', zIndex: 1, left: 0, top: 0, width: 200, height: 120,
        title: 'media', description: '', type, ...extra,
    } as IPageElement;
}

describe('VideoAdaptor', () => {
    const adaptor = new VideoAdaptor();

    it('renders the poster frame as an Image when present', () => {
        const obj = adaptor.convert(element(PageElementType.VIDEO, { video: { posterUrl: 'data:image/png;base64,AA==' } }));
        expect(obj).toBeInstanceOf(Image);
    });

    it('renders a placeholder Rect when there is no poster', () => {
        const obj = adaptor.convert(element(PageElementType.VIDEO, { video: { sourceUrl: 'clip.mp4' } }));
        expect(obj).toBeInstanceOf(Rect);
    });
});

describe('ChartAdaptor', () => {
    const adaptor = new ChartAdaptor();

    it('renders the cached preview as an Image when present', () => {
        const obj = adaptor.convert(element(PageElementType.CHART, { chart: { previewUrl: 'data:image/png;base64,AA==' } }));
        expect(obj).toBeInstanceOf(Image);
    });

    it('renders a placeholder Rect when there is no preview', () => {
        const obj = adaptor.convert(element(PageElementType.CHART, { chart: { chartType: 'bar', embeddedPart: '<c:chart/>' } }));
        expect(obj).toBeInstanceOf(Rect);
    });
});
