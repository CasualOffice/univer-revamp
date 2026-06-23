import {
  UniverSheetsConditionalFormattingPreset,
  UniverSheetsCorePreset,
  UniverSheetsDataValidationPreset,
  UniverSheetsDrawingPreset,
  UniverSheetsFilterPreset,
  UniverSheetsFindReplacePreset,
  UniverSheetsHyperLinkPreset,
  UniverSheetsNotePreset,
  UniverSheetsSortPreset,
  UniverSheetsTablePreset,
  UniverSheetsThreadCommentPreset,
  zh_CN_default,
  zh_CN_default2 as zh_CN_default3,
  zh_CN_default3 as zh_CN_default4,
  zh_CN_default4 as zh_CN_default6,
  zh_CN_default5 as zh_CN_default7,
  zh_CN_default6 as zh_CN_default8,
  zh_CN_default7 as zh_CN_default9,
  zh_CN_default8 as zh_CN_default10,
  zh_CN_default9 as zh_CN_default11
} from "../chunk-WIGNK355.js";
import "../chunk-RWL7IRK2.js";
import "../chunk-JNG6FCEO.js";
import "../chunk-QS6LFNJU.js";
import "../chunk-QWLAVJBI.js";
import "../chunk-EF7RMEKO.js";
import "../chunk-BKXM44J2.js";
import "../chunk-5CKCHV6U.js";
import {
  zh_CN_default as zh_CN_default2,
  zh_CN_default2 as zh_CN_default5
} from "../chunk-FY7IHX2E.js";
import {
  createUniver
} from "../chunk-5YFFVOOZ.js";
import {
  DEFAULT_WORKBOOK_DATA_DEMO
} from "../chunk-BMEFCVUP.js";
import "../chunk-NQVJQYNC.js";
import "../chunk-KVDFTFRD.js";
import "../chunk-PTDLGNGE.js";
import "../chunk-VFHOZR32.js";
import "../chunk-SMX4EZPQ.js";
import "../chunk-PKG62NXU.js";
import "../chunk-C4VAWZ2H.js";
import "../chunk-JCBGZ2SK.js";
import "../chunk-5KJD2PGF.js";
import "../chunk-NEBSOD4N.js";
import "../chunk-37PIRJH5.js";
import "../chunk-ADMC2PQI.js";
import "../chunk-YEVD4X4C.js";
import "../chunk-IMWY7PB3.js";
import "../chunk-U72QXM4I.js";
import "../chunk-ZLGT6G56.js";
import "../chunk-R2WETKND.js";
import "../chunk-JMN42JDC.js";
import "../chunk-CSYKENI5.js";
import "../chunk-DXOT3Z2O.js";
import "../chunk-WRDP6BX6.js";
import "../chunk-LI6UXASZ.js";
import "../chunk-JL7CYBV7.js";
import "../chunk-PM7HEMJK.js";
import "../chunk-LOQW54LO.js";
import "../chunk-JRQIBFK2.js";
import "../chunk-QAY465GM.js";
import "../chunk-IUS37GUB.js";
import "../chunk-4P44Q6QX.js";
import {
  default_default,
  mergeLocales
} from "../chunk-M6CFAGRR.js";
import "../chunk-EQ2B2W73.js";
import "../chunk-HECJ2TYE.js";

// src/preset-sheets-core-with-worker/main.ts
var { univer, univerAPI } = createUniver({
  locale: "zhCN" /* ZH_CN */,
  locales: {
    zhCN: mergeLocales(
      zh_CN_default2,
      zh_CN_default4,
      zh_CN_default,
      zh_CN_default3,
      zh_CN_default5,
      zh_CN_default6,
      zh_CN_default7,
      zh_CN_default8,
      zh_CN_default9,
      zh_CN_default10,
      zh_CN_default11
    )
  },
  theme: default_default,
  presets: [
    UniverSheetsCorePreset({
      workerURL: new Worker(new URL("./worker.js", import.meta.url), { type: "module" })
    }),
    UniverSheetsDrawingPreset(),
    UniverSheetsConditionalFormattingPreset(),
    UniverSheetsFilterPreset(),
    UniverSheetsHyperLinkPreset(),
    UniverSheetsDataValidationPreset(),
    UniverSheetsFindReplacePreset(),
    UniverSheetsNotePreset(),
    UniverSheetsSortPreset(),
    UniverSheetsTablePreset(),
    UniverSheetsThreadCommentPreset()
  ]
});
univerAPI.createWorkbook(DEFAULT_WORKBOOK_DATA_DEMO);
window.univer = univer;
window.univerAPI = univerAPI;
