import {
  UniverSheetsFindReplacePlugin
} from "./chunk-RWL7IRK2.js";
import {
  UniverSheetsNoteUIPlugin,
  UniverSheetsTableUIPlugin
} from "./chunk-JNG6FCEO.js";
import {
  UniverSheetsSortUIPlugin
} from "./chunk-QS6LFNJU.js";
import {
  UniverSheetsConditionalFormattingUIPlugin,
  UniverSheetsDataValidationUIPlugin,
  UniverSheetsFilterUIPlugin
} from "./chunk-QWLAVJBI.js";
import {
  UniverSheetsThreadCommentUIPlugin
} from "./chunk-EF7RMEKO.js";
import {
  UniverSheetsNumfmtUIPlugin
} from "./chunk-BKXM44J2.js";
import {
  UniverThreadCommentUIPlugin
} from "./chunk-5CKCHV6U.js";
import {
  UniverSheetsNotePlugin,
  UniverSheetsTablePlugin
} from "./chunk-PTDLGNGE.js";
import {
  FRange,
  FWorkbook,
  FWorksheet
} from "./chunk-VFHOZR32.js";
import {
  UniverSheetsThreadCommentPlugin
} from "./chunk-SMX4EZPQ.js";
import {
  UniverFindReplacePlugin
} from "./chunk-PKG62NXU.js";
import {
  AddHyperLinkCommand,
  CancelHyperLinkCommand,
  SheetsHyperLinkParserService,
  UniverSheetsHyperLinkPlugin,
  UniverSheetsHyperLinkUIPlugin,
  UpdateHyperLinkCommand
} from "./chunk-C4VAWZ2H.js";
import {
  UniverSheetsSortPlugin
} from "./chunk-JCBGZ2SK.js";
import {
  UniverSheetsConditionalFormattingPlugin
} from "./chunk-5KJD2PGF.js";
import {
  UniverSheetsFormulaUIPlugin
} from "./chunk-NEBSOD4N.js";
import {
  UniverSheetsNumfmtPlugin
} from "./chunk-37PIRJH5.js";
import {
  UniverSheetsDrawingPlugin,
  UniverSheetsDrawingUIPlugin
} from "./chunk-ADMC2PQI.js";
import {
  UniverSheetsUIPlugin
} from "./chunk-YEVD4X4C.js";
import {
  zh_CN_default,
  zh_CN_default10 as zh_CN_default11,
  zh_CN_default11 as zh_CN_default12,
  zh_CN_default12 as zh_CN_default13,
  zh_CN_default13 as zh_CN_default14,
  zh_CN_default14 as zh_CN_default15,
  zh_CN_default2 as zh_CN_default3,
  zh_CN_default3 as zh_CN_default4,
  zh_CN_default4 as zh_CN_default5,
  zh_CN_default5 as zh_CN_default6,
  zh_CN_default6 as zh_CN_default7,
  zh_CN_default7 as zh_CN_default8,
  zh_CN_default8 as zh_CN_default9,
  zh_CN_default9 as zh_CN_default10
} from "./chunk-IMWY7PB3.js";
import {
  UniverNetworkPlugin
} from "./chunk-ZLGT6G56.js";
import {
  UniverDocsDrawingPlugin,
  UniverDrawingUIPlugin
} from "./chunk-CSYKENI5.js";
import {
  UniverDataValidationPlugin,
  UniverDocsPlugin,
  UniverDocsUIPlugin,
  UniverDrawingPlugin,
  UniverSheetsDataValidationPlugin
} from "./chunk-DXOT3Z2O.js";
import {
  zh_CN_default as zh_CN_default2,
  zh_CN_default2 as zh_CN_default16
} from "./chunk-WRDP6BX6.js";
import {
  UniverUIPlugin
} from "./chunk-JL7CYBV7.js";
import {
  UniverSheetsFilterPlugin
} from "./chunk-PM7HEMJK.js";
import {
  FEventName,
  FUniver
} from "./chunk-JRQIBFK2.js";
import {
  UniverSheetsFormulaPlugin
} from "./chunk-IUS37GUB.js";
import {
  IDefinedNamesService,
  UniverFormulaEnginePlugin,
  UniverRPCMainThreadPlugin,
  UniverSheetsPlugin
} from "./chunk-4P44Q6QX.js";
import {
  CanceledError,
  ICommandService,
  IImageIoService,
  UniverRenderEnginePlugin,
  generateRandomId
} from "./chunk-M6CFAGRR.js";

