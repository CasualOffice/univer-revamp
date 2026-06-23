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

import type { ISlideData, ISlidePage, IPageElement } from '../../types/interfaces/i-slide-data';
import { describe, expect, it } from 'vitest';
import { BasicShapes } from '../../types/enum/prst-geom-type';
import { PageElementType, PageType } from '../../types/interfaces/i-slide-data';
import { resolvePlaceholders } from '../placeholder';

const PH = { type: 0 as never, index: 0, parentObjectId: '' }; // placeholder type 0, index 0

function shapeEl(id: string, props: Partial<IPageElement>, shapeProps: Record<string, unknown> = {}, withPlaceholder = true): IPageElement {
    return {
        id, zIndex: 1, title: id, description: '', type: PageElementType.SHAPE,
        shape: {
            shapeType: BasicShapes.Rect, text: '',
            shapeProperties: { shapeBackgroundFill: { rgb: '#ffffff' }, ...shapeProps } as never,
            ...(withPlaceholder ? { placeholder: PH } : {}),
        },
        ...props,
    } as IPageElement;
}

function page(id: string, pageElements: Record<string, IPageElement>, extra: Partial<ISlidePage> = {}): ISlidePage {
    return { id, pageType: PageType.SLIDE, zIndex: 1, title: id, description: '', pageBackgroundFill: { rgb: '#fff' }, pageElements, ...extra };
}

function refSource(layout: ISlidePage, master: ISlidePage): Pick<ISlideData, 'layouts' | 'master'> {
    return { layouts: { L1: layout }, master: { M1: master } };
}

describe('resolvePlaceholders', () => {
    const master = page('M1', {
        m1: shapeEl('m1', { left: 5, top: 5, width: 900, height: 100 }, { shapeBackgroundFill: { rgb: '#000000' } }),
    });
    const layout = page('L1', {
        l1: shapeEl('l1', { left: 10, top: 20, width: 800, height: 80 }),
    }, { layoutProperties: { masterObjectId: 'M1', name: 'Title' } });

    it('inherits omitted geometry from the layout placeholder', () => {
        const slide = page('S1', {
            // element omits width/height → inherit from layout (800x80)
            e1: shapeEl('e1', { left: 50, top: 60 }),
        }, { slideProperties: { layoutObjectId: 'L1', masterObjectId: 'M1', isSkipped: false } });

        const resolved = resolvePlaceholders(slide, refSource(layout, master));
        expect(resolved.e1.left).toBe(50); // own value wins
        expect(resolved.e1.top).toBe(60);
        expect(resolved.e1.width).toBe(800); // inherited from layout
        expect(resolved.e1.height).toBe(80);
    });

    it('falls back to master geometry when the layout omits it', () => {
        const layoutNoGeom = page('L1', { l1: shapeEl('l1', {}) }, { layoutProperties: { masterObjectId: 'M1', name: 'T' } });
        const slide = page('S1', { e1: shapeEl('e1', {}) },
            { slideProperties: { layoutObjectId: 'L1', masterObjectId: 'M1', isSkipped: false } });

        const resolved = resolvePlaceholders(slide, refSource(layoutNoGeom, master));
        expect(resolved.e1.width).toBe(900); // from master
        expect(resolved.e1.left).toBe(5);
    });

    it('merges shape styling master <- layout <- element (element wins)', () => {
        const slide = page('S1', {
            e1: shapeEl('e1', {}, { shapeBackgroundFill: { rgb: '#ff0000' } }),
        }, { slideProperties: { layoutObjectId: 'L1', masterObjectId: 'M1', isSkipped: false } });

        const resolved = resolvePlaceholders(slide, refSource(layout, master));
        // element fill wins over master's #000000
        expect(resolved.e1.shape!.shapeProperties.shapeBackgroundFill).toEqual({ rgb: '#ff0000' });
    });

    it('passes non-placeholder elements through unchanged', () => {
        const plain = shapeEl('p1', { left: 1, top: 2 }, {}, false);
        const slide = page('S1', { p1: plain },
            { slideProperties: { layoutObjectId: 'L1', masterObjectId: 'M1', isSkipped: false } });
        const resolved = resolvePlaceholders(slide, refSource(layout, master));
        expect(resolved.p1).toBe(plain); // same reference, untouched
    });

    it('returns elements unchanged when there is no layout/master', () => {
        const slide = page('S1', { e1: shapeEl('e1', {}) }); // no slideProperties
        const elements = slide.pageElements;
        expect(resolvePlaceholders(slide, { layouts: {}, master: {} })).toBe(elements);
    });
});
