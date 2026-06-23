import {
  UniverActionRecorderPlugin
} from "./chunk-FDBIBT74.js";
import {
  UniverUniscriptPlugin
} from "./chunk-PHHMNSK5.js";
import "./chunk-R7EK2BG5.js";
import "./chunk-SQZXXC67.js";
import "./chunk-KV3ZS2HR.js";
import {
  UniverSheetsFindReplacePlugin
} from "./chunk-RWL7IRK2.js";
import {
  UniverSheetsSortUIPlugin
} from "./chunk-QS6LFNJU.js";
import {
  UniverSheetsCrosshairHighlightPlugin
} from "./chunk-Q5S3PAQG.js";
import {
  UniverDebuggerPlugin
} from "./chunk-4KZWGC4Q.js";
import {
  UniverWatermarkPlugin
} from "./chunk-WH3DHUR4.js";
import "./chunk-E4LJUPAT.js";
import {
  loadDebuggerLocale
} from "./chunk-BMEFCVUP.js";
import "./chunk-PKG62NXU.js";
import {
  UniverSheetsHyperLinkUIPlugin
} from "./chunk-C4VAWZ2H.js";
import "./chunk-JCBGZ2SK.js";
import "./chunk-NEBSOD4N.js";
import "./chunk-ADMC2PQI.js";
import "./chunk-YEVD4X4C.js";
import "./chunk-CSYKENI5.js";
import "./chunk-DXOT3Z2O.js";
import "./chunk-JL7CYBV7.js";
import "./chunk-PM7HEMJK.js";
import "./chunk-JRQIBFK2.js";
import "./chunk-IUS37GUB.js";
import "./chunk-4P44Q6QX.js";
import "./chunk-M6CFAGRR.js";
import "./chunk-EQ2B2W73.js";
import "./chunk-HECJ2TYE.js";

// src/sheets-no-worker/very-lazy.ts
var IS_E2E = false;
function getVeryLazyPlugins() {
  const plugins = [
    [UniverActionRecorderPlugin],
    [UniverSheetsHyperLinkUIPlugin],
    [UniverSheetsSortUIPlugin],
    [UniverSheetsCrosshairHighlightPlugin],
    [UniverSheetsFindReplacePlugin],
    [UniverWatermarkPlugin]
  ];
  if (!IS_E2E) {
    plugins.push([UniverDebuggerPlugin, {
      fabEntryUnitType: 2 /* UNIVER_SHEET */,
      localeLoader: loadDebuggerLocale
    }]);
    plugins.push([UniverUniscriptPlugin, {
      getWorkerUrl(_, label) {
        if (label === "json") {
          return "/vs/language/json/json.worker.js";
        }
        if (label === "css" || label === "scss" || label === "less") {
          return "/vs/language/css/css.worker.js";
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
          return "/vs/language/html/html.worker.js";
        }
        if (label === "typescript" || label === "javascript") {
          return "/vs/language/typescript/ts.worker.js";
        }
        return "/vs/editor/editor.worker.js";
      }
    }]);
  }
  return plugins;
}
export {
  getVeryLazyPlugins as default
};
