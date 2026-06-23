import {
  zh_CN_default,
  zh_CN_default2
} from "../chunk-FY7IHX2E.js";
import {
  createUniver
} from "../chunk-5YFFVOOZ.js";
import {
  UniverSheetsFilterPlugin
} from "../chunk-PM7HEMJK.js";
import "../chunk-LOQW54LO.js";
import "../chunk-JRQIBFK2.js";
import "../chunk-QAY465GM.js";
import {
  UniverRemoteSheetsFormulaPlugin
} from "../chunk-IUS37GUB.js";
import {
  UniverFormulaEnginePlugin,
  UniverRPCWorkerThreadPlugin,
  UniverSheetsPlugin
} from "../chunk-4P44Q6QX.js";
import {
  mergeLocales
} from "../chunk-M6CFAGRR.js";
import "../chunk-EQ2B2W73.js";
import "../chunk-HECJ2TYE.js";

// ../presets/packages/preset-sheets-core/src/worker.ts
function UniverSheetsCoreWorkerPreset(config = {}) {
  const {
    formula
  } = config;
  return {
    plugins: [
      [UniverSheetsPlugin, { onlyRegisterFormulaRelatedMutations: true }],
      [UniverFormulaEnginePlugin, { function: formula == null ? void 0 : formula.function }],
      UniverRPCWorkerThreadPlugin,
      UniverRemoteSheetsFormulaPlugin
    ]
  };
}

// ../presets/packages/preset-sheets-filter/src/worker.ts
function UniverSheetsFilterWorkerPreset() {
  return {
    plugins: [
      UniverSheetsFilterPlugin
    ]
  };
}

// src/preset-sheets-core-with-worker/worker.ts
createUniver({
  locale: "zhCN" /* ZH_CN */,
  locales: {
    zhCN: mergeLocales(
      zh_CN_default,
      zh_CN_default2
    )
  },
  presets: [
    UniverSheetsCoreWorkerPreset(),
    UniverSheetsFilterWorkerPreset()
  ]
});
