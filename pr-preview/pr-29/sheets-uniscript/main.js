import {
  UniverUniscriptPlugin
} from "../chunk-PHHMNSK5.js";
import "../chunk-R7EK2BG5.js";
import "../chunk-SQZXXC67.js";
import "../chunk-KV3ZS2HR.js";
import {
  UniverSheetsNumfmtUIPlugin
} from "../chunk-BKXM44J2.js";
import {
  UniverDebuggerPlugin
} from "../chunk-6JXNLZN5.js";
import "../chunk-WH3DHUR4.js";
import {
  zh_CN_default
} from "../chunk-5NAVWEQE.js";
import "../chunk-E4LJUPAT.js";
import "../chunk-EDYVLQ5J.js";
import {
  UNISCRIT_WORKBOOK_DATA_DEMO,
  loadDebuggerLocale
} from "../chunk-BMEFCVUP.js";
import {
  UniverSheetsNumfmtPlugin
} from "../chunk-37PIRJH5.js";
import "../chunk-ADMC2PQI.js";
import {
  UniverSheetsUIPlugin
} from "../chunk-YEVD4X4C.js";
import "../chunk-IMWY7PB3.js";
import "../chunk-CSYKENI5.js";
import {
  UniverDocsPlugin,
  UniverDocsUIPlugin
} from "../chunk-DXOT3Z2O.js";
import "../chunk-WRDP6BX6.js";
import "../chunk-LI6UXASZ.js";
import {
  UniverUIPlugin
} from "../chunk-JL7CYBV7.js";
import "../chunk-LOQW54LO.js";
import "../chunk-JRQIBFK2.js";
import "../chunk-QAY465GM.js";
import {
  UniverSheetsFormulaPlugin
} from "../chunk-IUS37GUB.js";
import {
  UniverFormulaEnginePlugin,
  UniverSheetsPlugin
} from "../chunk-4P44Q6QX.js";
import {
  Univer,
  UniverRenderEnginePlugin
} from "../chunk-M6CFAGRR.js";
import "../chunk-EQ2B2W73.js";
import "../chunk-HECJ2TYE.js";

// src/sheets-uniscript/main.ts
var IS_E2E = false;
var univer = new Univer({
  locale: "zhCN" /* ZH_CN */,
  locales: {
    ["zhCN" /* ZH_CN */]: zh_CN_default
  },
  logLevel: 4 /* VERBOSE */
});
univer.registerPlugin(UniverRenderEnginePlugin);
univer.registerPlugin(UniverUIPlugin, {
  container: "app",
  ribbonType: "classic"
});
univer.registerPlugin(UniverDocsPlugin);
univer.registerPlugin(UniverDocsUIPlugin);
univer.registerPlugin(UniverSheetsPlugin);
univer.registerPlugin(UniverSheetsUIPlugin);
univer.registerPlugin(UniverSheetsNumfmtPlugin);
univer.registerPlugin(UniverSheetsNumfmtUIPlugin);
univer.registerPlugin(UniverFormulaEnginePlugin);
univer.registerPlugin(UniverSheetsFormulaPlugin);
univer.registerPlugin(UniverUniscriptPlugin, {
  getWorkerUrl(_, label) {
    if (label === "typescript" || label === "javascript") {
      return "/vs/language/typescript/ts.worker.js";
    }
    return "/vs/editor/editor.worker.js";
  }
});
if (IS_E2E) {
  univer.registerPlugin(UniverDebuggerPlugin, {
    fab: false,
    fabEntryUnitType: 2 /* UNIVER_SHEET */,
    localeLoader: loadDebuggerLocale,
    performanceMonitor: {
      enabled: false
    }
  });
}
univer.createUnit(2 /* UNIVER_SHEET */, UNISCRIT_WORKBOOK_DATA_DEMO);
window.univer = univer;