// ../presets/packages/preset-sheets-conditional-formatting/src/umd.ts
function UniverSheetsConditionalFormattingPreset() {
  return {
    plugins: [
      UniverSheetsConditionalFormattingPlugin,
      UniverSheetsConditionalFormattingUIPlugin
    ].filter((v) => !!v)
  };
}

// ../presets/packages/preset-sheets-conditional-formatting/src/locales/zh-CN.ts
var zh_CN_default17 = Object.assign(
  {},
  zh_CN_default4,
  zh_CN_default5
);

// ../presets/packages/preset-sheets-core/src/umd.ts
function UniverSheetsCorePreset(config = {}) {
  var _a;
  const {
    container = "app",
    workerURL: workerSrc,
    header,
    footer,
    toolbar,
    ribbonType,
    formulaBar,
    menu,
    contextMenu,
    disableAutoFocus,
    customFontFamily,
    docs,
    sheets,
    formula,
    disableTextFormatAlert,
    disableTextFormatMark
  } = config;
  const useWorker = !!workerSrc;
  return {
    plugins: [
      UniverNetworkPlugin,
      [UniverDocsPlugin, {
        hasScroll: docs == null ? void 0 : docs.hasScroll
      }],
      UniverRenderEnginePlugin,
      [UniverUIPlugin, {
        container,
        header,
        toolbar,
        ribbonType,
        menu,
        contextMenu,
        disableAutoFocus,
        customFontFamily
      }],
      UniverDocsUIPlugin,
      useWorker ? [UniverRPCMainThreadPlugin, { workerURL: workerSrc }] : null,
      [UniverFormulaEnginePlugin, {
        notExecuteFormula: useWorker,
        function: formula == null ? void 0 : formula.function
      }],
      [UniverSheetsPlugin, {
        notExecuteFormula: useWorker,
        onlyRegisterFormulaRelatedMutations: false,
        isRowStylePrecedeColumnStyle: sheets == null ? void 0 : sheets.isRowStylePrecedeColumnStyle,
        autoHeightForMergedCells: sheets == null ? void 0 : sheets.autoHeightForMergedCells,
        freezeSync: sheets == null ? void 0 : sheets.freezeSync
      }],
      [UniverSheetsUIPlugin, {
        formulaBar,
        footer,
        maxAutoHeightCount: sheets == null ? void 0 : sheets.maxAutoHeightCount,
        clipboardConfig: sheets == null ? void 0 : sheets.clipboardConfig,
        scrollConfig: sheets == null ? void 0 : sheets.scrollConfig,
        protectedRangeShadow: (_a = sheets == null ? void 0 : sheets.protectedRangeShadow) != null ? _a : true,
        protectedRangeUserSelector: sheets == null ? void 0 : sheets.protectedRangeUserSelector,
        disableForceStringAlert: sheets == null ? void 0 : sheets.disableForceStringAlert,
        disableForceStringMark: sheets == null ? void 0 : sheets.disableForceStringMark
      }],
      [UniverSheetsNumfmtPlugin, {
        disableTextFormatAlert,
        disableTextFormatMark
      }],
      UniverSheetsNumfmtUIPlugin,
      [UniverSheetsFormulaPlugin, {
        notExecuteFormula: useWorker,
        description: formula == null ? void 0 : formula.description,
        initialFormulaComputing: formula == null ? void 0 : formula.initialFormulaComputing
      }],
      [UniverSheetsFormulaUIPlugin, {
        functionScreenTips: formula == null ? void 0 : formula.functionScreenTips
      }]
    ].filter((v) => !!v)
  };
}

// ../presets/packages/preset-sheets-data-validation/src/umd.ts
function UniverSheetsDataValidationPreset(config = {}) {
  const { showEditOnDropdown, showSearchOnDropdown } = config;
  return {
    plugins: [
      UniverDataValidationPlugin,
      UniverSheetsDataValidationPlugin,
      [UniverSheetsDataValidationUIPlugin, {
        showEditOnDropdown,
        showSearchOnDropdown
      }]
    ].filter((v) => !!v)
  };
}

