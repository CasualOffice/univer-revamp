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

import type { IRange } from './typedef';
import { LRUMap, Rectangle, Tools } from '../shared';
import { Disposable } from '../shared/lifecycle';
import { RANGE_TYPE } from './typedef';

// Row-bucket size for the merge-range index. Each NORMAL-type merge is
// recorded under every bucket its row span touches; a query for visible
// rows [startRow..endRow] walks only the buckets in that range and the
// always-check list (special-type merges), avoiding a full O(N) scan
// of _mergeData on every viewport update.
//
// 64 picked empirically: small enough that scroll deltas rarely span
// > 1-2 buckets (typical viewport height is 25-40 rows), large enough
// that init bucket-count stays bounded for sheets with very tall merges.
const MERGE_INDEX_BUCKET_ROWS = 64;

export class SpanModel extends Disposable {
    /**
     * @property Cache for RANGE_TYPE.NORMAL
     */
    private _cellCache: Map<number, Map<number, number>> = new Map();
    /**
     * @property Cache for RANGE_TYPE.ROW
     */
    private _rowCache: Map<number, number> = new Map();
    /**
     * @property Cache for RANGE_TYPE.COLUMN
     */
    private _columnCache: Map<number, number> = new Map();
    /**
     * @property Whether has RANGE_TYPE.ROW
     */
    private _hasRow: boolean = false;
    /**
     * @property Whether has RANGE_TYPE.COLUMN
     */
    private _hasColumn: boolean = false;
    /**
     * @property Whether has RANGE_TYPE.ALL
     */
    private _hasAll: boolean = false;
    /**
     * @property Index for RANGE_TYPE.ALL
     */
    private _allIndex: number = -1;

    /**
     * @property the original merge data
     */
    private _mergeData: IRange[];

    /**
     * Row-indexed bucket of merge indices for NORMAL-type merges only.
     * Built once at init; queried by `getMergedCellRange` to skip merges
     * outside the requested row span.
     */
    private _mergeRowBuckets: Map<number, number[]> = new Map();
    /**
     * Indices that need to be checked regardless of query row range
     * (ROW / COLUMN / ALL types). Walked on every query but typically
     * small.
     */
    private _alwaysCheckIndices: number[] = [];

    private _rangeMap: LRUMap<string, number[]> = new LRUMap<string, number[]>(50000);

    constructor(mergeData: IRange[]) {
        super();
        this._init(mergeData.concat());
    }

    private _init(mergeData: IRange[]) {
        this._mergeData = mergeData;
        this._createCache(mergeData);
    }

    private _clearCache() {
        this._cellCache.clear();
        this._rowCache.clear();
        this._columnCache.clear();
        this._hasAll = false;
        this._allIndex = -1;
        this._rangeMap.clear();
        this._hasColumn = false;
        this._hasRow = false;
        this._mergeRowBuckets.clear();
        this._alwaysCheckIndices.length = 0;
    }

    private _createCache(mergeData: IRange[]) {
        let index = 0;
        for (const range of mergeData) {
            const { rangeType } = range;
            if (rangeType === RANGE_TYPE.ROW) {
                this._createRowCache(range, index);
                this._alwaysCheckIndices.push(index);
            } else if (rangeType === RANGE_TYPE.COLUMN) {
                this._createColumnCache(range, index);
                this._alwaysCheckIndices.push(index);
            } else if (rangeType === RANGE_TYPE.ALL) {
                this._createCellAllCache(index);
                this._alwaysCheckIndices.push(index);
            } else {
                this._createCellCache(range, index);
                this._addToRowBuckets(range, index);
            }
            index++;
        }
    }

    private _addToRowBuckets(range: IRange, index: number) {
        const firstBucket = Math.floor(range.startRow / MERGE_INDEX_BUCKET_ROWS);
        const lastBucket = Math.floor(range.endRow / MERGE_INDEX_BUCKET_ROWS);
        for (let b = firstBucket; b <= lastBucket; b++) {
            let bucket = this._mergeRowBuckets.get(b);
            if (!bucket) {
                bucket = [];
                this._mergeRowBuckets.set(b, bucket);
            }
            bucket.push(index);
        }
    }

    /**
     * Rebuild the merge data cache when the merge data is changed.
     * @param {IRange[]} mergeData
     */
    rebuild(mergeData: IRange[]) {
        this._clearCache();
        this._init(mergeData.concat());
    }

    private _createRowCache(range: IRange, index: number) {
        const { startRow, endRow } = range;
        for (let i = startRow; i <= endRow; i++) {
            this._rowCache.set(i, index);
            this._hasRow = true;
        }
    }

    private _createColumnCache(range: IRange, index: number) {
        const { startColumn, endColumn } = range;
        for (let i = startColumn; i <= endColumn; i++) {
            this._columnCache.set(i, index);
            this._hasColumn = true;
        }
    }

    private _createCellAllCache(index: number) {
        this._hasAll = true;
        this._allIndex = index;
    }

