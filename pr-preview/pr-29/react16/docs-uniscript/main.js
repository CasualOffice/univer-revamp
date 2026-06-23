import {
  UniverUniscriptPlugin
} from "../chunk-PHHMNSK5.js";
import "../chunk-R7EK2BG5.js";
import "../chunk-SQZXXC67.js";
import "../chunk-KV3ZS2HR.js";
import {
  zh_CN_default
} from "../chunk-5NAVWEQE.js";
import "../chunk-EDYVLQ5J.js";
import {
  DEFAULT_DOCUMENT_DATA_CN
} from "../chunk-BMEFCVUP.js";
import {
  UniverSheetsUIPlugin
} from "../chunk-YEVD4X4C.js";
import "../chunk-IMWY7PB3.js";
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
import "../chunk-IUS37GUB.js";
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

// src/docs-uniscript/main.ts
var univer = new Univer({
  locale: "zhCN" /* ZH_CN */,
  locales: {
    ["zhCN" /* ZH_CN */]: zh_CN_default
  },
  logLevel: 4 /* VERBOSE */
});
univer.registerPlugin(UniverRenderEnginePlugin);
univer.registerPlugin(UniverFormulaEnginePlugin);
univer.registerPlugin(UniverUIPlugin, {
  container: "app",
  ribbonType: "classic",
  footer: false
});
univer.registerPlugin(UniverDocsPlugin);
univer.registerPlugin(UniverDocsUIPlugin);
univer.registerPlugin(UniverSheetsPlugin);
univer.registerPlugin(UniverSheetsUIPlugin);
univer.registerPlugin(UniverUniscriptPlugin, {
  getWorkerUrl(moduleID, label) {
    if (label === "typescript" || label === "javascript") {
      return "/vs/language/typescript/ts.worker.js";
    }
    return "/vs/editor/editor.worker.js";
  }
});
univer.createUnit(1 /* UNIVER_DOC */, DEFAULT_DOCUMENT_DATA_CN);
window.univer = univer;