// ../presets/packages/preset-sheets-data-validation/src/locales/zh-CN.ts
var zh_CN_default18 = Object.assign(
  {},
  zh_CN_default,
  zh_CN_default6,
  zh_CN_default7
);

// ../presets/packages/preset-sheets-drawing/src/umd.ts
function UniverSheetsDrawingPreset(config = {}) {
  const { collaboration = false, allowImageSize } = config;
  return {
    plugins: [
      [UniverDrawingPlugin, {
        override: collaboration ? [[IImageIoService, null]] : [],
        allowImageSize
      }],
      UniverDocsDrawingPlugin,
      UniverDrawingUIPlugin,
      UniverSheetsDrawingPlugin,
      UniverSheetsDrawingUIPlugin
    ].filter((v) => !!v)
  };
}

// ../presets/packages/preset-sheets-drawing/src/locales/zh-CN.ts
var zh_CN_default19 = Object.assign(
  {},
  zh_CN_default2,
  zh_CN_default8
);

// ../presets/packages/preset-sheets-filter/src/umd.ts
function UniverSheetsFilterPreset(config = {}) {
  const { enableSyncSwitch } = config;
  return {
    plugins: [
      [UniverSheetsFilterPlugin, { enableSyncSwitch }],
      UniverSheetsFilterUIPlugin
    ].filter((v) => !!v)
  };
}

// ../presets/packages/preset-sheets-find-replace/src/umd.ts
function UniverSheetsFindReplacePreset(_config = {}) {
  return {
    plugins: [
      [UniverFindReplacePlugin],
      [UniverSheetsFindReplacePlugin]
    ].filter((v) => !!v)
  };
}

// ../presets/packages/preset-sheets-find-replace/src/locales/zh-CN.ts
var zh_CN_default20 = Object.assign(
  {},
  zh_CN_default3
);

// ../packages/sheets-hyper-link/src/facade/f-workbook.ts
var FWorkbookHyperlinkMixin = class extends FWorkbook {
  getUrlOfDefineName(name) {
    const definedNameService = this._injector.get(IDefinedNamesService);
    const parserService = this._injector.get(SheetsHyperLinkParserService);
    const definedName = definedNameService.getValueByName(this._workbook.getUnitId(), name);
    if (!definedName) {
      throw new Error(`Defined name "${name}" does not exist.`);
    }
    if (definedName.formulaOrRefString.startsWith("=" /* EQUALS */)) {
      throw new Error(`Defined name "${name}" is not a reference range, cannot be converted to hyperlink.`);
    }
    return parserService.buildHyperLink(definedName.id);
  }
  parseSheetHyperlink(hyperlink) {
    const parserService = this._injector.get(SheetsHyperLinkParserService);
    return parserService.parseHyperLink(hyperlink);
  }
};
FWorkbook.extend(FWorkbookHyperlinkMixin);

// ../packages/sheets-hyper-link/src/facade/f-worksheet.ts
var FWorksheetHyperlinkMixin = class extends FWorksheet {
  getUrl() {
    const parserService = this._injector.get(SheetsHyperLinkParserService);
    return parserService.buildHyperLink(null, this._worksheet.getSheetId());
  }
};
FWorksheet.extend(FWorksheetHyperlinkMixin);