    private _createCellCache(range: IRange, index: number) {
        for (let i = range.startRow; i <= range.endRow; i++) {
            let columnCache = this._cellCache.get(i);
            if (columnCache == null) {
                columnCache = new Map();
                this._cellCache.set(i, columnCache);
            }
            for (let j = range.startColumn; j <= range.endColumn; j++) {
                columnCache.set(j, index);
            }
        }
    }

    public add(range: IRange) {
        this._mergeData.push(range);
        this._clearCache();
        this._createCache(this._mergeData);
    }

    public remove(row: number, column: number) {
        const index = this._getMergeDataIndex(row, column);
        if (index !== -1) {
            this._mergeData.splice(index, 1);
            this._clearCache();
            this._createCache(this._mergeData);
        }
    }

    public getMergedCell(row: number, column: number) {
        const index = this._getMergeDataIndex(row, column);
        if (index !== -1) {
            return this._mergeData[index];
        }
        return null;
    }

    /**
     * Return index of merge data if (row,col) is in merge range. -1 means not in merge range.
     * @param row
     * @param column
     * @returns {number} index of merge range.
     */
    public getMergeDataIndex(row: number, column: number) {
        return this._getMergeDataIndex(row, column);
    }

    public isRowContainsMergedCell(row: number) {
        if (this._hasAll) {
            return true;
        }
        if (!Tools.isEmptyObject(this._columnCache)) {
            return true;
        }
        return this._mergeData.some((mergedCell) => mergedCell.startRow <= row && row <= mergedCell.endRow);
    }

    public isColumnContainsMergedCell(column: number) {
        if (this._hasAll) {
            return true;
        }
        if (!Tools.isEmptyObject(this._rowCache)) {
            return true;
        }
        return this._mergeData.some((mergedCell) => mergedCell.startColumn <= column && column <= mergedCell.endColumn);
    }

    public getMergedCellRange(startRow: number, startColumn: number, endRow: number, endColumn: number) {
        const key = `${startRow}-${startColumn}-${endRow}-${endColumn}`;
        if (this._rangeMap.has(key)) {
            return this._getRangeFromCache(key);
        }

        const target = { startRow, endRow, startColumn, endColumn };
        const ranges: IRange[] = [];
        const indexes: number[] = [];
        const mergeData = this._mergeData;
        if (!mergeData || mergeData.length === 0) {
            this._rangeMap.set(key, indexes);
            return ranges;
        }

        // K-way merge across the always-check list and the row buckets
        // touching [startRow..endRow]. Each source is index-ascending by
        // construction (`_createCache` pushes in `index++` order), so a
        // single `lastSeen` cursor dedupes correctly without a Set.
        // Output is index-ascending — matching the original linear scan
        // so downstream order assumptions and the `_rangeMap` LRU cache
        // store the same shape as before this change.
        const firstBucket = Math.floor(startRow / MERGE_INDEX_BUCKET_ROWS);
        const lastBucket = Math.floor(endRow / MERGE_INDEX_BUCKET_ROWS);
        const sourceCount = lastBucket - firstBucket + 2; // +1 for always-check
        const sources: Array<number[] | undefined> = new Array(sourceCount);
        const cursors: number[] = new Array(sourceCount).fill(0);
        sources[0] = this._alwaysCheckIndices;
        for (let b = firstBucket; b <= lastBucket; b++) {
            sources[b - firstBucket + 1] = this._mergeRowBuckets.get(b);
        }

        let lastSeen = -1;
        while (true) {
            let minIdx = Infinity;
            let minSource = -1;
            for (let si = 0; si < sources.length; si++) {
                const list = sources[si];
                if (!list) continue;
                while (cursors[si] < list.length && list[cursors[si]] <= lastSeen) {
                    cursors[si]++;
                }
                if (cursors[si] < list.length && list[cursors[si]] < minIdx) {
                    minIdx = list[cursors[si]];
                    minSource = si;
                }
            }
            if (minSource === -1) break;
            cursors[minSource]++;
            lastSeen = minIdx;
            const range = mergeData[minIdx];
            if (Rectangle.intersects(range, target)) {
                ranges.push({ ...range });
                indexes.push(minIdx);
            }
        }

        this._rangeMap.set(key, indexes);
        return ranges;
    }

    private _getRangeFromCache(key: string) {
        const indexes = this._rangeMap.get(key) || [];
        const ranges: IRange[] = [];
        for (const index of indexes) {
            ranges.push({
                ...this._mergeData[index],
            });
        }
        return ranges;
    }

    private _getMergeDataIndex(row: number, column: number) {
        if (this._hasAll) {
            return this._allIndex;
        }

        if (this._hasRow) {
            const rowValue = this._rowCache.get(row);
            if (rowValue !== undefined) {
                return rowValue;
            }
        }

        if (this._hasColumn) {
            const columnValue = this._columnCache.get(column);
            if (columnValue !== undefined) {
                return columnValue;
            }
        }

        const cellValue = this._cellCache.get(row)?.get(column);
        if (cellValue !== undefined) {
            return cellValue;
        }
        return -1;
    }

    public getMergeDataSnapshot() {
        return this._mergeData;
    }

    override dispose() {
        this._clearCache();
        this._mergeData = [];
    }
}
