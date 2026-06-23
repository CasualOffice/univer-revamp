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

import type { ISlideData } from '../types/interfaces/i-slide-data';

/**
 * Current canonical-snapshot schema version for `ISlideData`. Bump this when a
 * structural change requires a migration step, and add the step in
 * `migrateSlideSnapshot`.
 */
export const SLIDE_SCHEMA_VERSION = 1;

/**
 * The canonical (de)serialization contract for a slide deck.
 *
 * Round-trip invariant: `migrateSlideSnapshot(serializeSlideSnapshot(model)) `
 * deep-equals the model's snapshot. The model holds exactly one canonical,
 * versioned `ISlideData`; round-trip (PPTX/ODP) and collaborative editing both
 * build on this single source of truth.
 *
 * Migration is forward-only and idempotent: feeding an already-current snapshot
 * back through `migrateSlideSnapshot` returns an equivalent snapshot.
 */

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Normalize + upgrade a raw snapshot to the current schema version.
 *
 * - Stamps `schemaVersion`.
 * - Guarantees the `body` exists with mutually-consistent `pages`/`pageOrder`
 *   (every ordered id has a page; every page is ordered exactly once; unknown
 *   ids are dropped, unordered pages are appended).
 *
 * Does NOT mutate the input.
 */
export function migrateSlideSnapshot(raw: Partial<ISlideData>): ISlideData {
    const snapshot = structuredCloneSafe(raw) as ISlideData;

    // v0 → v1: ensure a structurally valid body with a consistent page order.
    const body = isPlainObject(snapshot.body) ? snapshot.body : undefined;
    const pages = body && isPlainObject(body.pages) ? body.pages : {};
    const rawOrder = body && Array.isArray(body.pageOrder) ? body.pageOrder : [];

    const seen = new Set<string>();
    const pageOrder: string[] = [];
    // Keep declared order, but only ids that resolve to a real page, once each.
    for (const id of rawOrder) {
        if (typeof id === 'string' && pages[id] && !seen.has(id)) {
            seen.add(id);
            pageOrder.push(id);
        }
    }
    // Append any pages that exist but weren't in the order.
    for (const id of Object.keys(pages)) {
        if (!seen.has(id)) {
            seen.add(id);
            pageOrder.push(id);
        }
    }

    snapshot.body = { pages, pageOrder };
    snapshot.schemaVersion = SLIDE_SCHEMA_VERSION;
    return snapshot;
}

/**
 * Produce a stable, deeply-cloned canonical snapshot suitable for persistence /
 * transport. Detached from the model's live object so later edits don't mutate
 * the serialized copy.
 */
export function serializeSlideSnapshot(snapshot: ISlideData): ISlideData {
    return structuredCloneSafe(snapshot) as ISlideData;
}

function structuredCloneSafe<T>(value: T): T {
    // structuredClone isn't guaranteed in every runtime/test target; fall back
    // to JSON which is sufficient for the JSON-serializable slide snapshot.
    if (typeof structuredClone === 'function') {
        return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
}
