import {
  DocSelectionRenderService,
  InsertTextCommand,
  RichTextEditingMutation
} from "./chunk-DXOT3Z2O.js";
import {
  FBaseInitialable,
  FUniver
} from "./chunk-JRQIBFK2.js";
import {
  ICommandService,
  IRenderManagerService,
  IResourceLoaderService,
  IUniverInstanceService,
  Inject,
  Injector,
  JSONX,
  RedoCommand,
  TextX,
  UndoCommand,
  createParagraphId,
  getRichTextEditPath
} from "./chunk-M6CFAGRR.js";
import {
  __decorateClass,
  __decorateParam,
  __publicField
} from "./chunk-HECJ2TYE.js";

// ../packages/docs/src/facade/doc-element-registry.ts
var PARAGRAPH_REGISTRY_MIGRATION_ERROR = "DocElementRegistry no longer tracks paragraph identity; use paragraphId.";
var DocElementStaleError = class extends Error {
  /**
   * Create a stale element error.
   * @param {string} message The error message.
   */
  constructor(message = "Doc element is stale") {
    super(message);
    this.name = "DocElementStaleError";
  }
};
var DocElementRegistry = class {
  /**
   * @deprecated Paragraph facade identity is now the persisted `paragraphId`.
   * @throws {Error} Always throws; use `paragraph.paragraphId` instead.
   */
  getParagraphKey(_segmentId, _body, _paragraphIndex) {
    throw new Error(PARAGRAPH_REGISTRY_MIGRATION_ERROR);
  }
  /**
   * @deprecated Paragraph facade identity is now the persisted `paragraphId`.
   * @throws {Error} Always throws; resolve paragraph handles by `paragraphId` instead.
   */
  resolveParagraphStartIndex(_segmentId, _key) {
    throw new Error(PARAGRAPH_REGISTRY_MIGRATION_ERROR);
  }
  /**
   * @deprecated Paragraph facade identity is now the persisted `paragraphId`.
   * @throws {Error} Always throws; resolve paragraph handles by `paragraphId` instead.
   */
  syncParagraph(_segmentId, _key, _body) {
    throw new Error(PARAGRAPH_REGISTRY_MIGRATION_ERROR);
  }
  /**
   * @deprecated Paragraph facade identity is now the persisted `paragraphId`.
   * @throws {Error} Always throws; stale state is detected from live `paragraphId` lookups.
   */
  markStale(_segmentId, _key) {
    throw new Error(PARAGRAPH_REGISTRY_MIGRATION_ERROR);
  }
  /**
   * @deprecated Paragraph facade identity is now the persisted `paragraphId`.
   * @throws {Error} Always throws; text edits no longer need registry offset tracking.
   */
  beforeTextEdit(_segmentId, _startOffset, _endOffset, _insertLength) {
    throw new Error(PARAGRAPH_REGISTRY_MIGRATION_ERROR);
  }
};

// ../packages/docs/src/facade/utils.ts
function cloneParagraphStyle(paragraphStyle) {
  return paragraphStyle == null ? paragraphStyle : JSON.parse(JSON.stringify(paragraphStyle));
}
function normalizePlainTextDataStream(dataStream) {
  return dataStream.replace(/\r\n/g, "\r").replace(/\n/g, "\r");
}
function getRemovedLeadingParagraphBreakLength(dataStream, removeLeadingParagraphBreak) {
  const normalized = normalizePlainTextDataStream(dataStream);
  if (removeLeadingParagraphBreak && normalized.length > 1 && normalized.startsWith("\r")) {
    return 1;
  }
  return 0;
}
function getNormalizedPlainTextCursorOffset(dataStream, cursorOffset, removeLeadingParagraphBreak) {
  const normalizedPrefixLength = normalizePlainTextDataStream(dataStream.slice(0, cursorOffset)).length;
  return Math.max(
    0,
    normalizedPrefixLength - getRemovedLeadingParagraphBreakLength(dataStream, removeLeadingParagraphBreak)
  );
}
function getParagraphStyleAtOffset(body, offset) {
  var _a, _b;
  const paragraphs = (_a = body.paragraphs) != null ? _a : [];
  const paragraph = (_b = paragraphs.find((item) => item.startIndex >= offset)) != null ? _b : paragraphs[paragraphs.length - 1];
  return paragraph == null ? void 0 : paragraph.paragraphStyle;
}
function buildPlainTextInsertBody(dataStream, options = {}) {
  const normalizedDataStream = normalizePlainTextDataStream(dataStream).slice(
    getRemovedLeadingParagraphBreakLength(dataStream, options.removeLeadingParagraphBreak)
  );
  const body = {
    dataStream: normalizedDataStream,
    customDecorations: [],
    customRanges: [],
    textRuns: []
  };
  const paragraphs = [];
  const existingParagraphIds = /* @__PURE__ */ new Set();
  for (let index = 0; index < normalizedDataStream.length; index++) {
    if (normalizedDataStream[index] === "\r") {
      paragraphs.push({
        startIndex: index,
        paragraphId: createParagraphId(existingParagraphIds),
        ...options.paragraphStyle == null ? {} : { paragraphStyle: cloneParagraphStyle(options.paragraphStyle) }
      });
    }
  }
  if (paragraphs.length > 0) {
    body.paragraphs = paragraphs;
  }
  return body;
}

// ../packages/docs/src/facade/f-doc-block-range.ts
var FDocBlockRange = class {
  constructor(_body, _key) {
    __publicField(this, "_body", _body);
    __publicField(this, "_key", _key);
  }
  /**
   * Get the document element type.
   * @returns {'blockRange'} The literal block range element type.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const blockRange = doc.getBody().getChild(0).asBlockRange();
   * console.log(blockRange.getType());
   * ```
   */
  getType() {
    return "blockRange";
  }
  /**
   * Get the block range key.
   * @returns {string} The persisted `blockId` for this block range.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const blockRange = doc.getBody().getChild(0).asBlockRange();
   * console.log(blockRange.getKey());
   * ```
   */
  getKey() {
    return this._key;
  }
  /**
   * Get the parent body facade that owns this block range.
   * @returns {FDocBody} The document body facade.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const blockRange = doc.getBody().getChild(0).asBlockRange();
   * console.log(blockRange.getParent().getChildIndex(blockRange));
   * ```
   */
  getParent() {
    return this._body;
  }
  /**
   * Remove this block range and its content from the parent body.
   * @returns {boolean} `true` if the block range content was removed.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const blockRange = doc.getBody().getChild(0).asBlockRange();
   * blockRange.removeFromParent();
   * ```
   */
  removeFromParent() {
    return this._body.removeBlockRange(this._key);
  }
  /**
   * Get the block range type.
   * @returns {DocumentBlockRangeType} The block type, such as callout, quote, or code.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const blockRange = doc.getBody().getChild(0).asBlockRange();
   * console.log(blockRange.getBlockType());
   * ```
   */
  getBlockType() {
    return this._body.getBlockRange(this._key).blockType;
  }
  /**
   * Get the plain text inside this block range.
   * @returns {string} The block range text.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const blockRange = doc.getBody().getChild(0).asBlockRange();
   * console.log(blockRange.getText());
   * ```
   */
  getText() {
    return this._body.getBlockRangeText(this._key);
  }
  /**
   * Replace the plain text inside this block range.
   * @param {string} text The replacement text.
   * @returns {boolean} `true` if the block range text was replaced.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const blockRange = doc.getBody().getChild(0).asBlockRange();
   * blockRange.setText('Updated block text');
   * ```
   */
  setText(text) {
    return this._body.setBlockRangeText(this._key, text);
  }
  /**
   * Remove this block range wrapper from the body.
   *
   * This currently removes the block range and its content, matching
   * `removeFromParent()`.
   *
   * @returns {boolean} `true` if the block range content was removed.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const blockRange = doc.getBody().getChild(0).asBlockRange();
   * blockRange.unwrap();
   * ```
   */
  unwrap() {
    return this.removeFromParent();
  }
};

