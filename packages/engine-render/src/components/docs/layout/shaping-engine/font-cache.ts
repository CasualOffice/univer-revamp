/**
 * Copyright 2023-present DreamNum Co., Ltd.
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

import type { Nullable } from '@univerjs/core';
import type { IDocumentSkeletonBoundingBox, IDocumentSkeletonFontStyle } from '../../../../basics/i-document-skeleton-cached';
import type { IOpenTypeGlyphInfo } from './text-shaping';
import { ptToPixel } from '../../../../basics/tools';

export const DEFAULT_MEASURE_TEXT = '0';

export interface IMeasureTextCache {
    fontBoundingBoxAscent: number;
    fontBoundingBoxDescent: number;
    actualBoundingBoxAscent: number;
    actualBoundingBoxDescent: number;
    width: number;
}

const getDefaultBaselineOffset = (fontSize: number) => ({
    sbr: 0.6,
    sbo: fontSize,
    spr: 0.6,
    spo: fontSize,
});

interface IFontData {
    notDefWidth: number;
    ascender: number;
    descender: number;
    typoAscender: number;
    typoDescender: number;
    strikeoutPosition: number;
    subscriptSizeRatio: number;
    subscriptOffset: number;
    superscriptSizeRatio: number;
    superscriptOffset: number;
    hdmxData?: number[]; // hdmxData https://docs.microsoft.com/en-us/typography/opentype/spec/recom#hdmx
    glyphHorizonMap: Map<number, IGlyphHorizonData>;
}

interface IGlyphHorizonData {
    width: number;
    lsb: number;
    pixelsPerEm?: number[];
}

export class FontCache {
    // ---------------------------------------------------------------
    // Caching strategy notes
    //
    // Two text-measurement caches live on this class:
    //
    //   _globalFontMeasureCache — canvas `ctx.measureText()` results
    //     keyed by (fontStyle, content). Hot path; called per cell per
    //     render pass. Bounded at ~_MEASURE_CACHE_CAP entries with
    //     automatic eviction triggered from inside `setFontMeasureCache`.
    //
    //   _getTextHeightCache — DOM-fallback height measurements keyed by
    //     fontStyle (no content). Only hit when canvas TextMetrics is
    //     missing fontBoundingBoxAscent/Descent (older Safari, some
    //     Firefox versions). Smaller working set, bounded separately.
    //
    // Both use the same LRU trick: JS Maps preserve insertion order,
    // so deleting + re-setting a key on read moves it to the end of
    // the iteration order. Eviction walks from the front of the order,
    // so it drops the entries we haven't touched recently rather than
    // the entries we happened to insert first.
    //
    // The public `autoCleanFontMeasureCache(cacheLimit)` API still
    // works for opt-in callers (default cap argument unchanged at 1M
    // for backwards compat with existing callers), but the cache no
    // longer requires anyone to call it — the automatic trigger inside
    // setFontMeasureCache uses the tighter internal _MEASURE_CACHE_CAP.
    // ---------------------------------------------------------------

    // Default automatic-eviction cap. Empirically ~50k cells worth of
    // (fontStyle, content) pairs covers every workbook we've measured;
    // far below the 1M ceiling the old manual API defaulted to.
    private static readonly _MEASURE_CACHE_CAP = 50_000;
    // Cap for the DOM-fallback height cache (keyed by fontStyle only).
    private static readonly _HEIGHT_CACHE_CAP = 200;

    private static _getTextHeightCache: Map<string, { width: number; height: number }> = new Map();

    private static _context: CanvasRenderingContext2D;

    private static _fontDataMap: Map<string, IFontData> = new Map();

    private static _globalFontMeasureCache: Map<string, Map<string, IMeasureTextCache>> = new Map();

    // O(1) running total of entries across all fontStyle buckets so the
    // per-insert cap check doesn't have to re-sum every bucket. Re-sync'd
    // after any auto-clean pass to absorb drift (e.g. tests reaching in
    // and reassigning _globalFontMeasureCache directly).
    private static _measureCacheSize = 0;

    static get globalFontMeasureCache() {
        return this._globalFontMeasureCache;
    }

    static setFontMeasureCache(fontStyle: string, content: string, tm: IMeasureTextCache) {
        let fontMeasureCache = this._globalFontMeasureCache.get(fontStyle);
        if (!fontMeasureCache) {
            fontMeasureCache = new Map();
            this._globalFontMeasureCache.set(fontStyle, fontMeasureCache);
        }
        if (!fontMeasureCache.has(content)) this._measureCacheSize++;
        fontMeasureCache.set(content, tm);

        // Auto-evict when over cap. Drops down to half the cap (same
        // semantics as the existing autoCleanFontMeasureCache contract).
        if (this._measureCacheSize > this._MEASURE_CACHE_CAP) {
            this.autoCleanFontMeasureCache(this._MEASURE_CACHE_CAP);
        }
    }

    static clearFontMeasureCache(path: string) {
        const pathArr = path.split('/');
        if (pathArr.length === 1) {
            const fontStyle = pathArr[0];
            const bucket = this._globalFontMeasureCache.get(fontStyle);
            if (bucket) {
                this._measureCacheSize -= bucket.size;
                this._globalFontMeasureCache.delete(fontStyle);
            }
        } else if (pathArr.length === 2) {
            const fontStyle = pathArr[0];
            const content = pathArr[1];
            const bucket = this._globalFontMeasureCache.get(fontStyle);
            if (bucket?.delete(content)) this._measureCacheSize--;
        } else {
            return false;
        }
        return true;
    }

    static getFontMeasureCache(fontStyle: string, content: string): Nullable<IMeasureTextCache> {
        const bucket = this._globalFontMeasureCache.get(fontStyle);
        if (!bucket) return undefined;
        const value = bucket.get(content);
        if (value !== undefined) {
            // LRU bump — delete + re-set moves this key to the end of
            // the bucket's iteration order so eviction (which walks
            // from the front) drops the least-recently-used entries.
            bucket.delete(content);
            bucket.set(content, value);
        }
        return value;
    }

    // Automatically clear text cache, threshold is adjustable, clear rule is to delete half of the cache after reaching the upper limit
    static autoCleanFontMeasureCache(cacheLimit: number = 1000000) {
        let allSize = 0;
        let isDelete = false;
        let i = 0;

        for (const item of this._globalFontMeasureCache) {
            const [, values] = item;
            allSize += values.size;
            if (allSize > cacheLimit) {
                isDelete = true;
                break;
            }
            i++;
        }

        if (isDelete) {
            let deleteAllSize = 0;
            for (const item of this._globalFontMeasureCache) {
                const [key, values] = item;
                deleteAllSize += values.size;
                if (deleteAllSize > cacheLimit / 2) {
                    const limit = deleteAllSize - cacheLimit / 2;
                    this._clearMeasureCache(limit, values); // If the number of characters under the font style exceeds the threshold, clear deeply internally
                    break;
                }

                // Clear font cache under the entire style
                this._globalFontMeasureCache.delete(key);
            }

            // Re-sync the size tracker from the actual cache state so
            // drift (tests, external reassignment, the partial-bucket
            // _clearMeasureCache pass above) doesn't leak into future
            // auto-eviction trigger decisions.
            this._recountMeasureCacheSize();

            return true;
        }

        return false;
    }

    private static _recountMeasureCacheSize() {
        let total = 0;
        for (const bucket of this._globalFontMeasureCache.values()) total += bucket.size;
        this._measureCacheSize = total;
    }

    static getBaselineOffsetInfo(fontFamily: string, fontSize: number) {
        if (this._fontDataMap.size === 0) {
            return getDefaultBaselineOffset(fontSize);
        }

        const fontFamilyList = fontFamily.split(',');

        for (let ff of fontFamilyList) {
            ff = ff.replace(/'/g, '');
            const fontData = this._fontDataMap.get(ff);
            if (!fontData) {
                continue;
            }

            const { subscriptSizeRatio, subscriptOffset, superscriptSizeRatio, superscriptOffset } = fontData;

            return {
                sbr: subscriptSizeRatio,
                sbo: subscriptOffset * fontSize,
                spr: superscriptSizeRatio,
                spo: superscriptOffset * fontSize,
            };
        }
        return getDefaultBaselineOffset(fontSize);
    }

    static getTextSizeByDom(text: string, fontStyle: string) {
        const cached = this._getTextHeightCache.get(fontStyle);
        if (cached !== undefined) {
            // LRU bump — same trick as the measure cache; moves the hit
            // to the end of iteration order so the eviction below drops
            // entries we haven't seen recently.
            this._getTextHeightCache.delete(fontStyle);
            this._getTextHeightCache.set(fontStyle, cached);
            return cached;
        }

        let dom = document.getElementById('universheetTextSizeTest');
        const defaultStyle = 'float:left;white-space:nowrap;visibility:hidden;margin:0;padding:0;';
        if (!dom) {
            dom = document.createElement('span');
            // dom.style.cssText = 'visibility:hidden;';
            dom.id = 'universheetTextSizeTest';
            document.getElementsByTagName('body')[0].appendChild(dom);
        }
        dom.style.cssText += `${defaultStyle};${fontStyle}`;
        dom.textContent = text;
        const rect = dom.getBoundingClientRect();
        const result = { width: rect.width, height: rect.height };
        this._getTextHeightCache.set(fontStyle, result);

        // Bound the DOM-fallback cache. 25% eviction matches the
        // measure-cache "drop down to half the cap" cadence: enough
        // breathing room that we don't immediately re-trigger on the
        // next miss, small enough that long-lived sessions don't bloat.
        if (this._getTextHeightCache.size > this._HEIGHT_CACHE_CAP) {
            const toRemove = Math.max(1, Math.floor(this._HEIGHT_CACHE_CAP / 4));
            let removed = 0;
            for (const key of this._getTextHeightCache.keys()) {
                if (removed >= toRemove) break;
                this._getTextHeightCache.delete(key);
                removed++;
            }
        }

        return result;
    }

    static getTextSize(content: string, fontStyle: IDocumentSkeletonFontStyle): IDocumentSkeletonBoundingBox {
        const { fontString, fontSize, fontFamily } = fontStyle;

        let bBox = this._getBoundingBoxByFont(fontFamily, fontSize);

        if (!bBox) {
            // if (content === DataStreamTreeTokenType.PARAGRAPH) {
            //     content = '0';
            // }
            const measureText = this.getMeasureText(content, fontString);
            bBox = this._calculateBoundingBoxByMeasureText(measureText, fontStyle);
        }

        return bBox;
    }

    static getBBoxFromGlyphInfo(glyphInfo: IOpenTypeGlyphInfo, fontStyle: IDocumentSkeletonFontStyle) {
        const glyph = glyphInfo.glyph!;
        const font = glyphInfo.font!;
        const { y1, y2 } = glyphInfo.boundingBox!;
        const scale = ptToPixel(fontStyle.fontSize) / font.unitsPerEm;

        const { ascender, descender } = font;

        return this._calculateBoundingBoxByMeasureText({
            width: (glyph.advanceWidth ?? 0) * scale,
            fontBoundingBoxAscent: ascender * scale,
            fontBoundingBoxDescent: Math.abs(descender * scale),
            actualBoundingBoxAscent: y2 * scale,
            actualBoundingBoxDescent: Math.abs(y1 * scale),
        }, fontStyle);
    }

    /**
     * Measure text on another canvas.
     * @param content
     * @param fontString
     * @returns IMeasureTextCache
     */
    static getMeasureText(content: string, fontString: string): IMeasureTextCache {
        if (!this._context) {
            const canvas = document.createElement('canvas');
            this._context = canvas.getContext('2d')!;
        }
        if (!this._context) {
            return {
                width: 0,
                fontBoundingBoxAscent: 0,
                fontBoundingBoxDescent: 0,
                actualBoundingBoxAscent: 0,
                actualBoundingBoxDescent: 0,
            };
        }
        // const { fontString, fontSize, fontFamily } = fontStyle;

        const ctx = this._context;

        const mtc = this.getFontMeasureCache(fontString, content);
        if (mtc != null) {
            return mtc;
        }
        ctx.font = fontString;

        const textMetrics = ctx.measureText(content);

        const {
            width,
            fontBoundingBoxAscent,
            fontBoundingBoxDescent,
            actualBoundingBoxAscent,
            actualBoundingBoxDescent,
        } = textMetrics;

        const cache: IMeasureTextCache = {
            width,
            fontBoundingBoxAscent,
            fontBoundingBoxDescent,
            actualBoundingBoxAscent,
            actualBoundingBoxDescent,
        };

        // Compatibility for browsers that do not support textMetrics
        if (
            fontBoundingBoxAscent == null ||
            fontBoundingBoxDescent == null ||
            Number.isNaN(fontBoundingBoxAscent) ||
            Number.isNaN(fontBoundingBoxDescent)
        ) {
            const oneLineTextHeight = this.getTextSizeByDom(DEFAULT_MEASURE_TEXT, fontString).height;

            if (ctx.textBaseline === 'top') {
                cache.fontBoundingBoxAscent = cache.actualBoundingBoxAscent = oneLineTextHeight;
                cache.fontBoundingBoxDescent = cache.actualBoundingBoxDescent = 0;
            } else if (ctx.textBaseline === 'middle') {
                cache.fontBoundingBoxDescent = cache.actualBoundingBoxDescent = oneLineTextHeight / 2;
                cache.fontBoundingBoxAscent = cache.actualBoundingBoxAscent = oneLineTextHeight / 2;
            } else {
                cache.fontBoundingBoxDescent = cache.actualBoundingBoxDescent = 0;
                cache.fontBoundingBoxAscent = cache.actualBoundingBoxAscent = oneLineTextHeight;
            }
        }

        this.setFontMeasureCache(fontString, content, cache);

        return cache;
    }

    private static _clearMeasureCache(limit: number, values: Map<string, IMeasureTextCache>) {
        let valueIndex = 0;
        for (const txtItem of values) {
            const [txtKey] = txtItem;
            if (valueIndex > limit) {
                break;
            }
            values.delete(txtKey);
            valueIndex++;
        }
        return true;
    }

    /**
     * Vertical Metrics https://glyphsapp.com/learn/vertical-metrics
     * @param fontFamily
     * @param fontSize
     * @param content
     * @returns
     */
    private static _getBoundingBoxByFont(fontFamily: string, fontSize = 28, content: string = '') {
        const fontData = this._fontDataMap.get(fontFamily);

        if (!fontData) {
            return;
        }
        const {
            notDefWidth,
            ascender,
            descender,
            typoAscender,
            typoDescender,
            strikeoutPosition,
            subscriptSizeRatio,
            subscriptOffset,
            superscriptSizeRatio,
            superscriptOffset,
            hdmxData,
            glyphHorizonMap,
        } = fontData;

        const pixelsPerEmIndex = hdmxData?.indexOf(Math.floor(fontSize));

        const glyph = glyphHorizonMap.get(content.charCodeAt(0));
        let widthResult = notDefWidth;
        if (glyph) {
            const { width, pixelsPerEm = [] } = glyph;

            if (pixelsPerEmIndex) {
                widthResult = pixelsPerEm[pixelsPerEmIndex];
            } else {
                widthResult = width;
            }
        }
        return {
            width: widthResult * fontSize,
            ba: ascender * fontSize,
            bd: descender * fontSize,
            aba: typoAscender * fontSize,
            abd: typoDescender * fontSize,
            sp: strikeoutPosition * fontSize,
            sbr: subscriptSizeRatio,
            sbo: subscriptOffset * fontSize,
            spr: superscriptSizeRatio,
            spo: superscriptOffset * fontSize,
        };
    }

    private static _calculateBoundingBoxByMeasureText(textCache: IMeasureTextCache, fontStyle: IDocumentSkeletonFontStyle) {
        const {
            width,
            fontBoundingBoxAscent,
            fontBoundingBoxDescent,
            actualBoundingBoxAscent: aba,
            actualBoundingBoxDescent: abd,
        } = textCache;

        const { fontSize, originFontSize } = fontStyle;
        const scale = originFontSize / fontSize;
        const ba = fontBoundingBoxAscent * scale;
        const bd = fontBoundingBoxDescent * scale;

        return {
            width,
            ba,
            bd,
            aba,
            abd,
            sp: (fontBoundingBoxAscent + fontBoundingBoxDescent) / 2,
            sbr: 0.6,
            spr: 0.6,
            // https://en.wikipedia.org/wiki/Subscript_and_superscript Microsoft Word 2015
            sbo: (ba + bd) * 0.141,
            spo: (ba + bd) * 0.4,
        };
    }
}
