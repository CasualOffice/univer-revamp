import {
  UniverSheetsConditionalFormattingUIPlugin,
  UniverSheetsDataValidationUIPlugin,
  UniverSheetsFilterUIPlugin
} from "./chunk-QWLAVJBI.js";
import "./chunk-5KJD2PGF.js";
import "./chunk-NEBSOD4N.js";
import "./chunk-37PIRJH5.js";
import {
  UniverSheetsDrawingUIPlugin
} from "./chunk-ADMC2PQI.js";
import "./chunk-YEVD4X4C.js";
import "./chunk-CSYKENI5.js";
import "./chunk-DXOT3Z2O.js";
import "./chunk-JL7CYBV7.js";
import "./chunk-PM7HEMJK.js";
import "./chunk-IUS37GUB.js";
import "./chunk-4P44Q6QX.js";
import "./chunk-M6CFAGRR.js";
import "./chunk-EQ2B2W73.js";
import "./chunk-HECJ2TYE.js";

// src/sheets-multi-units/lazy.ts
function getLazyPlugins() {
  return [
    [UniverSheetsDataValidationUIPlugin],
    [UniverSheetsConditionalFormattingUIPlugin],
    [UniverSheetsFilterUIPlugin, { useRemoteFilterValuesGenerator: false }],
    [UniverSheetsDrawingUIPlugin]
  ];
}
export {
  getLazyPlugins as default
};
