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

import type { IRange } from '../typedef';
import { describe, expect, it } from 'vitest';
import { Rectangle } from '../../shared';
import { SpanModel } from '../span-model';
import { RANGE_TYPE } from '../typedef';

function getMergeRange(mergeData: IRange[], startRow: number, startColumn: number, endRow: number, endColumn: number) {
    const ranges: IRange[] = [];
    for (const range of mergeData || []) {
        if (Rectangle.intersects(range, {
            startRow,
            endRow,
            startColumn,
            endColumn,
        })) {
            ranges.push({
                ...range,
            });
        }
    }
    return ranges;
}

describe('test span mode', () => {
    it('test getMergedCell', () => {
        const ranges: IRange[] = [
            { startRow: 1, endRow: 2, startColumn: 1, endColumn: 2 },
        ];
        const spanModel = new SpanModel(ranges);

        const mergedCell = spanModel.getMergedCell(1, 1);
        expect(mergedCell).toEqual({ startRow: 1, endRow: 2, startColumn: 1, endColumn: 2 });

        const mergedCell2 = spanModel.getMergedCell(1, 2);
        expect(mergedCell2).toEqual({ startRow: 1, endRow: 2, startColumn: 1, endColumn: 2 });

        const mergedCell3 = spanModel.getMergedCell(2, 4);
        expect(mergedCell3).toEqual(null);
    });

    it('test getMergedCellByRange', () => {
        const ranges: IRange[] = [
            { startRow: 1, endRow: 2, startColumn: 1, endColumn: 2 },
            { startRow: 3, endRow: 4, startColumn: 3, endColumn: 4 },
        ];
        const spanModel = new SpanModel(ranges);

        const range1 = getMergeRange(ranges, 1, 1, 2, 2);
        const mergedCell = spanModel.getMergedCellRange(1, 1, 2, 2);

        expect(mergedCell).toEqual(range1);
    });

    it('test getMergedCellByRange complex', () => {
        const ranges: IRange[] = [
            {
                startRow: 0,
                startColumn: 0,
                endRow: 3,
                endColumn: 2,
                rangeType: 0,
            },
            {
                startRow: 4,
                startColumn: 3,
                endRow: 9,
                endColumn: 3,
                rangeType: 0,
            },
            {
                startRow: 1,
                startColumn: 3,
                endRow: 1,
                endColumn: 7,
                rangeType: 0,
            },
            {
                startRow: 5,
                startColumn: 4,
                endRow: 13,
                endColumn: 6,
                rangeType: 0,
            },
            {
                startRow: 1,
                startColumn: 8,
                endRow: 18,
                endColumn: 8,
                rangeType: 0,
            },
            {
                startRow: 20,
                startColumn: 0,
                endRow: 21,
                endColumn: 10,
                rangeType: 0,
            },
        ];
        const spanModel = new SpanModel(ranges);

        const range1 = getMergeRange(ranges, 1, 1, 2, 2);
        const mergedCell = spanModel.getMergedCellRange(1, 1, 2, 2);

        expect(mergedCell).toEqual(range1);
    });

    it('test getMergedCellByRange repeat using cache', () => {
        const ranges: IRange[] = [
            {
                startRow: 0,
                startColumn: 0,
                endRow: 3,
                endColumn: 2,
                rangeType: 0,
            },
            {
                startRow: 4,
                startColumn: 3,
                endRow: 9,
                endColumn: 3,
                rangeType: 0,
            },
            {
                startRow: 1,
                startColumn: 3,
                endRow: 1,
                endColumn: 7,
                rangeType: 0,
            },
            {
                startRow: 5,
                startColumn: 4,
                endRow: 13,
                endColumn: 6,
                rangeType: 0,
            },
            {
                startRow: 1,
                startColumn: 8,
                endRow: 18,
                endColumn: 8,
                rangeType: 0,
            },
            {
                startRow: 20,
                startColumn: 0,
                endRow: 21,
                endColumn: 10,
                rangeType: 0,
            },
        ];
        const spanModel = new SpanModel(ranges);

        const range1 = getMergeRange(ranges, 1, 1, 2, 2);
        const mergedCell = spanModel.getMergedCellRange(1, 1, 2, 2);

        expect(mergedCell).toEqual(range1);

        const mergedCell1 = spanModel.getMergedCellRange(1, 1, 2, 2);
        expect(mergedCell1).toEqual(range1);

        const mergedCell2 = spanModel.getMergedCellRange(1, 1, 2, 2);
        expect(mergedCell2).toEqual(mergedCell1);
    });

    it('test update snapshot', () => {
        const ranges: IRange[] = [
            {
                startRow: 0,
                startColumn: 0,
                endRow: 3,
                endColumn: 2,
                rangeType: 0,
            },
            {
                startRow: 4,
                startColumn: 3,
                endRow: 9,
                endColumn: 3,
                rangeType: 0,
            },
            {
                startRow: 1,
                startColumn: 3,
                endRow: 1,
                endColumn: 7,
                rangeType: 0,
            },
            {
                startRow: 5,
                startColumn: 4,
                endRow: 13,
                endColumn: 6,
                rangeType: 0,
            },
            {
                startRow: 1,
                startColumn: 8,
                endRow: 18,
                endColumn: 8,
                rangeType: 0,
            },
            {
                startRow: 20,
                startColumn: 0,
                endRow: 21,
                endColumn: 10,
                rangeType: 0,
            },
        ];
        const spanModel = new SpanModel(ranges);

        const range1 = getMergeRange(ranges, 1, 1, 2, 2);
        const mergedCell = spanModel.getMergedCellRange(1, 1, 2, 2);

        expect(mergedCell).toEqual(range1);

        ranges.push({ startRow: 30, endRow: 32, startColumn: 1, endColumn: 2 });
        spanModel.rebuild(ranges);

        const range2 = getMergeRange(ranges, 30, 1, 32, 2);
        const mergedCell2 = spanModel.getMergedCellRange(30, 1, 32, 2);

        expect(mergedCell2).toEqual(range2);
    });

    it('test column range', () => {
        const ranges: IRange[] = [
            { startRow: 1, endRow: 2, startColumn: 1, endColumn: 2, rangeType: RANGE_TYPE.COLUMN },
        ];
        const spanModel = new SpanModel(ranges);
        expect(Boolean(spanModel.getMergedCell(1, 1))).toEqual(true);
        expect(Boolean(spanModel.getMergedCell(1, 2))).toEqual(true);
        expect(Boolean(spanModel.getMergedCell(1, 3))).toEqual(false);
    });
    it('test row range', () => {
        const ranges: IRange[] = [
            { startRow: 1, endRow: 2, startColumn: 1, endColumn: 2, rangeType: RANGE_TYPE.ROW },
        ];
        const spanModel = new SpanModel(ranges);
        expect(Boolean(spanModel.getMergedCell(1, 1))).toEqual(true);
        expect(Boolean(spanModel.getMergedCell(2, 1))).toEqual(true);
        expect(Boolean(spanModel.getMergedCell(3, 1))).toEqual(false);
    });

    it('test all range', () => {
        const ranges: IRange[] = [
            { startRow: 1, endRow: 2, startColumn: 1, endColumn: 2, rangeType: RANGE_TYPE.ALL },
        ];
        const spanModel = new SpanModel(ranges);
        expect(Boolean(spanModel.getMergedCell(1, 1))).toEqual(true);
        expect(Boolean(spanModel.getMergedCell(2, 1))).toEqual(true);
        expect(Boolean(spanModel.getMergedCell(3, 1))).toEqual(true);
    });

    it('test isRowContainsMergedCell', () => {
        const spanModelAll = new SpanModel([{ startRow: 1, endRow: 2, startColumn: 1, endColumn: 2, rangeType: RANGE_TYPE.ALL }]);
        expect(Boolean(spanModelAll.isRowContainsMergedCell(1))).toEqual(true);
        expect(Boolean(spanModelAll.isRowContainsMergedCell(2))).toEqual(true);
        expect(Boolean(spanModelAll.isRowContainsMergedCell(3))).toEqual(true);

        const spanModelRow = new SpanModel([{ startRow: 1, endRow: 1, startColumn: 1, endColumn: 2, rangeType: RANGE_TYPE.COLUMN }]);
        expect(Boolean(spanModelRow.isRowContainsMergedCell(1))).toEqual(true);

        const spanModelCell = new SpanModel([{ startRow: 1, endRow: 2, startColumn: 1, endColumn: 2, rangeType: RANGE_TYPE.NORMAL }]);
        expect(Boolean(spanModelCell.isRowContainsMergedCell(1))).toEqual(true);
        expect(Boolean(spanModelCell.isRowContainsMergedCell(2))).toEqual(true);
        expect(Boolean(spanModelCell.isRowContainsMergedCell(3))).toEqual(false);
    });

    it('test isColumnContainsMergedCell', () => {
        const spanModelAll = new SpanModel([{ startRow: 1, endRow: 2, startColumn: 1, endColumn: 2, rangeType: RANGE_TYPE.ALL }]);
        expect(Boolean(spanModelAll.isColumnContainsMergedCell(1))).toEqual(true);
        expect(Boolean(spanModelAll.isColumnContainsMergedCell(2))).toEqual(true);
        expect(Boolean(spanModelAll.isColumnContainsMergedCell(3))).toEqual(true);

        const spanModelRow = new SpanModel([{ startRow: 1, endRow: 2, startColumn: 1, endColumn: 1, rangeType: RANGE_TYPE.ROW }]);
        expect(Boolean(spanModelRow.isColumnContainsMergedCell(1))).toEqual(true);

        const spanModelCell = new SpanModel([{ startRow: 1, endRow: 2, startColumn: 1, endColumn: 2, rangeType: RANGE_TYPE.NORMAL }]);
        expect(Boolean(spanModelCell.isColumnContainsMergedCell(1))).toEqual(true);
    });

    // Equivalence test: the row-bucket index must produce the same result
    // as a brute-force `Rectangle.intersects` scan across mixed range
    // types (NORMAL, ROW, COLUMN, ALL), across many overlapping queries.
    // Spans 4096 rows so multiple buckets (size 64) are exercised, and a
    // few merges deliberately straddle bucket boundaries.
    it('getMergedCellRange matches brute-force scan across mixed range types and bucket boundaries', () => {
        const ranges: IRange[] = [];
        // Deterministic pseudo-randomness so the test is reproducible.
        let seed = 1234567;
        const rand = (max: number) => {
            seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF;
            return seed % max;
        };
        for (let i = 0; i < 80; i++) {
            const startRow = rand(3900);
            const endRow = startRow + rand(150); // some straddle bucket boundaries
            const startColumn = rand(30);
            const endColumn = startColumn + rand(8);
            ranges.push({ startRow, endRow, startColumn, endColumn, rangeType: RANGE_TYPE.NORMAL });
        }
        // Sprinkle in special-type ranges.
        ranges.push({ startRow: 100, endRow: 100, startColumn: 0, endColumn: 999, rangeType: RANGE_TYPE.ROW });
        ranges.push({ startRow: 0, endRow: 9999, startColumn: 17, endColumn: 17, rangeType: RANGE_TYPE.COLUMN });
        ranges.push({ startRow: 2500, endRow: 2502, startColumn: 0, endColumn: 999, rangeType: RANGE_TYPE.ROW });

        const spanModel = new SpanModel(ranges);

        // Sample queries: cover several scroll-like viewport spans.
        const queries: Array<[number, number, number, number]> = [
            [0, 0, 50, 40],
            [50, 0, 110, 40],
            [200, 0, 320, 40],
            [60, 5, 130, 20], // crosses one bucket boundary (64)
            [1000, 0, 1100, 40],
            [3800, 0, 3950, 40],
            [2480, 0, 2520, 40],
        ];
        for (const [sr, sc, er, ec] of queries) {
            const expected = getMergeRange(ranges, sr, sc, er, ec);
            const actual = spanModel.getMergedCellRange(sr, sc, er, ec);
            expect(actual).toEqual(expected);
        }
    });

    // Cache-key contract: the LRU cache stored on the first query must
    // produce a result deeply equal to the live computation on the
    // second query. Guards against drift between the indexed path and
    // the cached-replay path (`_getRangeFromCache`).
    it('getMergedCellRange returns identical shapes for cached and uncached hits', () => {
        const ranges: IRange[] = [
            { startRow: 0, endRow: 3, startColumn: 0, endColumn: 2, rangeType: RANGE_TYPE.NORMAL },
            { startRow: 70, endRow: 75, startColumn: 4, endColumn: 6, rangeType: RANGE_TYPE.NORMAL },
            { startRow: 200, endRow: 220, startColumn: 1, endColumn: 5, rangeType: RANGE_TYPE.NORMAL },
            { startRow: 5, endRow: 5, startColumn: 0, endColumn: 999, rangeType: RANGE_TYPE.ROW },
        ];
        const spanModel = new SpanModel(ranges);
        const first = spanModel.getMergedCellRange(0, 0, 80, 10);
        const second = spanModel.getMergedCellRange(0, 0, 80, 10);
        expect(second).toEqual(first);
    });
});
