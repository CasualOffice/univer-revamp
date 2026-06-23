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

import type { IColorStyle, Nullable } from '@univerjs/core';
import type { IColorScheme } from '../types/interfaces/i-slide-data';
import { getColorStyle } from '@univerjs/core';

// Resolve a color style to a concrete CSS string, honoring the deck's color
// scheme for theme-color (`th`) references.
//
// Univer core's getColorStyle already resolves `th`, but ONLY against the
// built-in Office palette — so a deck with a custom theme renders theme colors
// wrong. This resolver checks the deck scheme first, then falls back to
// getColorStyle (rgb, or the Office default for `th`). Normalization is reused
// from getColorStyle by funneling the scheme value back through it as `rgb`.

export function resolveThemeColor(
    color: Nullable<IColorStyle>,
    scheme?: IColorScheme
): Nullable<string> {
    if (!color) return undefined;

    // Match getColorStyle precedence: an explicit rgb wins over a theme ref.
    if (!color.rgb && color.th != null && scheme) {
        const slot = scheme[color.th];
        if (slot) {
            return getColorStyle({ rgb: slot }) ?? undefined;
        }
    }

    // rgb colors, and `th` without a deck scheme entry (Office default).
    return getColorStyle(color) ?? undefined;
}