// ../packages/docs/src/facade/f-doc-custom-block.ts
var FDocCustomBlock = class {
  constructor(_body, _key) {
    __publicField(this, "_body", _body);
    __publicField(this, "_key", _key);
  }
  /**
   * Get the document element type.
   * @returns {'customBlock'} The literal custom block element type.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const customBlock = doc.getBody().getChild(0).asCustomBlock();
   * console.log(customBlock.getType());
   * ```
   */
  getType() {
    return "customBlock";
  }
  /**
   * Get the custom block key.
   * @returns {string} The persisted `blockId` for this custom block.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const customBlock = doc.getBody().getChild(0).asCustomBlock();
   * console.log(customBlock.getKey());
   * ```
   */
  getKey() {
    return this._key;
  }
  /**
   * Get the parent body facade that owns this custom block.
   * @returns {FDocBody} The document body facade.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const customBlock = doc.getBody().getChild(0).asCustomBlock();
   * console.log(customBlock.getParent().getChildIndex(customBlock));
   * ```
   */
  getParent() {
    return this._body;
  }
  /**
   * Remove this custom block from the parent body.
   * @returns {boolean} `true` if the custom block placeholder was removed.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const customBlock = doc.getBody().getChild(0).asCustomBlock();
   * customBlock.removeFromParent();
   * ```
   */
  removeFromParent() {
    return this._body.removeCustomBlock(this._key);
  }
  /**
   * Get the persisted custom block id.
   * @returns {string} The `ICustomBlock.blockId` value.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const customBlock = doc.getBody().getChild(0).asCustomBlock();
   * console.log(customBlock.getBlockId());
   * ```
   */
  getBlockId() {
    return this._body.getCustomBlock(this._key).blockId;
  }
};

// ../packages/docs/src/facade/f-doc-paragraph.ts
var FDocParagraph = class {
  constructor(_body, _key) {
    __publicField(this, "_body", _body);
    __publicField(this, "_key", _key);
  }
  /**
   * Get the document element type.
   * @returns {'paragraph'} The literal paragraph element type.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * console.log(paragraph.getType());
   * ```
   */
  getType() {
    return "paragraph";
  }
  /**
   * Get the persisted paragraph id.
   * @returns {string} The paragraph id.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * console.log(paragraph.getKey());
   * ```
   */
  getKey() {
    return this._key;
  }
  /**
   * Get the persisted paragraph id.
   * @returns {string} The paragraph id.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * console.log(paragraph.getId());
   * ```
   */
  getId() {
    return this._key;
  }
  /**
   * Get the parent body facade that owns this paragraph.
   * @returns {FDocBody} The document body facade.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * console.log(paragraph.getParent().getChildIndex(paragraph));
   * ```
   */
  getParent() {
    return this._body;
  }
  /**
   * Remove this paragraph from its parent body.
   * @returns {boolean} `true` if the paragraph was removed.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * paragraph.removeFromParent();
   * ```
   */
  removeFromParent() {
    return this._body.removeParagraph(this._key);
  }
  /**
   * Get this paragraph's plain text.
   * @returns {string} The paragraph text without the trailing paragraph break.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * console.log(paragraph.getText());
   * ```
   */
  getText() {
    return this._body.getParagraphText(this._key);
  }
  /**
   * Replace this paragraph's plain text.
   * @param {string} text The replacement text. Do not include the paragraph break.
   * @returns {boolean} `true` if the paragraph text was replaced.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * paragraph.setText('Updated title');
   * ```
   */
  setText(text) {
    return this._body.setParagraphText(this._key, text);
  }
  /**
   * Append plain text before this paragraph's trailing paragraph break.
   * @param {string} text The plain text to append.
   * @returns {boolean} `true` if the text was appended.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * paragraph.appendText(' suffix');
   * ```
   */
  appendText(text) {
    return this._body.appendParagraphText(this._key, text);
  }
  /**
   * Get the current text range occupied by this paragraph.
   * @returns {IFDocTextRange} The paragraph text range, excluding the trailing paragraph break.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * const range = paragraph.getRange();
   * doc.getBody().setTextStyle(range, { bl: 1 });
   * ```
   */
  getRange() {
    return this._body.getParagraphRange(this._key);
  }
  /**
   * Check whether this paragraph is a bullet, ordered, or checklist item.
   * @returns {boolean} `true` if the paragraph has list metadata.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * console.log(paragraph.isListItem());
   * ```
   */
  isListItem() {
    return this._body.isListParagraph(this._key);
  }
  /**
   * Check whether this paragraph is a task/checklist item.
   * @returns {boolean} `true` if this paragraph is an unchecked or checked task item.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * if (paragraph.isTask()) {
   *     paragraph.setTaskChecked(true);
   * }
   * ```
   */
  isTask() {
    return this._body.isTaskParagraph(this._key);
  }
  /**
   * Set the checked state of this task/checklist paragraph.
   * @param {boolean} checked Whether the task item should be checked.
   * @returns {boolean} `true` if the task state was updated, or `false` if this paragraph is not a task item.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * if (paragraph.isTask()) {
   *     paragraph.setTaskChecked(false);
   * }
   * ```
   */
  setTaskChecked(checked) {
    return this._body.setTaskChecked(this._key, checked);
  }
};

