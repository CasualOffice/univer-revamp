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

import type { ISlideData } from '../../types/interfaces/i-slide-data';
import { describe, expect, it } from 'vitest';
import { PageElementType, PageType } from '../../types/interfaces/i-slide-data';
import { migrateSlideSnapshot, SLIDE_SCHEMA_VERSION, serializeSlideSnapshot } from '../migrate';

function page(id: string) {
    return {
        id,
        pageType: PageType.SLIDE,
        zIndex: 1,
        title: id,
        description: '',
        pageBackgroundFill: { rgb: '#ffffff' },
        pageElements: {},
    };
}

function deck(): ISlideData {
    return {
        id: 'deck-1',
        title: 'Deck',
        pageSize: { width: 960, height: 540 },
        body: {
            pages: { a: page('a'), b: page('b') },
            pageOrder: ['a', 'b'],
        },
    };
}

describe('migrateSlideSnapshot', () => {
    it('stamps the current schema version', () => {
        expect(migrateSlideSnapshot(deck()).schemaVersion).toBe(SLIDE_SCHEMA_VERSION);
    });

    it('creates an empty consistent body when missing', () => {
        const migrated = migrateSlideSnapshot({ id: 'x', title: 't', pageSize: { width: 1, height: 1 } });
        expect(migrated.body).toEqual({ pages: {}, pageOrder: [] });
    });

    it('drops order ids without a page and appends unordered pages', () => {
        const migrated = migrateSlideSnapshot({
            id: 'x',
            title: 't',
            pageSize: { width: 1, height: 1 },
            body: {
                pages: { a: page('a'), b: page('b'), c: page('c') },
                // 'ghost' has no page; 'b' missing from order; 'a' duplicated.
                pageOrder: ['a', 'ghost', 'a', 'c'],
            },
        });
        // ghost dropped, duplicate a collapsed, b appended at the end.
        expect(migrated.body!.pageOrder).toEqual(['a', 'c', 'b']);
        expect(Object.keys(migrated.body!.pages).sort()).toEqual(['a', 'b', 'c']);
    });

    it('does not mutate its input', () => {
        const input = { id: 'x', title: 't', pageSize: { width: 1, height: 1 } };
        const before = JSON.stringify(input);
        migrateSlideSnapshot(input);
        expect(JSON.stringify(input)).toBe(before);
    });

    it('is idempotent on an already-current snapshot', () => {
        const once = migrateSlideSnapshot(deck());
        const twice = migrateSlideSnapshot(once);
        expect(twice).toEqual(once);
    });
});

describe('serializeSlideSnapshot round-trip', () => {
    it('round-trips losslessly (serialize → migrate deep-equals)', () => {
        const migrated = migrateSlideSnapshot(deck());
        const serialized = serializeSlideSnapshot(migrated);
        expect(migrateSlideSnapshot(serialized)).toEqual(migrated);
    });

    it('detaches the serialized copy from the source', () => {
        const migrated = migrateSlideSnapshot(deck());
        const serialized = serializeSlideSnapshot(migrated);
        // Mutate the source; the serialized snapshot must be unaffected.
        migrated.body!.pages.a.title = 'changed';
        expect(serialized.body!.pages.a.title).toBe('a');
    });

    it('preserves line / chart / video elements losslessly (Gap 3 round-trip)', () => {
        const d = deck();
        d.body!.pages.a.pageElements = {
            ln: {
                id: 'ln', zIndex: 1, left: 0, top: 0, width: 100, height: 0,
                title: 'connector', description: '', type: PageElementType.LINE,
                line: { lineType: 'straightConnector1', start: { x: 0, y: 0 }, end: { x: 100, y: 50 } },
            },
            ch: {
                id: 'ch', zIndex: 2, left: 10, top: 10, width: 300, height: 200,
                title: 'chart', description: '', type: PageElementType.CHART,
                chart: { chartType: 'bar', embeddedPart: '<c:chart/>', spec: { series: [1, 2, 3] } },
            },
            vid: {
                id: 'vid', zIndex: 3, left: 20, top: 20, width: 320, height: 180,
                title: 'video', description: '', type: PageElementType.VIDEO,
                video: { sourceUrl: 'media/clip.mp4', posterUrl: 'media/poster.png', mimeType: 'video/mp4' },
            },
        };

        const migrated = migrateSlideSnapshot(d);
        const roundTripped = migrateSlideSnapshot(serializeSlideSnapshot(migrated));
        expect(roundTripped).toEqual(migrated);
        // The opaque chart part and media refs survive verbatim.
        expect(roundTripped.body!.pages.a.pageElements.ch.chart!.embeddedPart).toBe('<c:chart/>');
        expect(roundTripped.body!.pages.a.pageElements.vid.video!.sourceUrl).toBe('media/clip.mp4');
    });
});
