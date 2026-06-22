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

import type { IImageProperties } from '@univerjs/core';

// Maps the slide image adjustment model onto the engine-render Image render
// props. Scales follow the product's PPTX importer (point/apps/web/src/pptx):
//   - transparency: 0..1 fraction (0 = opaque, 1 = invisible) → opacity = 1 - t
//   - brightness/contrast: signed -1..1 fraction (0 = unchanged), the OOXML
//     `lum@bright`/`@contrast` model (raw / 100000) → CSS multiplier (1 + v)

export interface IImageAdjustments {
    opacity?: number;
    filter?: string;
}

function clamp01(n: number): number {
    return Math.max(0, Math.min(1, n));
}

export function buildImageAdjustments(props?: IImageProperties): IImageAdjustments {
    if (!props) return {};
    const result: IImageAdjustments = {};

    if (typeof props.transparency === 'number') {
        result.opacity = clamp01(1 - props.transparency);
    }

    const filters: string[] = [];
    if (typeof props.brightness === 'number' && props.brightness !== 0) {
        // -1..1 → multiplier 0..2 (clamped at 0 so we never go negative).
        filters.push(`brightness(${Math.max(0, 1 + props.brightness)})`);
    }
    if (typeof props.contrast === 'number' && props.contrast !== 0) {
        filters.push(`contrast(${Math.max(0, 1 + props.contrast)})`);
    }
    if (filters.length > 0) {
        result.filter = filters.join(' ');
    }

    return result;
}