// ../packages/docs/src/facade/f-doc-table.ts
var FDocTable = class {
  constructor(_body, _key) {
    __publicField(this, "_body", _body);
    __publicField(this, "_key", _key);
  }
  /**
   * Get the document element type.
   * @returns {'table'} The literal table element type.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const table = doc.getBody().getChild(0).asTable();
   * console.log(table.getType());
   * ```
   */
  getType() {
    return "table";
  }
  /**
   * Get the table key.
   * @returns {string} The persisted `tableId` for this table.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const table = doc.getBody().getChild(0).asTable();
   * console.log(table.getKey());
   * ```
   */
  getKey() {
    return this._key;
  }
  /**
   * Get the parent body facade that owns this table.
   * @returns {FDocBody} The document body facade.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const table = doc.getBody().getChild(0).asTable();
   * console.log(table.getParent().getChildIndex(table));
   * ```
   */
  getParent() {
    return this._body;
  }
  /**
   * Remove this table from the parent body.
   * @returns {boolean} `true` if the table range was removed.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const table = doc.getBody().getChild(0).asTable();
   * table.removeFromParent();
   * ```
   */
  removeFromParent() {
    return this._body.removeTable(this._key);
  }
  /**
   * Get the persisted table id.
   * @returns {string} The `ICustomTable.tableId` value.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const table = doc.getBody().getChild(0).asTable();
   * console.log(table.getTableId());
   * ```
   */
  getTableId() {
    return this._body.getTable(this._key).tableId;
  }
};

// ../packages/docs/src/facade/f-doc-element.ts
var FDocElement = class {
  constructor(_body, _type, _key) {
    __publicField(this, "_body", _body);
    __publicField(this, "_type", _type);
    __publicField(this, "_key", _key);
  }
  /**
   * Get the document element type.
   * @returns {FDocElementType} The element type, such as `paragraph`, `table`, `blockRange`, or `customBlock`.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const element = doc.getBody().getChild(0);
   * console.log(element.getType());
   * ```
   */
  getType() {
    return this._type;
  }
  /**
   * Get the facade key used to resolve this element.
   * @returns {string} The paragraph `paragraphId` or persisted table/block/custom block id.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const body = doc.getBody();
   * const element = body.getChild(0);
   * console.log(element.getKey());
   * ```
   */
  getKey() {
    return this._key;
  }
  /**
   * Get the parent body facade that owns this element.
   * @returns {FDocBody} The document body facade.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const element = doc.getBody().getChild(0);
   * console.log(element.getParent().getNumChildren());
   * ```
   */
  getParent() {
    return this._body;
  }
  /**
   * Get the next sibling element in the current body order.
   * @returns {FDocElement | null} The next sibling wrapper, or `null` when this is the last child.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const first = doc.getBody().getChild(0);
   * const next = first.getNextSibling();
   * console.log(next?.getType());
   * ```
   */
  getNextSibling() {
    return this._body.createSibling(this._type, this._key, 1);
  }
  /**
   * Get the previous sibling element in the current body order.
   * @returns {FDocElement | null} The previous sibling wrapper, or `null` when this is the first child.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const second = doc.getBody().getChild(1);
   * const previous = second.getPreviousSibling();
   * console.log(previous?.getType());
   * ```
   */
  getPreviousSibling() {
    return this._body.createSibling(this._type, this._key, -1);
  }
  /**
   * Remove this element from its parent body.
   * @returns {boolean} `true` if the element content was removed.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const body = doc.getBody();
   * const element = body.getChild(0);
   * element.removeFromParent();
   * ```
   */
  removeFromParent() {
    if (this._type === "paragraph") {
      return this._body.removeParagraph(this._key);
    }
    if (this._type === "blockRange") {
      return this._body.removeBlockRange(this._key);
    }
    if (this._type === "table") {
      return this._body.removeTable(this._key);
    }
    return this._body.removeCustomBlock(this._key);
  }
  /**
   * Cast this generic element to a paragraph facade.
   * @returns {FDocParagraph} The paragraph facade wrapper.
   * @throws {TypeError} If the element is not a paragraph.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * console.log(paragraph.getText());
   * ```
   */
  asParagraph() {
    this._assertType("paragraph");
    return new FDocParagraph(this._body, this._key);
  }
  /**
   * Cast this generic element to a table facade.
   * @returns {FDocTable} The table facade wrapper.
   * @throws {TypeError} If the element is not a table.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const table = doc.getBody().getChild(0).asTable();
   * console.log(table.getTableId());
   * ```
   */
  asTable() {
    this._assertType("table");
    return new FDocTable(this._body, this._key);
  }
  /**
   * Cast this generic element to a callout, quote, or code block range facade.
   * @returns {FDocBlockRange} The block range facade wrapper.
   * @throws {TypeError} If the element is not a block range.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const blockRange = doc.getBody().getChild(0).asBlockRange();
   * console.log(blockRange.getBlockType());
   * ```
   */
  asBlockRange() {
    this._assertType("blockRange");
    return new FDocBlockRange(this._body, this._key);
  }
  /**
   * Cast this generic element to a custom block facade.
   * @returns {FDocCustomBlock} The custom block facade wrapper.
   * @throws {TypeError} If the element is not a custom block.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const customBlock = doc.getBody().getChild(0).asCustomBlock();
   * console.log(customBlock.getBlockId());
   * ```
   */
  asCustomBlock() {
    this._assertType("customBlock");
    return new FDocCustomBlock(this._body, this._key);
  }
  _assertType(type) {
    if (this._type !== type) {
      throw new TypeError(`Cannot cast ${this._type} to ${type}.`);
    }
  }
};