// ../packages/sheets-hyper-link/src/facade/f-range.ts
var FRangeSheetsHyperlinkMixin = class extends FRange {
  setHyperLink(url, label) {
    return this._commandService.executeCommand(AddHyperLinkCommand.id, {
      unitId: this.getUnitId(),
      subUnitId: this._worksheet.getSheetId(),
      link: {
        id: generateRandomId(),
        row: this._range.startRow,
        column: this._range.startColumn,
        payload: url,
        display: label
      }
    });
  }
  getHyperLinks() {
    const hyperlinks = [];
    this.forEach((row, column, cell) => {
      var _a, _b, _c, _d, _e, _f, _g;
      if (!cell.p) {
        return;
      }
      const ranges = (_c = (_b = (_a = cell.p.body) == null ? void 0 : _a.customRanges) == null ? void 0 : _b.filter((range) => range.rangeType === 0 /* HYPERLINK */)) != null ? _c : [];
      if (ranges.length > 0) {
        const dataStream = (_e = (_d = cell.p) == null ? void 0 : _d.body) == null ? void 0 : _e.dataStream;
        const { rangeId, properties, startIndex, endIndex } = ranges[0];
        const url = (_f = properties == null ? void 0 : properties.url) != null ? _f : "";
        const label = (_g = dataStream == null ? void 0 : dataStream.slice(startIndex, endIndex + 1).replaceAll("" /* CUSTOM_RANGE_START */, "").replaceAll("" /* CUSTOM_RANGE_END */, "")) != null ? _g : "";
        hyperlinks.push({
          id: `${rangeId}`,
          row,
          column,
          url,
          label
        });
      }
    });
    return hyperlinks;
  }
  updateHyperLink(url, label) {
    const hyperlink = this.getHyperLinks().find((link) => link.row === this._range.startRow && link.column === this._range.startColumn);
    if (!hyperlink) {
      return Promise.reject(new Error("No hyperlink found in the top left cell of the range"));
    }
    const { id, row, column } = hyperlink;
    return this._commandService.executeCommand(UpdateHyperLinkCommand.id, {
      unitId: this.getUnitId(),
      subUnitId: this._worksheet.getSheetId(),
      id,
      row,
      column,
      payload: {
        payload: url,
        display: label
      }
    });
  }
  cancelHyperLink(hyperlink) {
    if (hyperlink) {
      const { id, row, column } = hyperlink;
      return this._commandService.syncExecuteCommand(CancelHyperLinkCommand.id, {
        unitId: this.getUnitId(),
        subUnitId: this._worksheet.getSheetId(),
        id,
        row,
        column
      });
    } else {
      const hyperlinks = this.getHyperLinks();
      if (hyperlinks.length === 0) {
        return true;
      }
      return hyperlinks.every((link) => {
        const { id, row, column } = link;
        return this._commandService.syncExecuteCommand(CancelHyperLinkCommand.id, {
          unitId: this.getUnitId(),
          subUnitId: this._worksheet.getSheetId(),
          id,
          row,
          column
        });
      });
    }
  }
  getUrl() {
    const parserService = this._injector.get(SheetsHyperLinkParserService);
    return parserService.buildHyperLink(this.getRange(), this.getSheetId());
  }
};
FRange.extend(FRangeSheetsHyperlinkMixin);

// ../packages/sheets-hyper-link/src/facade/f-event.ts
var FSheetsHyperlinkEventNameMixin = class extends FEventName {
  get BeforeSheetLinkAdd() {
    return "BeforeSheetLinkAdd";
  }
  get BeforeSheetLinkCancel() {
    return "BeforeSheetLinkCancel";
  }
  get BeforeSheetLinkUpdate() {
    return "BeforeSheetLinkUpdate";
  }
};
FEventName.extend(FSheetsHyperlinkEventNameMixin);

// ../packages/sheets-hyper-link/src/facade/f-univer.ts
var FUniverSheetsHyperlinkMixin = class extends FUniver {
  /**
   * @ignore
   */
  // eslint-disable-next-line max-lines-per-function
  _initialize(injector) {
    const commandService = injector.get(ICommandService);
    this.disposeWithMe(
      this.registerEventHandler(
        this.Event.BeforeSheetLinkAdd,
        () => commandService.beforeCommandExecuted((commandInfo) => {
          if (commandInfo.id !== AddHyperLinkCommand.id) return;
          const params = commandInfo.params;
          const target = this.getSheetCommandTarget(params);
          if (!target) return;
          const { workbook, worksheet } = target;
          const { link } = params;
          const { row, column: col } = link;
          const eventParams = {
            workbook,
            worksheet,
            row,
            col,
            link
          };
          this.fireEvent(this.Event.BeforeSheetLinkAdd, eventParams);
          if (eventParams.cancel) {
            throw new CanceledError();
          }
        })
      )
    );
    this.disposeWithMe(
      this.registerEventHandler(
        this.Event.BeforeSheetLinkUpdate,
        () => commandService.beforeCommandExecuted((commandInfo) => {
          if (commandInfo.id !== UpdateHyperLinkCommand.id) return;
          const params = commandInfo.params;
          const target = this.getSheetCommandTarget(params);
          if (!target) return;
          const { workbook, worksheet } = target;
          const { row, column, id, payload } = params;
          const eventParams = {
            workbook,
            worksheet,
            row,
            column,
            id,
            payload
          };
          this.fireEvent(this.Event.BeforeSheetLinkUpdate, eventParams);
          if (eventParams.cancel) {
            throw new CanceledError();
          }
        })
      )
    );
    this.disposeWithMe(
      this.registerEventHandler(
        this.Event.BeforeSheetLinkCancel,
        () => commandService.beforeCommandExecuted((commandInfo) => {
          if (commandInfo.id !== CancelHyperLinkCommand.id) return;
          const params = commandInfo.params;
          const target = this.getSheetCommandTarget(params);
          if (!target) return;
          const { workbook, worksheet } = target;
          const { row, column, id } = params;
          const eventParams = {
            workbook,
            worksheet,
            row,
            column,
            id
          };
          this.fireEvent(this.Event.BeforeSheetLinkCancel, eventParams);
          if (eventParams.cancel) {
            throw new CanceledError();
          }
        })
      )
    );
  }
};
FUniver.extend(FUniverSheetsHyperlinkMixin);

