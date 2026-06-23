import {
  UniverDocsMentionUIPlugin
} from "./chunk-USCRHNX4.js";
import {
  UniverSheetsNoteUIPlugin,
  UniverSheetsTableUIPlugin
} from "./chunk-JNG6FCEO.js";
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
import "./chunk-PTDLGNGE.js";
import "./chunk-SMX4EZPQ.js";
import "./chunk-JCBGZ2SK.js";
import "./chunk-5KJD2PGF.js";
import {
  UniverSheetsFormulaUIPlugin
} from "./chunk-NEBSOD4N.js";
import "./chunk-37PIRJH5.js";
import {
  UniverSheetsDrawingUIPlugin
} from "./chunk-ADMC2PQI.js";
import "./chunk-YEVD4X4C.js";
import "./chunk-JMN42JDC.js";
import "./chunk-CSYKENI5.js";
import "./chunk-DXOT3Z2O.js";
import "./chunk-JL7CYBV7.js";
import "./chunk-PM7HEMJK.js";
import "./chunk-IUS37GUB.js";
import "./chunk-4P44Q6QX.js";
import "./chunk-M6CFAGRR.js";
import "./chunk-EQ2B2W73.js";
import "./chunk-HECJ2TYE.js";

// src/sheets-no-worker/lazy.ts
function getLazyPlugins() {
  return [
    [UniverDocsMentionUIPlugin],
    [UniverSheetsNumfmtUIPlugin],
    [UniverThreadCommentUIPlugin],
    [UniverSheetsThreadCommentUIPlugin],
    [UniverSheetsNoteUIPlugin],
    [UniverSheetsTableUIPlugin],
    [UniverSheetsFormulaUIPlugin],
    [UniverSheetsDataValidationUIPlugin],
    [UniverSheetsConditionalFormattingUIPlugin],
    [UniverSheetsFilterUIPlugin, { useRemoteFilterValuesGenerator: false }],
    [UniverSheetsDrawingUIPlugin]
  ];
}
export {
  getLazyPlugins as default
};