// ../packages/docs/src/facade/f-doc-body.ts
function isRichTextLike(value) {
  return typeof value === "object" && value !== null && "getData" in value && typeof value.getData === "function";
}
var FACADE_TRIGGER = "doc-facade";
var RESTORE_INSERTED_PARAGRAPH_IDS = "__textXRestoreParagraphIds";
var FDocBody = class {
  constructor(_documentDataModel, _commandService, _registry, _segmentId = "") {
    __publicField(this, "_documentDataModel", _documentDataModel);
    __publicField(this, "_commandService", _commandService);
    __publicField(this, "_segmentId", _segmentId);
  }
  /**
   * Get the number of top-level child elements in the body.
   * @returns {number} The number of child elements.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const body = doc.getBody();
   * console.log(body.getNumChildren());
   * ```
   */
  getNumChildren() {
    return this._getChildren().length;
  }
  /**
   * Get a top-level child element by child index.
   * @param {number} index The zero-based child index.
   * @returns {FDocElement} The child element wrapper.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const body = doc.getBody();
   * const firstChild = body.getChild(0);
   * console.log(firstChild.getType());
   * ```
   */
  getChild(index) {
    const child = this._getChildren()[index];
    if (!child) {
      throw new RangeError(`Child index ${index} is out of range.`);
    }
    return this._createElement(child.type, child.key);
  }
  /**
   * Get the current child index of an element handle.
   * The index is resolved from the element key, so a paragraph handle keeps pointing
   * to the same paragraph after facade edits insert content before it.
   * @param {IFDocElementHandle} element The element handle to locate.
   * @returns {number} The current zero-based child index.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const body = doc.getBody();
   * const paragraph = body.getChild(1).asParagraph();
   * body.insertParagraph(0, 'Intro');
   * console.log(body.getChildIndex(paragraph));
   * ```
   */
  getChildIndex(element) {
    const resolved = this.resolveElement(element.getType(), element.getKey());
    const index = this._getChildren().findIndex((child) => child.type === resolved.type && child.key === resolved.key);
    if (index < 0) {
      throw new Error("Doc element is stale");
    }
    return index;
  }
  /**
   * Insert plain text at a document body offset.
   * @param {number} index The zero-based insertion offset.
   * @param {string} text The plain text to insert.
   * @returns {boolean} `true` if the edit was applied.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const body = doc.getBody();
   * body.insertText(0, 'Hello ');
   * ```
   */
  insertText(index, text) {
    return this._replaceBodyRange({ startOffset: index, endOffset: index }, buildPlainTextInsertBody(text));
  }
  /**
   * Insert a plain-text paragraph before the paragraph at the given paragraph index.
   * @param {number} index The zero-based paragraph insertion index.
   * @param {string} text The paragraph text. Defaults to an empty paragraph.
   * @returns {FDocParagraph} The inserted paragraph wrapper.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const body = doc.getBody();
   * const paragraph = body.insertParagraph(0, 'Document title');
   * paragraph.appendText(' suffix');
   * ```
   */
  insertParagraph(index, text = "") {
    var _a;
    const offset = this._getParagraphInsertOffset(index);
    const result = this._replaceBodyRange({ startOffset: offset, endOffset: offset }, buildPlainTextInsertBody(`${text}\r`));
    if (!result) {
      throw new Error("Failed to insert paragraph.");
    }
    const paragraphIndex = this._normalizeInsertedParagraphIndex(index);
    const paragraph = (_a = this._getBody().paragraphs) == null ? void 0 : _a[paragraphIndex];
    return new FDocParagraph(this, this._getParagraphId(paragraph, paragraphIndex));
  }
  /**
   * Append a plain-text paragraph at the end of the body.
   * @param {string} text The paragraph text. Defaults to an empty paragraph.
   * @returns {FDocParagraph} The appended paragraph wrapper.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const body = doc.getBody();
   * const paragraph = body.appendParagraph('Summary');
   * console.log(paragraph.getText());
   * ```
   */
  appendParagraph(text = "") {
    var _a, _b;
    return this.insertParagraph((_b = (_a = this._getBody().paragraphs) == null ? void 0 : _a.length) != null ? _b : 0, text);
  }
  /**
   * Delete a range from the body.
   * @param {IFDocTextRange} range The text range to delete.
   * @returns {boolean} `true` if the range was deleted.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const body = doc.getBody();
   * body.deleteRange({ startOffset: 0, endOffset: 5 });
   * ```
   */
  deleteRange(range) {
    return this._replaceBodyRange(range, { dataStream: "" });
  }
  /**
   * Replace a range with plain text or rich text body data.
   * @param {IFDocTextRange} range The text range to replace.
   * @param {string | IFDocRichTextLike | { body?: IDocumentBody }} value The replacement text or rich-text-like value.
   * @returns {boolean} `true` if the replacement was applied.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const body = doc.getBody();
   * body.replaceRange({ startOffset: 0, endOffset: 5 }, 'Hello');
   * ```
   */
  replaceRange(range, value) {
    var _a, _b;
    let body;
    if (typeof value === "string") {
      body = buildPlainTextInsertBody(value);
    } else if (isRichTextLike(value)) {
      body = (_a = value.getData().body) != null ? _a : { dataStream: "" };
    } else {
      body = (_b = value.body) != null ? _b : { dataStream: "" };
    }
    return this._replaceBodyRange(range, body);
  }
  /**
   * Apply text style to a body range.
   * @param {IFDocTextRange} range The range to style.
   * @param {ITextStyle} style The Univer text style patch.
   * @returns {boolean} `true` if the style was applied.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const body = doc.getBody();
   * body.setTextStyle({ startOffset: 0, endOffset: 5 }, { bl: 1 });
   * ```
   */
  setTextStyle(range, style) {
    const len = range.endOffset - range.startOffset;
    const updateBody = {
      dataStream: "",
      textRuns: [{
        st: 0,
        ed: len,
        ts: style
      }]
    };
    return this._retainBodyRange(range, updateBody, 0 /* COVER */);
  }
  /**
   * Apply paragraph style to a paragraph handle or text range.
   * @param {FDocElement | FDocParagraph | IFDocTextRange} paragraph The paragraph handle or a range inside the paragraph.
   * @param {IParagraphStyle} style The Univer paragraph style patch.
   * @returns {boolean} `true` if the style was applied.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const body = doc.getBody();
   * const paragraph = body.getChild(0).asParagraph();
   * body.setParagraphStyle(paragraph, { horizontalAlign: 2 });
   * ```
   */
  setParagraphStyle(paragraph, style) {
    const resolved = paragraph instanceof FDocElement || paragraph instanceof FDocParagraph ? this.resolveParagraph(paragraph.getKey()) : this._findParagraphByRange(paragraph);
    const updateBody = {
      dataStream: "",
      paragraphs: [{
        ...resolved.paragraph,
        startIndex: 0,
        paragraphStyle: {
          ...resolved.paragraph.paragraphStyle,
          ...style
        }
      }]
    };
    this._preserveExplicitParagraphIds(updateBody);
    return this._retainBodyRange(
      { startOffset: resolved.endOffset, endOffset: resolved.endOffset + 1 },
      updateBody,
      1 /* REPLACE */
    );
  }
  /**
   * Get the text content of a paragraph by paragraph id.
   * @param {string} key The paragraph id.
   * @returns {string} The paragraph text without the trailing paragraph break.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * console.log(doc.getBody().getParagraphText(paragraph.getKey()));
   * ```
   */
  getParagraphText(key) {
    const resolved = this.resolveParagraph(key);
    return this._getBody().dataStream.slice(resolved.startOffset, resolved.endOffset);
  }
  /**
   * Replace the text content of a paragraph by paragraph id.
   * @param {string} key The paragraph id.
   * @param {string} text The replacement paragraph text.
   * @returns {boolean} `true` if the paragraph text was replaced.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * doc.getBody().setParagraphText(paragraph.getKey(), 'Updated text');
   * ```
   */
  setParagraphText(key, text) {
    const resolved = this.resolveParagraph(key);
    return this.replaceRange({ startOffset: resolved.startOffset, endOffset: resolved.endOffset }, text);
  }
  /**
   * Append text to a paragraph by paragraph id.
   * @param {string} key The paragraph id.
   * @param {string} text The text to append before the paragraph break.
   * @returns {boolean} `true` if the text was appended.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * doc.getBody().appendParagraphText(paragraph.getKey(), ' suffix');
   * ```
   */
  appendParagraphText(key, text) {
    const resolved = this.resolveParagraph(key);
    return this.insertText(resolved.endOffset, text);
  }
  /**
   * Remove a paragraph by paragraph id.
   * @param {string} key The paragraph id.
   * @returns {boolean} `true` if the paragraph was removed.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * doc.getBody().removeParagraph(paragraph.getKey());
   * ```
   */
  removeParagraph(key) {
    const resolved = this.resolveParagraph(key);
    return this.deleteRange({ startOffset: resolved.startOffset, endOffset: resolved.endOffset + 1 });
  }
  /**
   * Get a paragraph text range by paragraph id.
   * @param {string} key The paragraph id.
   * @returns {IFDocTextRange} The paragraph range excluding the trailing paragraph break.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * const range = doc.getBody().getParagraphRange(paragraph.getKey());
   * console.log(range.startOffset, range.endOffset);
   * ```
   */
  getParagraphRange(key) {
    const resolved = this.resolveParagraph(key);
    return { startOffset: resolved.startOffset, endOffset: resolved.endOffset, segmentId: this._segmentId };
  }
  /**
   * Check whether a paragraph has list metadata.
   * @param {string} key The paragraph id.
   * @returns {boolean} `true` if the paragraph is a list item.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * console.log(doc.getBody().isListParagraph(paragraph.getKey()));
   * ```
   */
  isListParagraph(key) {
    return Boolean(this.resolveParagraph(key).paragraph.bullet);
  }
  /**
   * Check whether a paragraph is a task/checklist item.
   * @param {string} key The paragraph id.
   * @returns {boolean} `true` if the paragraph is an unchecked or checked task item.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * console.log(doc.getBody().isTaskParagraph(paragraph.getKey()));
   * ```
   */
  isTaskParagraph(key) {
    var _a;
    const listType = (_a = this.resolveParagraph(key).paragraph.bullet) == null ? void 0 : _a.listType;
    return listType === "CHECK_LIST" /* CHECK_LIST */ || listType === "CHECK_LIST_CHECKED" /* CHECK_LIST_CHECKED */;
  }
  /**
   * Set the checked state of a task/checklist paragraph.
   * @param {string} key The paragraph id.
   * @param {boolean} checked Whether the task should be checked.
   * @returns {boolean} `true` if the task state was updated, or `false` if the paragraph is not a task item.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * doc.getBody().setTaskChecked(paragraph.getKey(), true);
   * ```
   */
  setTaskChecked(key, checked) {
    const resolved = this.resolveParagraph(key);
    const bullet = resolved.paragraph.bullet;
    if (!bullet || !this.isTaskParagraph(key)) {
      return false;
    }
    const updateBody = {
      dataStream: "",
      paragraphs: [{
        ...resolved.paragraph,
        startIndex: 0,
        bullet: {
          ...bullet,
          listType: checked ? "CHECK_LIST_CHECKED" /* CHECK_LIST_CHECKED */ : "CHECK_LIST" /* CHECK_LIST */
        }
      }]
    };
    this._preserveExplicitParagraphIds(updateBody);
    return this._retainBodyRange(
      { startOffset: resolved.endOffset, endOffset: resolved.endOffset + 1 },
      updateBody,
      1 /* REPLACE */
    );
  }
  /**
   * Resolve a paragraph id to its current paragraph metadata.
   * @param {string} key The paragraph id.
   * @returns {IFDocResolvedParagraph} The current paragraph metadata.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const paragraph = doc.getBody().getChild(0).asParagraph();
   * const resolved = doc.getBody().resolveParagraph(paragraph.getKey());
   * console.log(resolved.paragraphIndex);
   * ```
   */
  resolveParagraph(key) {
    var _a;
    const body = this._getBody();
    const paragraphs = (_a = body.paragraphs) != null ? _a : [];
    const matches = paragraphs.map((paragraph2, paragraphIndex2) => ({ paragraph: paragraph2, paragraphIndex: paragraphIndex2 })).filter(({ paragraph: paragraph2 }) => paragraph2.paragraphId === key);
    if (matches.length !== 1) {
      throw new DocElementStaleError(matches.length > 1 ? `Doc paragraph id "${key}" is duplicated.` : `Doc paragraph id "${key}" is stale.`);
    }
    const { paragraph, paragraphIndex } = matches[0];
    const startOffset = paragraphIndex > 0 ? body.paragraphs[paragraphIndex - 1].startIndex + 1 : 0;
    return {
      paragraph,
      paragraphIndex,
      startOffset,
      endOffset: paragraph.startIndex
    };
  }
  /**
   * Resolve an element key to its current child metadata.
   * @param {FDocElementType} type The element type.
   * @param {string} key The persisted element key.
   * @returns {object} The current child metadata used by the facade.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const element = doc.getBody().getChild(0);
   * const resolved = doc.getBody().resolveElement(element.getType(), element.getKey());
   * console.log(resolved.position);
   * ```
   */
  resolveElement(type, key) {
    if (type === "paragraph") {
      const paragraph = this.resolveParagraph(key);
      return { type, key, position: paragraph.startOffset, priority: 3 };
    }
    const child = this._getChildren().find((item) => item.type === type && item.key === key);
    if (!child) {
      throw new Error("Doc element is stale");
    }
    return child;
  }
  /**
   * Get a callout, quote, or code block range by block id.
   * @param {string} key The persisted block range id.
   * @returns {IDocumentBlockRange} The matching block range snapshot.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const block = doc.getBody().getChild(0).asBlockRange();
   * console.log(doc.getBody().getBlockRange(block.getKey()).blockType);
   * ```
   */
  getBlockRange(key) {
    var _a;
    const blockRange = (_a = this._getBody().blockRanges) == null ? void 0 : _a.find((item) => item.blockId === key);
    if (!blockRange) {
      throw new Error("Doc element is stale");
    }
    return blockRange;
  }
  /**
   * Get the text inside a callout, quote, or code block range.
   * @param {string} key The persisted block range id.
   * @returns {string} The block range text.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const block = doc.getBody().getChild(0).asBlockRange();
   * console.log(doc.getBody().getBlockRangeText(block.getKey()));
   * ```
   */
  getBlockRangeText(key) {
    const blockRange = this.getBlockRange(key);
    return this._getBody().dataStream.slice(blockRange.startIndex, blockRange.endIndex);
  }
  /**
   * Replace the text inside a callout, quote, or code block range.
   * @param {string} key The persisted block range id.
   * @param {string} text The replacement text.
   * @returns {boolean} `true` if the text was replaced.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const block = doc.getBody().getChild(0).asBlockRange();
   * doc.getBody().setBlockRangeText(block.getKey(), 'Updated block');
   * ```
   */
  setBlockRangeText(key, text) {
    const blockRange = this.getBlockRange(key);
    const body = buildPlainTextInsertBody(`${text}\r`);
    body.blockRanges = [{
      ...blockRange,
      startIndex: 0,
      endIndex: text.length
    }];
    return this.replaceRange({ startOffset: blockRange.startIndex, endOffset: blockRange.endIndex + 1 }, { body });
  }
  /**
   * Remove a callout, quote, or code block range and its content.
   * @param {string} key The persisted block range id.
   * @returns {boolean} `true` if the block range content was removed.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const block = doc.getBody().getChild(0).asBlockRange();
   * doc.getBody().removeBlockRange(block.getKey());
   * ```
   */
  removeBlockRange(key) {
    const blockRange = this.getBlockRange(key);
    return this.deleteRange({ startOffset: blockRange.startIndex, endOffset: blockRange.endIndex + 1 });
  }
  /**
   * Get a table marker by table id.
   * @param {string} key The persisted table id.
   * @returns {ICustomTable} The matching table marker.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const table = doc.getBody().getChild(0).asTable();
   * console.log(doc.getBody().getTable(table.getTableId()));
   * ```
   */
  getTable(key) {
    var _a;
    const table = (_a = this._getBody().tables) == null ? void 0 : _a.find((item) => item.tableId === key);
    if (!table) {
      throw new Error("Doc element is stale");
    }
    return table;
  }
  /**
   * Remove a table marker and its content range.
   * @param {string} key The persisted table id.
   * @returns {boolean} `true` if the table range was removed.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const table = doc.getBody().getChild(0).asTable();
   * doc.getBody().removeTable(table.getTableId());
   * ```
   */
  removeTable(key) {
    const table = this.getTable(key);
    return this.deleteRange({ startOffset: table.startIndex, endOffset: table.endIndex + 1 });
  }
  /**
   * Get a custom block marker by block id.
   * @param {string} key The persisted custom block id.
   * @returns {ICustomBlock} The matching custom block marker.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const customBlock = doc.getBody().getChild(0).asCustomBlock();
   * console.log(doc.getBody().getCustomBlock(customBlock.getBlockId()));
   * ```
   */
  getCustomBlock(key) {
    var _a;
    const block = (_a = this._getBody().customBlocks) == null ? void 0 : _a.find((item) => item.blockId === key);
    if (!block) {
      throw new Error("Doc element is stale");
    }
    return block;
  }
  /**
   * Remove a custom block marker and its placeholder character.
   * @param {string} key The persisted custom block id.
   * @returns {boolean} `true` if the custom block placeholder was removed.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const customBlock = doc.getBody().getChild(0).asCustomBlock();
   * doc.getBody().removeCustomBlock(customBlock.getBlockId());
   * ```
   */
  removeCustomBlock(key) {
    const block = this.getCustomBlock(key);
    return this.deleteRange({ startOffset: block.startIndex, endOffset: block.startIndex + 1 });
  }
  /**
   * Create a sibling element wrapper relative to the current element key.
   * @param {FDocElementType} type The current element type.
   * @param {string} key The current element key.
   * @param {-1 | 1} direction `-1` for previous sibling, `1` for next sibling.
   * @returns {FDocElement | null} The sibling wrapper, or `null` if none exists.
   * @example
   * ```ts
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const element = doc.getBody().getChild(0);
   * const next = doc.getBody().createSibling(element.getType(), element.getKey(), 1);
   * console.log(next?.getType());
   * ```
   */
  createSibling(type, key, direction) {
    const index = this.getChildIndex(this._createElement(type, key));
    const child = this._getChildren()[index + direction];
    return child ? this._createElement(child.type, child.key) : null;
  }
  _getChildren() {
    var _a, _b, _c, _d, _e;
    const body = this._getBody();
    const children = [];
    for (let index = 0; index < ((_b = (_a = body.paragraphs) == null ? void 0 : _a.length) != null ? _b : 0); index++) {
      const paragraph = body.paragraphs[index];
      children.push({
        type: "paragraph",
        key: this._getParagraphId(paragraph, index),
        position: index > 0 ? body.paragraphs[index - 1].startIndex + 1 : 0,
        priority: 3
      });
    }
    (_c = body.blockRanges) == null ? void 0 : _c.forEach((blockRange) => children.push({
      type: "blockRange",
      key: blockRange.blockId,
      position: blockRange.startIndex,
      priority: 0
    }));
    (_d = body.tables) == null ? void 0 : _d.forEach((table) => children.push({
      type: "table",
      key: table.tableId,
      position: table.startIndex,
      priority: 1
    }));
    (_e = body.customBlocks) == null ? void 0 : _e.forEach((customBlock) => children.push({
      type: "customBlock",
      key: customBlock.blockId,
      position: customBlock.startIndex,
      priority: 2
    }));
    return children.sort((a, b) => a.position - b.position || a.priority - b.priority);
  }
  _createElement(type, key) {
    return new FDocElement(this, type, key);
  }
  _getBody() {
    const body = this._documentDataModel.getSelfOrHeaderFooterModel(this._segmentId).getBody();
    if (!body) {
      throw new Error("The document body is empty");
    }
    return body;
  }
  _getParagraphInsertOffset(index) {
    var _a;
    const body = this._getBody();
    if (index <= 0) {
      return 0;
    }
    const paragraphs = (_a = body.paragraphs) != null ? _a : [];
    if (paragraphs.length === 0) {
      return Math.max(0, body.dataStream.length - 1);
    }
    if (index >= paragraphs.length) {
      return paragraphs[paragraphs.length - 1].startIndex + 1;
    }
    return paragraphs[index - 1].startIndex + 1;
  }
  _normalizeInsertedParagraphIndex(index) {
    var _a;
    const paragraphs = (_a = this._getBody().paragraphs) != null ? _a : [];
    return Math.max(0, Math.min(index, paragraphs.length - 1));
  }
  _getParagraphId(paragraph, paragraphIndex) {
    if (!paragraph) {
      throw new RangeError(`Paragraph index ${paragraphIndex} is out of range.`);
    }
    if (!paragraph.paragraphId) {
      throw new DocElementStaleError(`Paragraph at index ${paragraphIndex} is missing paragraphId.`);
    }
    return paragraph.paragraphId;
  }
  _preserveExplicitParagraphIds(body) {
    body[RESTORE_INSERTED_PARAGRAPH_IDS] = true;
  }
  _findParagraphByRange(range) {
    var _a;
    const paragraphs = (_a = this._getBody().paragraphs) != null ? _a : [];
    const paragraphIndex = paragraphs.findIndex((paragraph2, index) => {
      const startOffset = index > 0 ? paragraphs[index - 1].startIndex + 1 : 0;
      return startOffset <= range.startOffset && range.endOffset <= paragraph2.startIndex;
    });
    if (paragraphIndex < 0) {
      throw new RangeError("Range does not resolve to a paragraph.");
    }
    const paragraph = paragraphs[paragraphIndex];
    return {
      paragraph,
      paragraphIndex,
      startOffset: paragraphIndex > 0 ? paragraphs[paragraphIndex - 1].startIndex + 1 : 0,
      endOffset: paragraph.startIndex
    };
  }
  _replaceBodyRange(range, insertBody) {
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;
    const textX = new TextX();
    if (startOffset > 0) {
      textX.push({ t: "r" /* RETAIN */, len: startOffset });
    }
    if (endOffset > startOffset) {
      textX.push({ t: "d" /* DELETE */, len: endOffset - startOffset });
    }
    if (insertBody.dataStream.length > 0) {
      textX.push({
        t: "i" /* INSERT */,
        body: insertBody,
        len: insertBody.dataStream.length
      });
    }
    return this._executeTextX(textX);
  }
  _retainBodyRange(range, body, coverType) {
    var _a;
    if (((_a = body.textRuns) == null ? void 0 : _a.length) && this._getBody().textRuns == null) {
      this._ensureTextRuns();
    }
    const textX = new TextX();
    if (range.startOffset > 0) {
      textX.push({ t: "r" /* RETAIN */, len: range.startOffset });
    }
    textX.push({
      t: "r" /* RETAIN */,
      body,
      coverType,
      len: range.endOffset - range.startOffset
    });
    return this._executeTextX(textX);
  }
  _ensureTextRuns() {
    const currentBody = this._getBody();
    if (currentBody.textRuns != null) {
      return;
    }
    const jsonX = JSONX.getInstance();
    const actions = jsonX.replaceOp(
      [...getRichTextEditPath(this._documentDataModel, this._segmentId), "textRuns"],
      void 0,
      []
    );
    this._commandService.syncExecuteCommand(
      RichTextEditingMutation.id,
      {
        unitId: this._documentDataModel.getUnitId(),
        segmentId: this._segmentId,
        actions,
        textRanges: [],
        trigger: FACADE_TRIGGER,
        isEditing: false
      }
    );
  }
  _executeTextX(textX) {
    const jsonX = JSONX.getInstance();
    const actions = jsonX.editOp(textX.serialize(), getRichTextEditPath(this._documentDataModel, this._segmentId));
    const result = this._commandService.syncExecuteCommand(
      RichTextEditingMutation.id,
      {
        unitId: this._documentDataModel.getUnitId(),
        segmentId: this._segmentId,
        actions,
        textRanges: [],
        trigger: FACADE_TRIGGER,
        isEditing: false
      }
    );
    return Boolean(result);
  }
};