// ../presets/packages/preset-sheets-hyper-link/src/umd.ts
function UniverSheetsHyperLinkPreset(config = {}) {
  const { urlHandler } = config;
  return {
    plugins: [
      UniverSheetsHyperLinkPlugin,
      [UniverSheetsHyperLinkUIPlugin, {
        urlHandler
      }]
    ].filter((v) => !!v)
  };
}

// ../presets/packages/preset-sheets-hyper-link/src/locales/zh-CN.ts
var zh_CN_default21 = Object.assign(
  {},
  zh_CN_default9,
  zh_CN_default10
);

// ../presets/packages/preset-sheets-note/src/umd.ts
function UniverSheetsNotePreset() {
  return {
    plugins: [
      UniverSheetsNotePlugin,
      UniverSheetsNoteUIPlugin
    ].filter((v) => !!v)
  };
}

// ../presets/packages/preset-sheets-note/src/locales/zh-CN.ts
var zh_CN_default22 = Object.assign(
  {},
  zh_CN_default11
);

// ../presets/packages/preset-sheets-sort/src/umd.ts
function UniverSheetsSortPreset() {
  return {
    plugins: [
      UniverSheetsSortPlugin,
      UniverSheetsSortUIPlugin
    ].filter((v) => !!v)
  };
}

// ../presets/packages/preset-sheets-sort/src/locales/zh-CN.ts
var zh_CN_default23 = Object.assign(
  {},
  zh_CN_default12
);

// ../presets/packages/preset-sheets-table/src/umd.ts
function UniverSheetsTablePreset() {
  return {
    plugins: [
      UniverSheetsTablePlugin,
      UniverSheetsTableUIPlugin
    ].filter((v) => !!v)
  };
}

// ../presets/packages/preset-sheets-table/src/locales/zh-CN.ts
var zh_CN_default24 = Object.assign(
  {},
  zh_CN_default13,
  zh_CN_default14
);

// ../presets/packages/preset-sheets-thread-comment/src/umd.ts
function UniverSheetsThreadCommentPreset(_config = {}) {
  const plugins = [
    UniverThreadCommentUIPlugin,
    UniverSheetsThreadCommentPlugin,
    UniverSheetsThreadCommentUIPlugin
  ];
  return { plugins };
}

// ../presets/packages/preset-sheets-thread-comment/src/locales/zh-CN.ts
var zh_CN_default25 = Object.assign(
  {},
  zh_CN_default15,
  zh_CN_default16
);

export {
  UniverSheetsConditionalFormattingPreset,
  zh_CN_default17 as zh_CN_default,
  UniverSheetsCorePreset,
  UniverSheetsDataValidationPreset,
  zh_CN_default18 as zh_CN_default2,
  UniverSheetsDrawingPreset,
  zh_CN_default19 as zh_CN_default3,
  UniverSheetsFilterPreset,
  UniverSheetsFindReplacePreset,
  zh_CN_default20 as zh_CN_default4,
  UniverSheetsHyperLinkPreset,
  zh_CN_default21 as zh_CN_default5,
  UniverSheetsNotePreset,
  zh_CN_default22 as zh_CN_default6,
  UniverSheetsSortPreset,
  zh_CN_default23 as zh_CN_default7,
  UniverSheetsTablePreset,
  zh_CN_default24 as zh_CN_default8,
  UniverSheetsThreadCommentPreset,
  zh_CN_default25 as zh_CN_default9
};
