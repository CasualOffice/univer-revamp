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

import type { IColorScheme } from '../../types/interfaces/i-slide-data';
import { ThemeColorType } from '@univerjs/core';
import { describe, expect, it } from 'vitest';
import { resolveThemeColor } from '../theme-color';

const scheme: IColorScheme = {
    [ThemeColorType.ACCENT1]: 'rgb(255,0,0)',
    [ThemeColorType.DARK1]: '#123456',
};

describe('resolveThemeColor', () => {
    it('resolves rgb colors (normalized to hex)', () => {
        expect(resolveThemeColor({ rgb: 'rgb(0,0,255)' })).toBe('#0000ff');
    });

    it('resolves a theme color against the deck scheme', () => {
        expect(resolveThemeColor({ th: ThemeColorType.ACCENT1 }, scheme)).toBe('#ff0000');
        expect(resolveThemeColor({ th: ThemeColorType.DARK1 }, scheme)).toBe('#123456');
    });

    it('falls back to the Office default when the scheme lacks the slot', () => {
        // ACCENT3 not in the custom scheme → core Office default (some concrete color).
        const resolved = resolveThemeColor({ th: ThemeColorType.ACCENT3 }, scheme);
        expect(typeof resolved).toBe('string');
        expect(resolved).toBeTruthy();
    });

    it('falls back to the Office default when no scheme is provided', () => {
        expect(resolveThemeColor({ th: ThemeColorType.ACCENT1 })).toBeTruthy();
    });

    it('returns undefined for empty/nullish color', () => {
        expect(resolveThemeColor(undefined)).toBeUndefined();
        expect(resolveThemeColor(null)).toBeUndefined();
        expect(resolveThemeColor({})).toBeUndefined();
    });

    it('prefers an explicit rgb over the scheme', () => {
        expect(resolveThemeColor({ rgb: 'rgb(1,2,3)', th: ThemeColorType.ACCENT1 }, scheme)).toBe('#010203');
    });
});
