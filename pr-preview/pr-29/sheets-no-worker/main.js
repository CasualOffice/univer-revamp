import "../chunk-6VTURTLM.js";
import "../chunk-Q5S3PAQG.js";
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
  DEFAULT_WORKBOOK_DATA_DEMO,
  loadDebuggerLocale
} from "../chunk-BMEFCVUP.js";
import "../chunk-NQVJQYNC.js";
import "../chunk-KVDFTFRD.js";
import {
  UniverSheetsNotePlugin,
  UniverSheetsTablePlugin
} from "../chunk-PTDLGNGE.js";
import "../chunk-VFHOZR32.js";
import {
  UniverSheetsThreadCommentPlugin
} from "../chunk-SMX4EZPQ.js";
import "../chunk-PKG62NXU.js";
import {
  UniverSheetsHyperLinkPlugin
} from "../chunk-C4VAWZ2H.js";
import {
  UniverSheetsSortPlugin
} from "../chunk-JCBGZ2SK.js";
import {
  UniverSheetsConditionalFormattingPlugin
} from "../chunk-5KJD2PGF.js";
import "../chunk-NEBSOD4N.js";
import {
  UniverSheetsNumfmtPlugin
} from "../chunk-37PIRJH5.js";
import "../chunk-ADMC2PQI.js";
import {
  UniverSheetsUIPlugin
} from "../chunk-YEVD4X4C.js";
import "../chunk-IMWY7PB3.js";
import "../chunk-U72QXM4I.js";
import {
  UniverNetworkPlugin
} from "../chunk-ZLGT6G56.js";
import "../chunk-JMN42JDC.js";
import "../chunk-CSYKENI5.js";
import {
  UniverDocsPlugin,
  UniverDocsUIPlugin,
  UniverSheetsDataValidationPlugin
} from "../chunk-DXOT3Z2O.js";
import "../chunk-WRDP6BX6.js";
import "../chunk-LI6UXASZ.js";
import {
  UniverUIPlugin
} from "../chunk-JL7CYBV7.js";
import {
  UniverSheetsFilterPlugin
} from "../chunk-PM7HEMJK.js";
import "../chunk-LOQW54LO.js";
import {
  FUniver
} from "../chunk-JRQIBFK2.js";
import "../chunk-QAY465GM.js";
import {
  UniverSheetsFormulaPlugin
} from "../chunk-IUS37GUB.js";
import {
  UniverFormulaEnginePlugin,
  UniverRPCMainThreadPlugin,
  UniverSheetsPlugin
} from "../chunk-4P44Q6QX.js";
import {
  Univer,
  UniverRenderEnginePlugin,
  UserManagerService
} from "../chunk-M6CFAGRR.js";
import "../chunk-EQ2B2W73.js";
import "../chunk-HECJ2TYE.js";