// ../packages/docs/src/facade/f-document.ts
var FDocument = class extends FBaseInitialable {
  constructor(_documentDataModel, _injector, _univerInstanceService, _resourceLoaderService, _commandService) {
    super(_injector);
    __publicField(this, "_documentDataModel", _documentDataModel);
    __publicField(this, "_injector", _injector);
    __publicField(this, "_univerInstanceService", _univerInstanceService);
    __publicField(this, "_resourceLoaderService", _resourceLoaderService);
    __publicField(this, "_commandService", _commandService);
    __publicField(this, "id");
    __publicField(this, "_docElementRegistry", new DocElementRegistry());
    this.id = this._documentDataModel.getUnitId();
  }
  /**
   * Get the document data model of the document.
   * @returns {DocumentDataModel} The document data model.
   * @example
   * ```typescript
   * const fDocument = univerAPI.getActiveDocument();
   * const documentDataModel = fDocument.getDocumentDataModel();
   * console.log(documentDataModel);
   * ```
   */
  getDocumentDataModel() {
    return this._documentDataModel;
  }
  /**
   * Get the document body facade.
   *
   * The returned body facade provides synchronous Google Docs-like element APIs
   * for reading and editing top-level document body elements. Paragraph elements
   * use their persisted `paragraphId` values. Persisted elements, such as tables
   * and custom blocks, use their existing ids.
   *
   * @returns {FDocBody} The document body API instance.
   * @example
   * ```typescript
   * const doc = univerAPI.getActiveDocument();
   * if (!doc) throw new Error('No active document');
   *
   * const body = doc.getBody();
   * const paragraph = body.getChild(0).asParagraph();
   * paragraph.appendText(' updated');
   * ```
   */
  getBody() {
    return new FDocBody(
      this._documentDataModel,
      this._commandService,
      this._docElementRegistry
    );
  }
  dispose() {
    super.dispose();
  }
  /**
   * Get the document id.
   * @returns {string} The document id.
   * @example
   * ```typescript
   * const fDocument = univerAPI.getActiveDocument();
   * const unitId = fDocument.getId();
   * console.log(unitId);
   * ```
   */
  getId() {
    return this.id;
  }
  /**
   * Get the document name.
   * @returns {string} The document name.
   * @example
   * ```typescript
   * const fDocument = univerAPI.getActiveDocument();
   * const name = fDocument.getName();
   * console.log(name);
   * ```
   */
  getName() {
    return this._documentDataModel.getTitle() || "";
  }
  /**
   * Save the document snapshot data, including the document content and resource data, etc.
   * @returns {IDocumentData} The document snapshot data.
   * @example
   * ```typescript
   * const fDocument = univerAPI.getActiveDocument();
   * const snapshot = fDocument.save();
   * console.log(snapshot);
   * ```
   */
  save() {
    return this._resourceLoaderService.saveUnit(this._documentDataModel.getUnitId());
  }
  /**
   * Undo the last operation in the document.
   * @returns {boolean} `true` if the undo operation was successful, or `false` if it failed.
   * @example
   * ```typescript
   * const fDocument = univerAPI.getActiveDocument();
   * const success = fDocument.undo();
   * console.log(success);
   * ```
   */
  undo() {
    this._univerInstanceService.focusUnit(this.id);
    return this._commandService.syncExecuteCommand(UndoCommand.id);
  }
  /**
   * Redo the last undone operation in the document.
   * @returns {boolean} `true` if the redo operation was successful, or `false` if it failed.
   * @example
   * ```typescript
   * const fDocument = univerAPI.getActiveDocument();
   * const success = fDocument.redo();
   * console.log(success);
   * ```
   */
  redo() {
    this._univerInstanceService.focusUnit(this.id);
    return this._commandService.syncExecuteCommand(RedoCommand.id);
  }
  /**
   * Adds the specified text to the end of this text region.
   * @param {string} text - The text to be added to the end of this text region.
   * @return {boolean} `true` if the text was successfully appended, or `false` if it failed.
   * @example
   * ```typescript
   * const fDocument = univerAPI.getActiveDocument();
   * const success = fDocument.appendText('Hello, world!');
   * console.log(success);
   * ```
   */
  appendText(text) {
    const { body } = this.save();
    if (!body) {
      throw new Error("The document body is empty");
    }
    const lastPosition = body.dataStream.length - 2;
    return this.insertText(text, {
      startOffset: lastPosition,
      endOffset: lastPosition,
      segmentId: ""
    });
  }
  /**
   * Inserts text at the provided document range. Defaults to appending before the final section break.
   * @param {string} text - The text to insert.
   * @param {IDocumentInsertTextFacadeOptions} options - Optional target range, segment id, and cursor offset.
   * @returns {boolean} `true` if the text was successfully inserted, or `false` if it failed.
   * @example
   *
   * // Insert text at a specific range in the document body
   * ```typescript
   * const fDocument = univerAPI.getActiveDocument();
   * const success = fDocument.insertText('Hello, world!', {
   *   startOffset: 5,
   *   endOffset: 5,
   *   segmentId: '',
   *   cursorOffset: 13,
   * });
   * console.log(success);
   * ```
   *
   * // Insert text at the beginning of a header or footer segment
   * ```typescript
   * const fDocument = univerAPI.getActiveDocument();
   * const snapshot = fDocument.save();
   * const { headers, footers } = snapshot;
   *
   * if (headers) {
   *   for (const headerId in headers) {
   *     if (headerId === 'target-header-id') {
   *       fDocument.insertText('Hello, header!', {
   *         startOffset: 0,
   *         endOffset: 0,
   *         segmentId: headerId,
   *       });
   *     }
   *   }
   * }
   *
   * if (footers) {
   *   for (const footerId in footers) {
   *     if (footerId === 'target-footer-id') {
   *       fDocument.insertText('Hello, footer!', {
   *         startOffset: 0,
   *         endOffset: 0,
   *         segmentId: footerId,
   *       });
   *     }
   *   }
   * }
   * ```
   */
  insertText(text, options = {}) {
    var _a, _b, _c;
    const unitId = this.id;
    const { body } = this.save();
    if (!body) {
      throw new Error("The document body is empty");
    }
    const startOffset = (_a = options.startOffset) != null ? _a : Math.max(0, body.dataStream.length - 2);
    const endOffset = (_b = options.endOffset) != null ? _b : startOffset;
    const segmentId = (_c = options.segmentId) != null ? _c : "";
    const activeRange = {
      startOffset,
      endOffset,
      collapsed: startOffset === endOffset,
      segmentId
    };
    const removeLeadingParagraphBreak = startOffset === 0;
    const insertBody = buildPlainTextInsertBody(text, {
      paragraphStyle: getParagraphStyleAtOffset(body, startOffset),
      removeLeadingParagraphBreak
    });
    const cursorOffset = options.cursorOffset == null ? void 0 : getNormalizedPlainTextCursorOffset(text, options.cursorOffset, removeLeadingParagraphBreak);
    return this._commandService.syncExecuteCommand(InsertTextCommand.id, {
      unitId,
      body: insertBody,
      range: activeRange,
      segmentId,
      ...cursorOffset == null ? {} : { cursorOffset }
    });
  }
  /**
   * Inserts one or more plain-text paragraphs at the provided document range.
   * @param {string} text - The paragraph text to insert. Newlines are normalized to document paragraph separators.
   * @param {IDocumentInsertTextFacadeOptions} options - Optional target range, segment id, and cursor offset.
   * @returns {boolean} `true` if the paragraphs were successfully inserted, or `false` if it failed.
   * @example
   * ```typescript
   * const fDocument = univerAPI.getActiveDocument();
   * const success = fDocument.insertParagraph('Hello, world! This is a new paragraph.', {
   *   startOffset: 5,
   *   endOffset: 5,
   * });
   * console.log(success);
   * ```
   */
  insertParagraph(text = "", options = {}) {
    var _a;
    const dataStream = `${text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").join("\r\n")}\r
`;
    return this.insertText(dataStream, {
      ...options,
      cursorOffset: (_a = options.cursorOffset) != null ? _a : dataStream.length
    });
  }
};
FDocument = __decorateClass([
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, IUniverInstanceService),
  __decorateParam(3, Inject(IResourceLoaderService)),
  __decorateParam(4, ICommandService)
], FDocument);

