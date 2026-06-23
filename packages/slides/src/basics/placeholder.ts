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

import type { ISlideData, ISlidePage, IPageElement } from '../types/interfaces/i-slide-data';
import { merge } from '@univerjs/core';

// Placeholder inheritance: a slide element that carries a `placeholder`
// reference inherits its geometry + styling from the matching placeholder on
// the slide's layout, which in turn inherits from the master. PowerPoint puts
// most positioning/formatting on layouts/masters, so resolving this is a large
// fidelity lever — and it's a pure pre-render transform: resolve the page's
// elements, then the existing adaptors render the resolved copies.
//
// Inheritance order (lowest → highest precedence): master ◁ layout ◁ element.
// Only geometry + shape/text styling inherit; identity fields (id/type/title/
// placeholder) are never inherited.

type PlaceholderKey = string;

function placeholderKey(type: number | string, index: number): PlaceholderKey {
    return `${type}:${index}`;
}

const GEOMETRY_FIELDS = ['left', 'top', 'width', 'height', 'angle', 'scaleX', 'scaleY', 'skewX', 'skewY', 'flipX', 'flipY'] as const;

function indexPlaceholders(page?: ISlidePage): Map<PlaceholderKey, IPageElement> {
    const map = new Map<PlaceholderKey, IPageElement>();
    if (!page?.pageElements) return map;
    for (const id of Object.keys(page.pageElements)) {
        const el = page.pageElements[id];
        const ph = el.shape?.placeholder ?? el.image?.placeholder;
        if (ph) {
            map.set(placeholderKey(ph.type, ph.index), el);
        }
    }
    return map;
}

/**
 * Merge inherited geometry + styling from layout/master placeholders into a
 * single element. Returns a new object; the element's own values always win.
 */
function applyInheritance(
    element: IPageElement,
    layoutPh?: IPageElement,
    masterPh?: IPageElement
): IPageElement {
    if (!layoutPh && !masterPh) return element;

    const resolved: IPageElement = { ...element };

    // Geometry: fill in only the fields the element omits (layout before master).
    for (const field of GEOMETRY_FIELDS) {
        if (resolved[field] === undefined) {
            const inherited = layoutPh?.[field] ?? masterPh?.[field];
            if (inherited !== undefined) {
                (resolved as unknown as Record<string, unknown>)[field] = inherited;
            }
        }
    }

    // Shape styling: master ◁ layout ◁ element. Only enrich existing shapes.
    if (resolved.shape) {
        resolved.shape = {
            ...resolved.shape,
            shapeProperties: merge(
                {},
                masterPh?.shape?.shapeProperties ?? {},
                layoutPh?.shape?.shapeProperties ?? {},
                resolved.shape.shapeProperties ?? {}
            ),
        };
    }

    // Rich-text default styling (font/size/color etc.): master ◁ layout ◁ element.
    if (resolved.richText) {
        resolved.richText = merge(
            {},
            masterPh?.richText ?? {},
            layoutPh?.richText ?? {},
            resolved.richText
        );
    }

    return resolved;
}

/**
 * Resolve placeholder inheritance for every element on a page. Falls back to
 * the page's own elements unchanged when there's no layout/master to inherit
 * from (so non-placeholder decks are unaffected).
 */
export function resolvePlaceholders(
    page: ISlidePage,
    refSource: Pick<ISlideData, 'layouts' | 'master'>
): { [id: string]: IPageElement } {
    const elements = page.pageElements ?? {};
    const layoutId = page.slideProperties?.layoutObjectId;
    const layoutPage = layoutId ? refSource.layouts?.[layoutId] : undefined;
    const masterId = layoutPage?.layoutProperties?.masterObjectId ?? page.slideProperties?.masterObjectId;
    const masterPage = masterId ? refSource.master?.[masterId] : undefined;

    if (!layoutPage && !masterPage) return elements;

    const layoutIdx = indexPlaceholders(layoutPage);
    const masterIdx = indexPlaceholders(masterPage);

    const resolved: { [id: string]: IPageElement } = {};
    for (const id of Object.keys(elements)) {
        const el = elements[id];
        const ph = el.shape?.placeholder ?? el.image?.placeholder;
        if (!ph) {
            resolved[id] = el;
            continue;
        }
        const key = placeholderKey(ph.type, ph.index);
        resolved[id] = applyInheritance(el, layoutIdx.get(key), masterIdx.get(key));
    }
    return resolved;
}