// src/sheets-no-worker/main.ts
var IS_E2E = false;
var LOAD_LAZY_PLUGINS_TIMEOUT = 100;
var LOAD_VERY_LAZY_PLUGINS_TIMEOUT = 1e3;
var mockUser = {
  userID: "Owner_qxVnhPbQ",
  name: "Owner",
  avatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAInSURBVHgBtZU9TxtBEIbfWRzFSIdkikhBSqRQkJqkCKTCFkqVInSUSaT0wC8w/gXxD4gU2nRJkXQWhAZowDUUWKIwEgWWbEEB3mVmx3dn4DA2nB/ppNuPeWd29mMIPXDr+RxwtgRHeW6+guNPRxogqnL7Dwz9psJ27S4NShaeZTH3kwXy6I81dlRKcmRui88swdq9AcSFL7Buz1Vmlns64MiLsCjzwnIYHLH57tbfFbs7KRaXyEU8FVZofqccOfA5l7Q8LPIkGrwnb2RPNEXWFVMUF3L+kDCk0btDDAMzOm5YfAHDwp4tG74wnzAsiOYMnJ3GoDybA7IT98/jm5+JNnfiIzAS6LlqHQBN/i6b2t/cV1Hh6BfwYlHnHP4AXi5q/8kmMMpOs8+BixZw/Fd6xUEHEbnkgclvQP2fGp7uShRKnQ3G32rkjV1th8JhIGG7tR/JyjGteSOZELwGMmNqIIigRCLRh2OZIE6BjItdd7pCW6Uhm1zzkUtungSxwEUzNpQ+GQumtH1ej1MqgmNT6vwmhCq5yuwq56EYTbgeQUz3yvrpV1b4ok3nYJ+eYhgYmjRUqErx2EDq0Fr8FhG++iqVGqxlUJI/70Ar0UgJaWHj6hYVHJrfKssAHot1JfqwE9WVWzXZVd5z2Ws/4PnmtEjkXeKJDvxUecLbWOXH/DP6QQ4J72NS0adedp1aseBfXP8odlZFfPvBF7SN/8hky1TYuPOAXAEipMx15u5ToAAAAABJRU5ErkJggg==",
  anonymous: false,
  canBindAnonymous: false
};
function createNewInstance() {
  const univer = new Univer({
    // theme: greenTheme,
    darkMode: localStorage.getItem("local.darkMode") === "dark",
    locale: "zhCN" /* ZH_CN */,
    locales: {
      ["zhCN" /* ZH_CN */]: zh_CN_default
    },
    logLevel: 4 /* VERBOSE */
  });
  const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
  univer.registerPlugin(UniverRPCMainThreadPlugin, { workerURL: worker });
  univer.registerPlugin(UniverDocsPlugin);
  univer.registerPlugin(UniverRenderEnginePlugin);
  univer.registerPlugin(UniverUIPlugin, {
    container: "app",
    ribbonType: "classic"
  });
  univer.registerPlugin(UniverDocsUIPlugin);
  univer.registerPlugin(UniverSheetsPlugin, {
    autoHeightForMergedCells: true
  });
  univer.registerPlugin(UniverSheetsUIPlugin);
  univer.registerPlugin(UniverSheetsNumfmtPlugin);
  univer.registerPlugin(UniverFormulaEnginePlugin);
  univer.registerPlugin(UniverSheetsFormulaPlugin, { writeArrayFormulaToSnapshot: true });
  univer.registerPlugin(UniverSheetsDataValidationPlugin);
  univer.registerPlugin(UniverSheetsConditionalFormattingPlugin);
  univer.registerPlugin(UniverSheetsFilterPlugin);
  univer.registerPlugin(UniverSheetsSortPlugin);
  univer.registerPlugin(UniverSheetsHyperLinkPlugin);
  univer.registerPlugin(UniverSheetsThreadCommentPlugin);
  univer.registerPlugin(UniverSheetsTablePlugin);
  univer.registerPlugin(UniverNetworkPlugin);
  univer.registerPlugin(UniverSheetsNotePlugin);
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
  const injector = univer.__getInjector();
  const userManagerService = injector.get(UserManagerService);
  userManagerService.setCurrentUser(mockUser);
  if (!IS_E2E) {
    univer.createUnit(2 /* UNIVER_SHEET */, DEFAULT_WORKBOOK_DATA_DEMO);
  }
  setTimeout(() => {
    import("../lazy-5EJXCQOK.js").then((lazy) => {
      const plugins = lazy.default();
      plugins.forEach((p) => univer.registerPlugin(p[0], p[1]));
    });
  }, LOAD_LAZY_PLUGINS_TIMEOUT);
  setTimeout(() => {
    import("../very-lazy-EXIOIAWU.js").then((lazy) => {
      const plugins = lazy.default();
      plugins.forEach((p) => univer.registerPlugin(p[0], p[1]));
    });
  }, LOAD_VERY_LAZY_PLUGINS_TIMEOUT);
  univer.onDispose(() => {
    worker.terminate();
    window.univer = void 0;
    window.univerAPI = void 0;
  });
  window.univer = univer;
  window.univerAPI = FUniver.newAPI(univer);
}
createNewInstance();
window.createNewInstance = createNewInstance;
export {
  mockUser
};