// ../packages/docs/src/facade/f-univer.ts
var FUniverDocsMixin = class extends FUniver {
  createDocument(data) {
    const instanceService = this._injector.get(IUniverInstanceService);
    const document = instanceService.createUnit(1 /* UNIVER_DOC */, data);
    return this._injector.createInstance(FDocument, document);
  }
  getActiveDocument() {
    const document = this._univerInstanceService.getCurrentUnitOfType(1 /* UNIVER_DOC */);
    if (!document) {
      return null;
    }
    return this._injector.createInstance(FDocument, document);
  }
  getDocument(id) {
    const document = this._univerInstanceService.getUnit(id, 1 /* UNIVER_DOC */);
    if (!document) {
      return null;
    }
    return this._injector.createInstance(FDocument, document);
  }
};
FUniver.extend(FUniverDocsMixin);

// ../packages/docs-ui/src/facade/f-document.ts
var FDocumentUIMixin = class extends FDocument {
  /**
   * Sets the selection to a specified text range in the document.
   * @param startOffset - The starting offset of the selection in the document.
   * @param endOffset - The ending offset of the selection in the document.
   * @example
   * ```typescript
   * const fDocument = univerAPI.getActiveDocument();
   * fDocument.setSelection(10, 20);
   * ```
   */
  setSelection(startOffset, endOffset) {
    var _a;
    const renderManagerService = this._injector.get(IRenderManagerService);
    const docSelectionRenderService = (_a = renderManagerService.getRenderUnitById(this.getId())) == null ? void 0 : _a.with(DocSelectionRenderService);
    docSelectionRenderService == null ? void 0 : docSelectionRenderService.removeAllRanges();
    docSelectionRenderService == null ? void 0 : docSelectionRenderService.addDocRanges(
      [
        {
          startOffset,
          endOffset,
          rangeType: "TEXT" /* TEXT */
        }
      ],
      true
    );
  }
};
FDocument.extend(FDocumentUIMixin);
