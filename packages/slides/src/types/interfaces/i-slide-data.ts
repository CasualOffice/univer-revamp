/**
 * Copyright 2026-present CasualOffice.
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

import type {
    IColorStyle,
    ICustomBlock,
    IDocumentData,
    IImageProperties,
    ILists,
    IPlaceholder,
    IShapeProperties,
    ISize,
    IStyleBase,
    IStyleData,
    ITransformState,
    IWorksheetData,
    LocaleType,
    Nullable,
    ThemeColorType,
} from '@univerjs/core';
import type { ShapeType } from '../enum/prst-geom-type';

export interface ISlideData extends IReferenceSource {
    id: string; // unit id
    /**
     * Canonical-snapshot schema version. Absent / 0 means a pre-versioned
     * snapshot; `migrateSlideSnapshot` upgrades it to the current version.
     */
    schemaVersion?: number;
    /**
     * Revision of this slide deck. Used in collaborative editing. Starts from one.
     * @ignore
     */
    rev?: number;
    locale?: LocaleType;
    title: string;
    pageSize: ISize;
    body?: ISlidePageBody;
    /** Deck-level theme (color scheme, …) for resolving theme-color references. */
    theme?: ISlideTheme;
}

/** A deck theme. Currently the color scheme; font scheme etc. can follow. */
export interface ISlideTheme {
    colorScheme?: IColorScheme;
}

/**
 * Maps each theme color slot (ThemeColorType) to a concrete color string. An
 * element's `IColorStyle.th` is resolved against this — see resolveThemeColor.
 */
export type IColorScheme = Partial<Record<ThemeColorType, string>>;

interface IReferenceSource {
    master?: { [id: string]: ISlidePage };
    handoutMaster?: { [id: string]: ISlidePage };
    notesMaster?: { [id: string]: ISlidePage };
    layouts?: { [id: string]: ISlidePage };
    lists?: ILists;
}

interface ISlidePageBody {
    pages: { [id: string]: ISlidePage };
    pageOrder: string[];
}

export interface ISlidePage {
    id: string;
    pageType: PageType;
    zIndex: number;
    title: string;
    description: string;
    pageBackgroundFill: IColorStyle;
    colorScheme?: ThemeColorType;
    pageElements: { [elementId: string]: IPageElement };
    // Union field properties. Properties that are specific for each page type. Masters do not require any additional properties. properties can be only one of the following:
    slideProperties?: ISlideProperties;
    layoutProperties?: ILayoutProperties;
    notesProperties?: INotesProperties;
    handoutProperties?: IHandoutProperties;
    masterProperties?: IMasterProperties;
}

interface ISlideProperties {
    layoutObjectId: string;
    masterObjectId: string;
    isSkipped: boolean;
}

interface ILayoutProperties {
    masterObjectId: string;
    name: string;
}

interface INotesProperties {
    name: string;
}

interface IHandoutProperties {
    name: string;
}

interface IMasterProperties {
    name: string;
}

export interface ISlideRichTextProps extends ITransformState, IStyleBase {
    text?: string;
    rich?: IDocumentData;
}

export interface IPageElement {
    id: string;
    zIndex: number;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    angle?: number;
    scaleX?: number;
    scaleY?: number;
    skewX?: number;
    skewY?: number;
    flipX?: boolean;
    flipY?: boolean;

    title: string;
    description: string;

    type: PageElementType;

    // Union field element_kind can be only one of the following:
    // elementGroup: IGroup;
    shape?: IShape;
    image?: IImage;
    richText?: ISlideRichTextProps;

    /** @deprecated */
    spreadsheet?: {
        worksheet: IWorksheetData;
        styles: Record<string, Nullable<IStyleData>>;
    };
    /** @deprecated */
    document?: IDocumentData;
    /** @deprecated */
    slide?: ISlideData;
    line?: ILineElement;
    chart?: IChartElement;
    video?: IVideoElement;
    // table: ITable; // tracked separately (#17)
    customBlock?: ICustomBlock; // customBlock block customized by user through plugin
}

/**
 * Line / connector element (OOXML `p:cxnSp` / `cxnSpPr` + `prstGeom`).
 * Endpoints are in the same coordinate space as the element transform; styling
 * reuses IShapeProperties (outline weight/dash/color).
 */
export interface ILineElement {
    /** prstGeom connector name, e.g. 'line', 'straightConnector1', 'bentConnector3'. */
    lineType?: string;
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    lineProperties?: IShapeProperties;
    placeholder?: IPlaceholder;
    link?: ILink;
}

/**
 * Chart element. The engine models it for preservation + future native render;
 * `embeddedPart` carries the opaque OOXML `c:chart` XML so importers can
 * round-trip charts losslessly before native rendering exists (#25).
 */
export interface IChartElement {
    /** e.g. 'bar', 'line', 'pie', 'scatter' — best-effort from the source. */
    chartType?: string;
    /** Optional structured chart spec for native render/edit (when available). */
    spec?: Record<string, unknown>;
    /** Opaque source part (OOXML chart XML) preserved for lossless export. */
    embeddedPart?: string;
    /** Cached raster preview (data URL) until native chart render lands. */
    previewUrl?: string;
    placeholder?: IPlaceholder;
    link?: ILink;
}

/**
 * Embedded media (video/audio). `posterUrl` is the placeholder frame shown
 * before playback; playback UI is product-owned.
 */
export interface IVideoElement {
    sourceUrl?: string;
    posterUrl?: string;
    mimeType?: string;
    placeholder?: IPlaceholder;
    link?: ILink;
}

export enum PageType {
    SLIDE, // A slide page.
    MASTER, // A master slide page.
    LAYOUT, // A layout page.
    HANDOUT_MASTER, // A handout master page.
    NOTES_MASTER, // A notes master page.
}

export enum PageElementType {
    SHAPE,
    IMAGE,
    TEXT,
    SPREADSHEET,
    DOCUMENT,
    SLIDE,
    // Appended (Gap 3) — numeric values of the above are preserved.
    LINE,
    CHART,
    VIDEO,
}

/**
 * IShape
 */
export interface IShape {
    shapeType: ShapeType;
    text: string;
    shapeProperties: IShapeProperties;
    placeholder?: IPlaceholder;
    link?: ILink;
}

export interface IImage {
    imageProperties?: IImageProperties;
    placeholder?: IPlaceholder;
    link?: ILink;
}

interface ILink {
    relativeLink: RelativeSlideLink;
    pageId?: string;
    slideIndex?: number;
}

export enum RelativeSlideLink {
    RELATIVE_SLIDE_LINK_UNSPECIFIED, // An unspecified relative slide link.
    NEXT_SLIDE, // A link to the next slide.
    PREVIOUS_SLIDE, // A link to the previous slide.
    FIRST_SLIDE, // A link to the first slide in the presentation.
    LAST_SLIDE, // A link to the last slide in the presentation.
}
