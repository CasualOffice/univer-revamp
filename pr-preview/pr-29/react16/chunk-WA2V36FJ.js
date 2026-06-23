import {
  SetActiveCommentOperation,
  ThreadCommentPanel,
  ThreadCommentPanelService,
  UniverThreadCommentUIPlugin
} from "./chunk-5CKCHV6U.js";
import {
  AddCommentMutation,
  IThreadCommentDataSourceService,
  ThreadCommentModel,
  getDT
} from "./chunk-JMN42JDC.js";
import {
  DOC_INTERCEPTOR_POINT,
  DocBackScrollRenderController,
  DocCanvasPopManagerService,
  DocEventManagerService,
  DocInterceptorService,
  DocRenderController,
  DocSelectionManagerService,
  DocSelectionRenderService,
  DocSkeletonManagerService,
  EMPTY_PARAGRAPH_MENU_ID,
  FLOAT_TOOLBAR_MENU_POSITION,
  INSERT_BELLOW_MENU_ID,
  RichTextEditingMutation,
  SetTextSelectionsOperation,
  addCustomDecorationBySelectionFactory,
  addCustomRangeBySelectionFactory,
  deleteCustomDecorationFactory,
  deleteCustomRangeFactory,
  replaceSelectionFactory,
  whenDocAndEditorFocused
} from "./chunk-DXOT3Z2O.js";
import {
  Button,
  CommentIcon,
  ComponentManager,
  CopyIcon,
  FormLayout,
  IMenuManagerService,
  IMessageService,
  IShortcutService,
  ISidebarService,
  IconManager,
  Input,
  LinkIcon,
  Tooltip,
  UnlinkIcon,
  WriteIcon,
  borderClassName,
  clsx,
  getMenuHiddenObservable,
  require_jsx_runtime,
  require_react,
  useDependency,
  useObservable
} from "./chunk-JL7CYBV7.js";
import {
  BehaviorSubject,
  BuildTextUtils,
  DOCS_NORMAL_EDITOR_UNIT_ID_KEY,
  DependentOn,
  Disposable,
  ICommandService,
  IConfigService,
  IRenderManagerService,
  IResourceManagerService,
  IUniverInstanceService,
  Inject,
  Injector,
  LocaleService,
  Observable,
  Plugin,
  SHEET_EDITOR_UNITS,
  Tools,
  UserManagerService,
  debounceTime,
  distinctUntilChanged,
  filter,
  generateRandomId,
  getBodySlice,
  isInternalEditorID,
  isSafeUrl,
  merge_default,
  pairwise,
  sequenceExecute,
  withCurrentTypeOfRenderer
} from "./chunk-M6CFAGRR.js";
import {
  __decorateClass,
  __decorateParam,
  __publicField,
  __toESM
} from "./chunk-HECJ2TYE.js";

// ../packages/docs-hyper-link/package.json
var package_default = {
  name: "@univerjs/docs-hyper-link",
  version: "0.25.0",
  private: false,
  description: "Hyperlink model and commands for Univer Docs.",
  author: "DreamNum Co., Ltd. <developer@univer.ai>",
  license: "Apache-2.0",
  funding: {
    type: "opencollective",
    url: "https://opencollective.com/univer"
  },
  homepage: "https://univer.ai",
  repository: {
    type: "git",
    url: "https://github.com/dream-num/univer"
  },
  bugs: {
    url: "https://github.com/dream-num/univer/issues"
  },
  keywords: [
    "univer",
    "docs",
    "hyperlink",
    "link",
    "plugin"
  ],
  exports: {
    ".": "./src/index.ts",
    "./*": "./src/*"
  },
  main: "./src/index.ts",
  types: "./lib/types/index.d.ts",
  publishConfig: {
    access: "public",
    main: "./lib/es/index.js",
    module: "./lib/es/index.js",
    exports: {
      ".": {
        import: "./lib/es/index.js",
        require: "./lib/cjs/index.js",
        types: "./lib/types/index.d.ts"
      },
      "./*": {
        import: "./lib/es/*",
        require: "./lib/cjs/*",
        types: "./lib/types/index.d.ts"
      },
      "./lib/*": "./lib/*"
    }
  },
  directories: {
    lib: "lib"
  },
  files: [
    "lib"
  ],
  scripts: {
    test: "vitest run",
    "test:watch": "vitest",
    coverage: "vitest run --coverage",
    typecheck: "tsc --noEmit",
    "build:bundle": "univer-cli build",
    "build:types": "tsc -p tsconfig.node.json",
    build: "pnpm run build:bundle && pnpm run build:types"
  },
  dependencies: {
    "@univerjs/core": "workspace:*"
  },
  devDependencies: {
    "@univerjs-infra/shared": "workspace:*",
    typescript: "^6.0.3",
    vitest: "^4.1.9"
  }
};

// ../packages/docs-hyper-link/src/commands/mutations/hyper-link.mutation.ts
var AddHyperLinkMuatation = {
  id: "docs.mutation.add-hyper-link",
  type: 2 /* MUTATION */,
  handler: () => {
    return true;
  }
};
var UpdateHyperLinkMuatation = {
  id: "docs.mutation.update-hyper-link",
  type: 2 /* MUTATION */,
  handler: () => {
    return true;
  }
};
var DeleteHyperLinkMuatation = {
  id: "docs.mutation.delete-hyper-link",
  type: 2 /* MUTATION */,
  handler: () => {
    return true;
  }
};

// ../packages/docs-hyper-link/src/config/config.ts
var DOCS_HYPER_LINK_PLUGIN_CONFIG_KEY = "docs-hyper-link.config";
var configSymbol = Symbol(DOCS_HYPER_LINK_PLUGIN_CONFIG_KEY);
var defaultPluginConfig = {};

// ../packages/docs-hyper-link/src/controllers/resource.controller.ts
var DOC_HYPER_LINK_PLUGIN = "DOC_HYPER_LINK_PLUGIN";
var DocHyperLinkResourceController = class extends Disposable {
  constructor(_resourceManagerService, _univerInstanceService) {
    super();
    __publicField(this, "_resourceManagerService", _resourceManagerService);
    __publicField(this, "_univerInstanceService", _univerInstanceService);
    this._init();
  }
  _init() {
    this._resourceManagerService.registerPluginResource({
      pluginName: DOC_HYPER_LINK_PLUGIN,
      businesses: [1 /* UNIVER_DOC */],
      onLoad: (unitID, resource) => {
        const doc = this._univerInstanceService.getUnit(unitID, 1 /* UNIVER_DOC */);
        if (!doc) {
          return;
        }
        const customRangeMap = /* @__PURE__ */ new Map();
        const handleDoc = (model) => {
          var _a, _b;
          (_b = (_a = model.getBody()) == null ? void 0 : _a.customRanges) == null ? void 0 : _b.forEach((customRange) => {
            if (customRange.rangeType === 0 /* HYPERLINK */) {
              customRangeMap.set(customRange.rangeId, customRange);
            }
          });
          return customRangeMap;
        };
        doc.headerModelMap.forEach((headerModel) => {
          handleDoc(headerModel);
        });
        doc.footerModelMap.forEach((footerModel) => {
          handleDoc(footerModel);
        });
        handleDoc(doc);
        resource.links.forEach((link) => {
          const customRange = customRangeMap.get(link.id);
          if (customRange) {
            customRange.properties = {
              ...customRange.properties,
              url: link.payload
            };
          }
        });
      },
      onUnLoad: (unitID) => {
      },
      toJson: (unitID) => {
        const doc = this._univerInstanceService.getUnit(unitID, 1 /* UNIVER_DOC */);
        const links = [];
        if (doc) {
          const handleDoc = (model) => {
            var _a, _b;
            (_b = (_a = model.getBody()) == null ? void 0 : _a.customRanges) == null ? void 0 : _b.forEach((customRange) => {
              var _a2;
              if (customRange.rangeType === 0 /* HYPERLINK */) {
                links.push({
                  id: customRange.rangeId,
                  payload: ((_a2 = customRange.properties) == null ? void 0 : _a2.url) || ""
                });
              }
            });
          };
          doc.headerModelMap.forEach((headerModel) => {
            handleDoc(headerModel);
          });
          doc.footerModelMap.forEach((footerModel) => {
            handleDoc(footerModel);
          });
          handleDoc(doc);
        }
        return JSON.stringify({ links });
      },
      parseJson(bytes) {
        return JSON.parse(bytes);
      }
    });
  }
};
DocHyperLinkResourceController = __decorateClass([
  __decorateParam(0, Inject(IResourceManagerService)),
  __decorateParam(1, IUniverInstanceService)
], DocHyperLinkResourceController);

// ../packages/docs-hyper-link/src/plugin.ts
var UniverDocsHyperLinkPlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig, _injector, _configService, _commandService) {
    super();
    __publicField(this, "_config", _config);
    __publicField(this, "_injector", _injector);
    __publicField(this, "_configService", _configService);
    __publicField(this, "_commandService", _commandService);
    const { ...rest } = merge_default(
      {},
      defaultPluginConfig,
      this._config
    );
    this._configService.setConfig(DOCS_HYPER_LINK_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    const deps = [[DocHyperLinkResourceController]];
    deps.forEach((dep) => this._injector.add(dep));
    [AddHyperLinkMuatation, DeleteHyperLinkMuatation, UpdateHyperLinkMuatation].forEach((mutation) => {
      this.disposeWithMe(this._commandService.registerCommand(mutation));
    });
    this._injector.get(DocHyperLinkResourceController);
  }
};
__publicField(UniverDocsHyperLinkPlugin, "pluginName", DOC_HYPER_LINK_PLUGIN);
__publicField(UniverDocsHyperLinkPlugin, "packageName", package_default.name);
__publicField(UniverDocsHyperLinkPlugin, "version", package_default.version);
__publicField(UniverDocsHyperLinkPlugin, "type", 1 /* UNIVER_DOC */);
UniverDocsHyperLinkPlugin = __decorateClass([
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, IConfigService),
  __decorateParam(3, ICommandService)
], UniverDocsHyperLinkPlugin);

// ../packages/docs-hyper-link-ui/package.json
var package_default2 = {
  name: "@univerjs/docs-hyper-link-ui",
  version: "0.25.0",
  private: false,
  description: "Hyperlink editing UI for Univer Docs.",
  author: "DreamNum Co., Ltd. <developer@univer.ai>",
  license: "Apache-2.0",
  funding: {
    type: "opencollective",
    url: "https://opencollective.com/univer"
  },
  homepage: "https://univer.ai",
  repository: {
    type: "git",
    url: "https://github.com/dream-num/univer"
  },
  bugs: {
    url: "https://github.com/dream-num/univer/issues"
  },
  keywords: [
    "univer",
    "docs",
    "hyperlink",
    "link",
    "ui"
  ],
  exports: {
    ".": "./src/index.ts",
    "./*": "./src/*",
    "./locale/*": "./src/locale/*.ts"
  },
  main: "./src/index.ts",
  types: "./lib/types/index.d.ts",
  publishConfig: {
    access: "public",
    main: "./lib/es/index.js",
    module: "./lib/es/index.js",
    exports: {
      ".": {
        import: "./lib/es/index.js",
        require: "./lib/cjs/index.js",
        types: "./lib/types/index.d.ts"
      },
      "./*": {
        import: "./lib/es/*",
        require: "./lib/cjs/*",
        types: "./lib/types/index.d.ts"
      },
      "./locale/*": {
        import: "./lib/es/locale/*.js",
        require: "./lib/cjs/locale/*.js",
        types: "./lib/types/locale/*.d.ts"
      },
      "./lib/*": "./lib/*"
    }
  },
  directories: {
    lib: "lib"
  },
  files: [
    "lib"
  ],
  scripts: {
    test: "vitest run",
    "test:watch": "vitest",
    coverage: "vitest run --coverage",
    typecheck: "tsc --noEmit",
    "build:bundle": "univer-cli build",
    "build:types": "tsc -p tsconfig.node.json",
    build: "pnpm run build:bundle && pnpm run build:types"
  },
  peerDependencies: {
    react: "^16.9.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc",
    rxjs: ">=7.0.0"
  },
  dependencies: {
    "@univerjs/core": "workspace:*",
    "@univerjs/design": "workspace:*",
    "@univerjs/docs": "workspace:*",
    "@univerjs/docs-hyper-link": "workspace:*",
    "@univerjs/docs-ui": "workspace:*",
    "@univerjs/engine-render": "workspace:*",
    "@univerjs/icons": "1.12.0",
    "@univerjs/ui": "workspace:*"
  },
  devDependencies: {
    "@univerjs-infra/shared": "workspace:*",
    postcss: "^8.5.15",
    react: "18.3.1",
    rxjs: "^7.8.2",
    tailwindcss: "3.4.18",
    typescript: "^6.0.3",
    vitest: "^4.1.9"
  }
};

// ../packages/docs-hyper-link-ui/src/config/config.ts
var DOCS_HYPER_LINK_UI_PLUGIN_CONFIG_KEY = "docs-hyper-link-ui.config";
var configSymbol2 = Symbol(DOCS_HYPER_LINK_UI_PLUGIN_CONFIG_KEY);
var defaultPluginConfig2 = {};

// ../packages/docs-hyper-link-ui/src/views/DocHyperLinkEdit.tsx
var import_react = __toESM(require_react());

// ../packages/docs-hyper-link-ui/src/commands/commands/add-link.command.ts
var AddDocHyperLinkCommand = {
  type: 0 /* COMMAND */,
  id: "docs.command.add-hyper-link",
  async handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { payload, unitId, selections } = params;
    const commandService = accessor.get(ICommandService);
    const id = generateRandomId();
    const doMutation = addCustomRangeBySelectionFactory(
      accessor,
      {
        rangeId: id,
        rangeType: 0 /* HYPERLINK */,
        properties: {
          url: payload
        },
        unitId,
        selections
      }
    );
    if (doMutation) {
      return commandService.syncExecuteCommand(doMutation.id, doMutation.params);
    }
    return false;
  }
};

// ../packages/docs-hyper-link-ui/src/commands/commands/update-link.command.ts
var UpdateDocHyperLinkCommand = {
  id: "docs.command.update-hyper-link",
  type: 0 /* COMMAND */,
  handler(accessor, params) {
    var _a;
    if (!params) {
      return false;
    }
    const { unitId, payload, segmentId, linkId } = params;
    const commandService = accessor.get(ICommandService);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const docSelectionManagerService = accessor.get(DocSelectionManagerService);
    const currentSelection = docSelectionManagerService.getActiveTextRange();
    const doc = univerInstanceService.getUnit(unitId, 1 /* UNIVER_DOC */);
    if (!currentSelection || !doc) {
      return false;
    }
    const oldBody = getBodySlice(doc.getSelfOrHeaderFooterModel(segmentId).getBody(), currentSelection.startOffset, currentSelection.endOffset);
    const textRun = (_a = oldBody.textRuns) == null ? void 0 : _a[0];
    if (textRun) {
      textRun.ed = params.label.length + 1;
    }
    const replaceSelection = replaceSelectionFactory(accessor, {
      unitId,
      body: {
        dataStream: `${params.label}`,
        customRanges: [{
          rangeId: linkId,
          rangeType: 0 /* HYPERLINK */,
          startIndex: 0,
          endIndex: params.label.length + 1,
          properties: {
            url: payload
          }
        }],
        textRuns: textRun ? [textRun] : void 0
      },
      selection: {
        startOffset: currentSelection.startOffset,
        endOffset: currentSelection.endOffset,
        collapsed: false,
        segmentId
      }
    });
    if (!replaceSelection) {
      return false;
    }
    return commandService.syncExecuteCommand(replaceSelection.id, replaceSelection.params);
  }
};

// ../packages/docs-hyper-link-ui/src/commands/commands/delete-link.command.ts
var DeleteDocHyperLinkCommand = {
  type: 0 /* COMMAND */,
  id: "docs.command.delete-hyper-link",
  async handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { unitId, linkId, segmentId } = params;
    const commandService = accessor.get(ICommandService);
    const doMutation = deleteCustomRangeFactory(accessor, { unitId, rangeId: linkId, segmentId });
    if (!doMutation) {
      return false;
    }
    return await commandService.syncExecuteCommand(doMutation.id, doMutation.params);
  }
};

// ../packages/docs-hyper-link-ui/src/commands/operations/popup.operation.ts
var shouldDisableAddLink = (accessor) => {
  const textSelectionService = accessor.get(DocSelectionManagerService);
  const univerInstanceService = accessor.get(IUniverInstanceService);
  const textRanges = textSelectionService.getTextRanges();
  if (!(textRanges == null ? void 0 : textRanges.length)) {
    return true;
  }
  const activeRange = textRanges[0];
  const doc = univerInstanceService.getCurrentUnitOfType(1 /* UNIVER_DOC */);
  if (!doc || !activeRange || activeRange.collapsed) {
    return true;
  }
  return false;
};
var ShowDocHyperLinkEditPopupOperation = {
  type: 1 /* OPERATION */,
  id: "doc.operation.show-hyper-link-edit-popup",
  handler(accessor, params) {
    var _a;
    const linkInfo = params == null ? void 0 : params.link;
    const univerInstanceService = accessor.get(IUniverInstanceService);
    if (shouldDisableAddLink(accessor) && !linkInfo) {
      return false;
    }
    const hyperLinkService = accessor.get(DocHyperLinkPopupService);
    const unitId = (linkInfo == null ? void 0 : linkInfo.unitId) || ((_a = univerInstanceService.getCurrentUnitOfType(1 /* UNIVER_DOC */)) == null ? void 0 : _a.getUnitId());
    if (!unitId) {
      return false;
    }
    hyperLinkService.showEditPopup(unitId, linkInfo);
    return true;
  }
};
var ToggleDocHyperLinkInfoPopupOperation = {
  type: 1 /* OPERATION */,
  id: "doc.operation.toggle-hyper-link-info-popup",
  handler(accessor, params) {
    const hyperLinkService = accessor.get(DocHyperLinkPopupService);
    if (!params) {
      hyperLinkService.hideInfoPopup();
      return true;
    }
    hyperLinkService.showInfoPopup(params);
    return true;
  }
};
var ClickDocHyperLinkOperation = {
  type: 1 /* OPERATION */,
  id: "doc.operation.click-hyper-link",
  handler(accessor, params) {
    var _a, _b, _c;
    if (!params) {
      return false;
    }
    const { unitId, linkId, segmentId } = params;
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const doc = univerInstanceService.getUnit(unitId, 1 /* UNIVER_DOC */);
    const body = doc == null ? void 0 : doc.getSelfOrHeaderFooterModel(segmentId).getBody();
    const link = (_c = (_b = (_a = body == null ? void 0 : body.customRanges) == null ? void 0 : _a.find((range) => range.rangeId === linkId && range.rangeType === 0 /* HYPERLINK */)) == null ? void 0 : _b.properties) == null ? void 0 : _c.url;
    if (!isSafeUrl(link)) {
      return false;
    }
    window.open(link, "_blank", "noopener noreferrer");
    return true;
  }
};

// ../packages/docs-hyper-link-ui/src/views/DocLinkPopup.tsx
var import_jsx_runtime = __toESM(require_jsx_runtime());
var DocLinkPopup = () => {
  var _a, _b;
  const hyperLinkService = useDependency(DocHyperLinkPopupService);
  const commandService = useDependency(ICommandService);
  const messageService = useDependency(IMessageService);
  const localeService = useDependency(LocaleService);
  const currentPopup = useObservable(hyperLinkService.showingLink$);
  const univerInstanceService = useDependency(IUniverInstanceService);
  if (!currentPopup) {
    return null;
  }
  const { unitId, linkId, segmentId, startIndex, endIndex } = currentPopup;
  const doc = univerInstanceService.getUnit(unitId, 1 /* UNIVER_DOC */);
  const body = doc == null ? void 0 : doc.getSelfOrHeaderFooterModel(segmentId).getBody();
  const link = (_a = body == null ? void 0 : body.customRanges) == null ? void 0 : _a.find((range) => range.rangeId === linkId && range.rangeType === 0 /* HYPERLINK */ && range.startIndex === startIndex && range.endIndex === endIndex);
  if (!link) {
    return null;
  }
  const url = (_b = link.properties) == null ? void 0 : _b.url;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: clsx(`univer-box-border univer-flex univer-max-w-80 univer-items-center univer-justify-between univer-overflow-hidden univer-rounded-lg univer-bg-white univer-p-3 univer-shadow dark:!univer-bg-gray-900`, borderClassName),
      onClick: () => {
        hyperLinkService.hideInfoPopup();
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "div",
          {
            className: `univer-flex univer-h-6 univer-flex-1 univer-cursor-pointer univer-items-center univer-truncate univer-text-sm univer-leading-5 univer-text-primary-500`,
            onClick: () => window.open(url, void 0, "noopener noreferrer"),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "div",
                {
                  className: `univer-mr-2 univer-flex univer-size-5 univer-flex-[0_0_auto] univer-items-center univer-justify-center univer-text-base univer-text-gray-900 dark:!univer-text-white`,
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkIcon, {})
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { showIfEllipsis: true, title: url, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "univer-flex-1 univer-truncate", children: url }) })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "univer-flex univer-h-6 univer-flex-[0_0_auto] univer-items-center univer-justify-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: `univer-ml-2 univer-flex univer-size-6 univer-cursor-pointer univer-items-center univer-justify-center univer-rounded univer-text-base`,
              onClick: () => {
                navigator.clipboard.writeText(url);
                messageService.show({
                  content: localeService.t("docs-hyper-link-ui.info.coped"),
                  type: "info" /* Info */
                });
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { placement: "bottom", title: localeService.t("docs-hyper-link-ui.info.copy"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyIcon, {}) })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: `univer-ml-2 univer-flex univer-size-6 univer-cursor-pointer univer-items-center univer-justify-center univer-rounded univer-text-base`,
              onClick: () => {
                commandService.executeCommand(ShowDocHyperLinkEditPopupOperation.id, {
                  link: currentPopup
                });
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { placement: "bottom", title: localeService.t("docs-hyper-link-ui.info.edit"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WriteIcon, {}) })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: `univer-ml-2 univer-flex univer-size-6 univer-cursor-pointer univer-items-center univer-justify-center univer-rounded univer-text-base`,
              onClick: () => {
                commandService.executeCommand(DeleteDocHyperLinkCommand.id, {
                  unitId,
                  linkId: link.rangeId,
                  segmentId
                });
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { placement: "bottom", title: localeService.t("docs-hyper-link-ui.info.cancel"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnlinkIcon, {}) })
            }
          )
        ] })
      ]
    }
  );
};
DocLinkPopup.componentKey = "univer.doc.link-info-popup";

// ../packages/docs-hyper-link-ui/src/services/hyper-link-popup.service.ts
var DocHyperLinkPopupService = class extends Disposable {
  constructor(_docCanvasPopupManagerService, _textSelectionManagerService, _univerInstanceService) {
    super();
    __publicField(this, "_docCanvasPopupManagerService", _docCanvasPopupManagerService);
    __publicField(this, "_textSelectionManagerService", _textSelectionManagerService);
    __publicField(this, "_univerInstanceService", _univerInstanceService);
    __publicField(this, "_editingLink$", new BehaviorSubject(null));
    __publicField(this, "_showingLink$", new BehaviorSubject(null));
    __publicField(this, "editingLink$", this._editingLink$.asObservable());
    __publicField(this, "showingLink$", this._showingLink$.asObservable());
    __publicField(this, "_editPopup", null);
    __publicField(this, "_infoPopup", null);
    this.disposeWithMe(() => {
      this._editingLink$.complete();
      this._showingLink$.complete();
    });
  }
  get editing() {
    return this._editingLink$.value;
  }
  get showing() {
    return this._showingLink$.value;
  }
  showEditPopup(unitId, linkInfo) {
    if (this._editPopup) {
      this._editPopup.dispose();
    }
    this._editingLink$.next(linkInfo);
    const textRanges = this._textSelectionManagerService.getTextRanges({ unitId, subUnitId: unitId });
    let activeRange = textRanges == null ? void 0 : textRanges[textRanges.length - 1];
    if (linkInfo) {
      const { segmentId, segmentPage, startIndex, endIndex } = linkInfo;
      activeRange = {
        collapsed: false,
        startOffset: startIndex,
        endOffset: endIndex + 1,
        segmentId,
        segmentPage
      };
      this._textSelectionManagerService.replaceDocRanges([{
        startOffset: startIndex,
        endOffset: endIndex + 1
      }]);
    }
    if (activeRange) {
      this._editPopup = this._docCanvasPopupManagerService.attachPopupToRange(
        activeRange,
        {
          componentKey: DocHyperLinkEdit.componentKey,
          direction: "bottom"
        },
        unitId
      );
      return this._editPopup;
    }
    return null;
  }
  hideEditPopup() {
    var _a;
    this._editingLink$.next(null);
    (_a = this._editPopup) == null ? void 0 : _a.dispose();
  }
  showInfoPopup(info) {
    var _a, _b, _c, _d, _e, _f;
    const { linkId, unitId, segmentId, segmentPage, startIndex, endIndex } = info;
    if (((_a = this.showing) == null ? void 0 : _a.linkId) === linkId && ((_b = this.showing) == null ? void 0 : _b.unitId) === unitId && ((_c = this.showing) == null ? void 0 : _c.segmentId) === segmentId && ((_d = this.showing) == null ? void 0 : _d.segmentPage) === segmentPage && ((_e = this.showing) == null ? void 0 : _e.startIndex) === startIndex && ((_f = this.showing) == null ? void 0 : _f.endIndex) === endIndex) {
      return;
    }
    if (this._infoPopup) {
      this._infoPopup.dispose();
    }
    const doc = this._univerInstanceService.getUnit(unitId, 1 /* UNIVER_DOC */);
    if (!doc) {
      return;
    }
    this._showingLink$.next({ unitId, linkId, segmentId, segmentPage, startIndex, endIndex });
    this._infoPopup = this._docCanvasPopupManagerService.attachPopupToRange(
      {
        collapsed: false,
        startOffset: startIndex,
        endOffset: endIndex + 1,
        segmentId,
        segmentPage
      },
      {
        componentKey: DocLinkPopup.componentKey,
        direction: "top-center",
        multipleDirection: "top",
        onClickOutside: () => {
          this.hideInfoPopup();
        }
      },
      unitId
    );
    return this._infoPopup;
  }
  hideInfoPopup() {
    var _a;
    this._showingLink$.next(null);
    (_a = this._infoPopup) == null ? void 0 : _a.dispose();
  }
};
DocHyperLinkPopupService = __decorateClass([
  __decorateParam(0, Inject(DocCanvasPopManagerService)),
  __decorateParam(1, Inject(DocSelectionManagerService)),
  __decorateParam(2, IUniverInstanceService)
], DocHyperLinkPopupService);

// ../packages/docs-hyper-link-ui/src/views/hyper-link-edit/utils.ts
function isBlankInput(value) {
  return value.trim().length === 0;
}

// ../packages/docs-hyper-link-ui/src/views/DocHyperLinkEdit.tsx
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
function hasProtocol(urlString) {
  const pattern = /^[a-zA-Z]+:\/\//;
  return pattern.test(urlString);
}
function isEmail(url) {
  const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return pattern.test(url);
}
function transformUrl(urlStr) {
  return hasProtocol(urlStr) ? urlStr : isEmail(urlStr) ? `mailto://${urlStr}` : `https://${urlStr}`;
}
var DocHyperLinkEdit = () => {
  const hyperLinkService = useDependency(DocHyperLinkPopupService);
  const localeService = useDependency(LocaleService);
  const editing = useObservable(hyperLinkService.editingLink$);
  const commandService = useDependency(ICommandService);
  const univerInstanceService = useDependency(IUniverInstanceService);
  const docSelectionManagerService = useDependency(DocSelectionManagerService);
  const [link, setLink] = (0, import_react.useState)("");
  const [label, setLabel] = (0, import_react.useState)("");
  const [showError, setShowError] = (0, import_react.useState)(false);
  const isLegal = Tools.isLegalUrl(link);
  const doc = editing ? univerInstanceService.getUnit(editing.unitId, 1 /* UNIVER_DOC */) : univerInstanceService.getCurrentUnitOfType(1 /* UNIVER_DOC */);
  (0, import_react.useEffect)(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    const activeRange = docSelectionManagerService.getActiveTextRange();
    if (!activeRange) {
      return;
    }
    if (editing) {
      const body2 = (_a = doc == null ? void 0 : doc.getSelfOrHeaderFooterModel(editing.segmentId)) == null ? void 0 : _a.getBody();
      const matchedRange2 = (_b = body2 == null ? void 0 : body2.customRanges) == null ? void 0 : _b.find((i) => (editing == null ? void 0 : editing.linkId) === i.rangeId && i.startIndex === editing.startIndex && i.endIndex === editing.endIndex);
      if (doc && matchedRange2) {
        setLink((_d = (_c = matchedRange2.properties) == null ? void 0 : _c.url) != null ? _d : "");
        setLabel(BuildTextUtils.transform.getPlainText(getBodySlice(body2, matchedRange2.startIndex, matchedRange2.endIndex + 1).dataStream));
      }
      return;
    }
    const body = (_e = doc == null ? void 0 : doc.getSelfOrHeaderFooterModel(activeRange.segmentId)) == null ? void 0 : _e.getBody();
    const selection = body ? activeRange : null;
    const matchedRange = selection && ((_g = BuildTextUtils.customRange.getCustomRangesInterestsWithSelection(selection, (_f = body == null ? void 0 : body.customRanges) != null ? _f : [])) == null ? void 0 : _g[0]);
    if (doc && matchedRange) {
      setLink((_i = (_h = matchedRange == null ? void 0 : matchedRange.properties) == null ? void 0 : _h.url) != null ? _i : "");
    }
  }, [doc, editing, docSelectionManagerService, univerInstanceService]);
  const handleCancel = () => {
    hyperLinkService.hideEditPopup();
  };
  const handleConfirm = () => {
    setShowError(true);
    if (!isLegal || !doc) {
      return;
    }
    const linkFinal = transformUrl(link);
    if (!editing) {
      commandService.executeCommand(AddDocHyperLinkCommand.id, {
        unitId: doc.getUnitId(),
        payload: linkFinal
      });
    } else {
      if (isBlankInput(label)) {
        return;
      }
      commandService.executeCommand(UpdateDocHyperLinkCommand.id, {
        unitId: doc.getUnitId(),
        payload: linkFinal,
        linkId: editing.linkId,
        label,
        segmentId: editing.segmentId
      });
    }
    hyperLinkService.hideEditPopup();
  };
  if (!doc) {
    return;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "div",
    {
      className: clsx(`univer-box-border univer-w-[328px] univer-rounded-xl univer-bg-white univer-px-6 univer-py-5 univer-shadow dark:!univer-bg-gray-900`, borderClassName),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
          editing ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            FormLayout,
            {
              label: localeService.t("docs-hyper-link-ui.edit.label"),
              error: showError && isBlankInput(label) ? localeService.t("docs-hyper-link-ui.edit.labelError") : "",
              children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                Input,
                {
                  value: label,
                  onChange: setLabel,
                  autoFocus: true,
                  onKeyDown: (evt) => {
                    if (evt.keyCode === 13 /* ENTER */) {
                      handleConfirm();
                    }
                  }
                }
              )
            }
          ) : null,
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            FormLayout,
            {
              label: localeService.t("docs-hyper-link-ui.edit.address"),
              error: showError && !isLegal ? localeService.t("docs-hyper-link-ui.edit.addressError") : "",
              children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                Input,
                {
                  value: link,
                  onChange: setLink,
                  autoFocus: true,
                  onKeyDown: (evt) => {
                    if (evt.keyCode === 13 /* ENTER */) {
                      handleConfirm();
                    }
                  }
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "univer-flex univer-justify-end univer-gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Button, { onClick: handleCancel, children: localeService.t("docs-hyper-link-ui.edit.cancel") }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            Button,
            {
              variant: "primary",
              disabled: isBlankInput(link),
              onClick: handleConfirm,
              children: localeService.t("docs-hyper-link-ui.edit.confirm")
            }
          )
        ] })
      ]
    }
  );
};
DocHyperLinkEdit.componentKey = "docs-hyper-link-edit";

// ../packages/docs-hyper-link-ui/src/controllers/components.controller.ts
var ComponentsController = class extends Disposable {
  constructor(_componentManager, _iconManager) {
    super();
    __publicField(this, "_componentManager", _componentManager);
    __publicField(this, "_iconManager", _iconManager);
    this._registerComponents();
    this._registerIcons();
  }
  _registerComponents() {
    [
      [DocHyperLinkEdit.componentKey, DocHyperLinkEdit],
      [DocLinkPopup.componentKey, DocLinkPopup]
    ].forEach(([key, comp]) => {
      this.disposeWithMe(
        this._componentManager.register(key, comp)
      );
    });
  }
  _registerIcons() {
    this.disposeWithMe(this._iconManager.register({
      LinkIcon
    }));
  }
};
ComponentsController = __decorateClass([
  __decorateParam(0, Inject(ComponentManager)),
  __decorateParam(1, Inject(IconManager))
], ComponentsController);

// ../packages/docs-hyper-link-ui/src/controllers/doc-hyper-link-selection.controller.ts
var DocHyperLinkSelectionController = class extends Disposable {
  constructor(_commandService, _univerInstanceService, _docHyperLinkService) {
    super();
    __publicField(this, "_commandService", _commandService);
    __publicField(this, "_univerInstanceService", _univerInstanceService);
    __publicField(this, "_docHyperLinkService", _docHyperLinkService);
    this._initSelectionChange();
  }
  _initSelectionChange() {
    this.disposeWithMe(
      this._commandService.onCommandExecuted((commandInfo) => {
        var _a, _b, _c;
        if (commandInfo.id === SetTextSelectionsOperation.id) {
          const params = commandInfo.params;
          const { unitId, ranges, segmentId } = params;
          const doc = this._univerInstanceService.getUnit(unitId, 1 /* UNIVER_DOC */);
          const primary = ranges[0];
          if (primary && doc) {
            const { startOffset, endOffset, collapsed, segmentPage } = primary;
            const customRanges = (_b = (_a = doc.getSelfOrHeaderFooterModel(segmentId)) == null ? void 0 : _a.getBody()) == null ? void 0 : _b.customRanges;
            if (collapsed) {
              const index = (_c = customRanges == null ? void 0 : customRanges.findIndex((value) => value.startIndex < startOffset && value.endIndex > endOffset - 1)) != null ? _c : -1;
              if (index > -1) {
                const customRange = customRanges[index];
                this._docHyperLinkService.showInfoPopup({ unitId, linkId: customRange.rangeId, segmentId, segmentPage, startIndex: customRange.startIndex, endIndex: customRange.endIndex });
                return;
              }
            } else {
              const range = customRanges == null ? void 0 : customRanges.find((value) => value.startIndex <= startOffset && value.endIndex >= endOffset - 1);
              if (range) {
                return;
              }
            }
          }
          this._docHyperLinkService.hideInfoPopup();
          this._docHyperLinkService.hideEditPopup();
        }
      })
    );
  }
};
DocHyperLinkSelectionController = __decorateClass([
  __decorateParam(0, ICommandService),
  __decorateParam(1, IUniverInstanceService),
  __decorateParam(2, Inject(DocHyperLinkPopupService))
], DocHyperLinkSelectionController);

// ../packages/docs-hyper-link-ui/src/controllers/render-controllers/hyper-link-event.render-controller.ts
var DocHyperLinkEventRenderController = class extends Disposable {
  constructor(_context, _docEventManagerService, _commandService, _hyperLinkPopupService, _docSkeletonManagerService, _docSelectionManagerService) {
    super();
    __publicField(this, "_context", _context);
    __publicField(this, "_docEventManagerService", _docEventManagerService);
    __publicField(this, "_commandService", _commandService);
    __publicField(this, "_hyperLinkPopupService", _hyperLinkPopupService);
    __publicField(this, "_docSkeletonManagerService", _docSkeletonManagerService);
    __publicField(this, "_docSelectionManagerService", _docSelectionManagerService);
    if (this._context.unitId === DOCS_NORMAL_EDITOR_UNIT_ID_KEY) {
      return;
    }
    this._initHover();
    this._initClick();
  }
  get _skeleton() {
    return this._docSkeletonManagerService.getSkeleton();
  }
  _hideInfoPopup() {
    if (this._hyperLinkPopupService.showing) {
      this._commandService.executeCommand(
        ToggleDocHyperLinkInfoPopupOperation.id
      );
    }
  }
  _initHover() {
    this.disposeWithMe(
      this._docEventManagerService.hoverCustomRanges$.subscribe((ranges) => {
        var _a, _b;
        const link = ranges.find((range) => range.range.rangeType === 0 /* HYPERLINK */);
        const activeRanges = this._docSelectionManagerService.getTextRanges();
        const currentSegmentId = (_a = activeRanges == null ? void 0 : activeRanges[0]) == null ? void 0 : _a.segmentId;
        if (((_b = link == null ? void 0 : link.segmentId) != null ? _b : "") !== currentSegmentId) {
          this._hideInfoPopup();
          return;
        }
        if (link) {
          this._commandService.executeCommand(
            ToggleDocHyperLinkInfoPopupOperation.id,
            {
              unitId: this._context.unitId,
              linkId: link.range.rangeId,
              segmentId: link.segmentId,
              segmentPage: link.segmentPageIndex,
              rangeId: link.range.rangeId,
              startIndex: link.range.startIndex,
              endIndex: link.range.endIndex
            }
          );
        } else {
          this._hideInfoPopup();
        }
      })
    );
  }
  _initClick() {
    this.disposeWithMe(
      this._docEventManagerService.clickCustomRanges$.subscribe((range) => {
        const link = range.range;
        if (link) {
          this._commandService.executeCommand(
            ClickDocHyperLinkOperation.id,
            {
              unitId: this._context.unitId,
              linkId: link.rangeId,
              segmentId: range.segmentId
            }
          );
        }
      })
    );
  }
};
DocHyperLinkEventRenderController = __decorateClass([
  __decorateParam(1, Inject(DocEventManagerService)),
  __decorateParam(2, ICommandService),
  __decorateParam(3, Inject(DocHyperLinkPopupService)),
  __decorateParam(4, Inject(DocSkeletonManagerService)),
  __decorateParam(5, Inject(DocSelectionManagerService))
], DocHyperLinkEventRenderController);

// ../packages/docs-hyper-link-ui/src/controllers/render-controllers/render.controller.ts
var DocHyperLinkRenderController = class extends Disposable {
  constructor(_context, _docInterceptorService, _hyperLinkService, _docRenderController) {
    super();
    __publicField(this, "_context", _context);
    __publicField(this, "_docInterceptorService", _docInterceptorService);
    __publicField(this, "_hyperLinkService", _hyperLinkService);
    __publicField(this, "_docRenderController", _docRenderController);
    this._init();
    this._initReRender();
  }
  _init() {
    this._docInterceptorService.intercept(DOC_INTERCEPTOR_POINT.CUSTOM_RANGE, {
      handler: (data, pos, next) => {
        if (!data) {
          return next(data);
        }
        const { unitId, index } = pos;
        const activeLink = this._hyperLinkService.showing;
        if (!activeLink) {
          return next({
            ...data,
            active: false
          });
        }
        const { linkId, unitId: linkUnitId, startIndex, endIndex } = activeLink;
        const isActive = linkUnitId === unitId && data.rangeId === linkId && index >= startIndex && index <= endIndex;
        return next({
          ...data,
          active: isActive
        });
      }
    });
  }
  _initReRender() {
    this.disposeWithMe(this._hyperLinkService.showingLink$.pipe(
      distinctUntilChanged((prev, aft) => (prev == null ? void 0 : prev.linkId) === (aft == null ? void 0 : aft.linkId) && (prev == null ? void 0 : prev.unitId) === (aft == null ? void 0 : aft.unitId) && (prev == null ? void 0 : prev.startIndex) === (aft == null ? void 0 : aft.startIndex)),
      pairwise()
    ).subscribe(([preLink, link]) => {
      if (link) {
        if (link.unitId === this._context.unitId) {
          this._docRenderController.reRender(link.unitId);
        }
      } else {
        if (preLink && preLink.unitId === this._context.unitId) {
          this._docRenderController.reRender(preLink.unitId);
        }
      }
    }));
  }
};
DocHyperLinkRenderController = __decorateClass([
  __decorateParam(1, Inject(DocInterceptorService)),
  __decorateParam(2, Inject(DocHyperLinkPopupService)),
  __decorateParam(3, Inject(DocRenderController))
], DocHyperLinkRenderController);

// ../packages/docs-hyper-link-ui/src/menu/menu.ts
function AddHyperLinkMenuItemFactory(accessor) {
  return {
    id: ShowDocHyperLinkEditPopupOperation.id,
    type: 0 /* BUTTON */,
    icon: "LinkIcon",
    title: "docs-hyper-link-ui.menu.tooltip",
    tooltip: "docs-hyper-link-ui.menu.tooltip",
    hidden$: getMenuHiddenObservable(accessor, 1 /* UNIVER_DOC */),
    disabled$: new Observable(function(subscribe) {
      const textSelectionService = accessor.get(DocSelectionManagerService);
      const observer = textSelectionService.textSelection$.pipe(debounceTime(16)).subscribe(() => {
        subscribe.next(shouldDisableAddLink(accessor));
      });
      return () => {
        observer.unsubscribe();
      };
    })
  };
}
var addLinkShortcut = {
  id: ShowDocHyperLinkEditPopupOperation.id,
  binding: 4096 /* CTRL_COMMAND */ | 75 /* K */,
  description: "docs-hyper-link-ui.menu.tooltip",
  preconditions: whenDocAndEditorFocused
};

// ../packages/docs-hyper-link-ui/src/menu/schema.ts
var menuSchema = {
  ["ribbon.insert.media" /* MEDIA */]: {
    [ShowDocHyperLinkEditPopupOperation.id]: {
      order: 1,
      menuItemFactory: AddHyperLinkMenuItemFactory
    }
  },
  [FLOAT_TOOLBAR_MENU_POSITION]: {
    [ShowDocHyperLinkEditPopupOperation.id]: {
      order: 20,
      menuItemFactory: AddHyperLinkMenuItemFactory
    }
  },
  ["contextMenu.mainArea" /* MAIN_AREA */]: {
    ["contextMenu.data" /* DATA */]: {
      [ShowDocHyperLinkEditPopupOperation.id]: {
        order: 0,
        menuItemFactory: AddHyperLinkMenuItemFactory
      }
    }
  },
  ["contextMenu.paragraph" /* PARAGRAPH */]: {
    ["contextMenu.layout" /* LAYOUT */]: {
      [INSERT_BELLOW_MENU_ID]: {
        [ShowDocHyperLinkEditPopupOperation.id]: {
          order: 6,
          menuItemFactory: AddHyperLinkMenuItemFactory
        }
      }
    },
    [EMPTY_PARAGRAPH_MENU_ID]: {
      ["contextMenu.layout" /* LAYOUT */]: {
        [ShowDocHyperLinkEditPopupOperation.id]: {
          order: 6,
          menuItemFactory: AddHyperLinkMenuItemFactory
        }
      }
    }
  }
};

// ../packages/docs-hyper-link-ui/src/controllers/ui.controller.ts
var DocHyperLinkUIController = class extends Disposable {
  constructor(_commandService, _menuManagerService, _shortcutService) {
    super();
    __publicField(this, "_commandService", _commandService);
    __publicField(this, "_menuManagerService", _menuManagerService);
    __publicField(this, "_shortcutService", _shortcutService);
    this._initCommands();
    this._initMenus();
    this._initShortcut();
  }
  _initCommands() {
    [
      AddDocHyperLinkCommand,
      UpdateDocHyperLinkCommand,
      DeleteDocHyperLinkCommand,
      ShowDocHyperLinkEditPopupOperation,
      ToggleDocHyperLinkInfoPopupOperation,
      ClickDocHyperLinkOperation
    ].forEach((command) => {
      this._commandService.registerCommand(command);
    });
  }
  _initShortcut() {
    [addLinkShortcut].forEach((shortcut) => {
      this._shortcutService.registerShortcut(shortcut);
    });
  }
  _initMenus() {
    this._menuManagerService.appendRootMenu({ [FLOAT_TOOLBAR_MENU_POSITION]: {} });
    this._menuManagerService.mergeMenu(menuSchema);
  }
};
DocHyperLinkUIController = __decorateClass([
  __decorateParam(0, ICommandService),
  __decorateParam(1, IMenuManagerService),
  __decorateParam(2, IShortcutService)
], DocHyperLinkUIController);

// ../packages/docs-hyper-link-ui/src/types/const/index.ts
var DOC_HYPER_LINK_UI_PLUGIN = "DOC_HYPER_LINK_UI_PLUGIN";

// ../packages/docs-hyper-link-ui/src/plugin.ts
var UniverDocsHyperLinkUIPlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig2, _injector, _renderManagerSrv, _configService) {
    super();
    __publicField(this, "_config", _config);
    __publicField(this, "_injector", _injector);
    __publicField(this, "_renderManagerSrv", _renderManagerSrv);
    __publicField(this, "_configService", _configService);
    const { menu, ...rest } = merge_default(
      {},
      defaultPluginConfig2,
      this._config
    );
    if (menu) {
      this._configService.setConfig("menu", menu, { merge: true });
    }
    this._configService.setConfig(DOCS_HYPER_LINK_UI_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    this._injector.add([ComponentsController]);
    this._injector.get(ComponentsController);
    const deps = [
      [DocHyperLinkPopupService],
      [DocHyperLinkUIController],
      [DocHyperLinkSelectionController]
    ];
    deps.forEach((dep) => {
      this._injector.add(dep);
    });
    this._injector.get(DocHyperLinkUIController);
  }
  onReady() {
    this._injector.get(DocHyperLinkSelectionController);
  }
  onRendered() {
    this._initRenderModule();
  }
  _initRenderModule() {
    [
      [DocHyperLinkRenderController],
      [DocHyperLinkEventRenderController]
    ].forEach((dep) => {
      this._renderManagerSrv.registerRenderModule(1 /* UNIVER_DOC */, dep);
    });
  }
};
__publicField(UniverDocsHyperLinkUIPlugin, "pluginName", DOC_HYPER_LINK_UI_PLUGIN);
__publicField(UniverDocsHyperLinkUIPlugin, "packageName", package_default2.name);
__publicField(UniverDocsHyperLinkUIPlugin, "version", package_default2.version);
__publicField(UniverDocsHyperLinkUIPlugin, "type", 1 /* UNIVER_DOC */);
UniverDocsHyperLinkUIPlugin = __decorateClass([
  DependentOn(UniverDocsHyperLinkPlugin),
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, IRenderManagerService),
  __decorateParam(3, IConfigService)
], UniverDocsHyperLinkUIPlugin);

// ../packages/docs-thread-comment-ui/package.json
var package_default3 = {
  name: "@univerjs/docs-thread-comment-ui",
  version: "0.25.0",
  private: false,
  description: "Thread comment UI integration for Univer Docs.",
  author: "DreamNum Co., Ltd. <developer@univer.ai>",
  license: "Apache-2.0",
  funding: {
    type: "opencollective",
    url: "https://opencollective.com/univer"
  },
  homepage: "https://univer.ai",
  repository: {
    type: "git",
    url: "https://github.com/dream-num/univer"
  },
  bugs: {
    url: "https://github.com/dream-num/univer/issues"
  },
  keywords: [
    "univer",
    "docs",
    "comment",
    "thread-comment",
    "ui"
  ],
  exports: {
    ".": "./src/index.ts",
    "./*": "./src/*",
    "./locale/*": "./src/locale/*.ts"
  },
  main: "./src/index.ts",
  types: "./lib/types/index.d.ts",
  publishConfig: {
    access: "public",
    main: "./lib/es/index.js",
    module: "./lib/es/index.js",
    exports: {
      ".": {
        import: "./lib/es/index.js",
        require: "./lib/cjs/index.js",
        types: "./lib/types/index.d.ts"
      },
      "./*": {
        import: "./lib/es/*",
        require: "./lib/cjs/*",
        types: "./lib/types/index.d.ts"
      },
      "./locale/*": {
        import: "./lib/es/locale/*.js",
        require: "./lib/cjs/locale/*.js",
        types: "./lib/types/locale/*.d.ts"
      },
      "./lib/*": "./lib/*"
    }
  },
  directories: {
    lib: "lib"
  },
  files: [
    "lib"
  ],
  scripts: {
    test: "vitest run",
    "test:watch": "vitest",
    coverage: "vitest run --coverage",
    typecheck: "tsc --noEmit",
    "build:bundle": "univer-cli build",
    "build:types": "tsc -p tsconfig.node.json",
    build: "pnpm run build:bundle && pnpm run build:types"
  },
  peerDependencies: {
    react: "^16.9.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc",
    rxjs: ">=7.0.0"
  },
  dependencies: {
    "@univerjs/core": "workspace:*",
    "@univerjs/docs": "workspace:*",
    "@univerjs/docs-ui": "workspace:*",
    "@univerjs/engine-render": "workspace:*",
    "@univerjs/icons": "1.12.0",
    "@univerjs/thread-comment": "workspace:*",
    "@univerjs/thread-comment-ui": "workspace:*",
    "@univerjs/ui": "workspace:*"
  },
  devDependencies: {
    "@univerjs-infra/shared": "workspace:*",
    postcss: "^8.5.15",
    react: "18.3.1",
    rxjs: "^7.8.2",
    tailwindcss: "3.4.18",
    typescript: "^6.0.3",
    vitest: "^4.1.9"
  }
};

// ../packages/docs-thread-comment-ui/src/common/const.ts
var DOCS_THREAD_COMMENT_PANEL = "univer.doc.thread-comment-panel";
var PLUGIN_NAME = "DOC_THREAD_COMMENT_UI_PLUGIN";
var DEFAULT_DOC_SUBUNIT_ID = "default_doc";

// ../packages/docs-thread-comment-ui/src/config/config.ts
var DOCS_THREAD_COMMENT_UI_PLUGIN_CONFIG_KEY = "docs-thread-comment-ui.config";
var configSymbol3 = Symbol(DOCS_THREAD_COMMENT_UI_PLUGIN_CONFIG_KEY);
var defaultPluginConfig3 = {};

// ../packages/docs-thread-comment-ui/src/views/DocThreadCommentPanel.tsx
var import_react2 = __toESM(require_react());

// ../packages/docs-thread-comment-ui/src/commands/commands/add-doc-comment.command.ts
var AddDocCommentComment = {
  id: "docs.command.add-comment",
  type: 0 /* COMMAND */,
  async handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { comment: originComment, unitId } = params;
    const dataSourceService = accessor.get(IThreadCommentDataSourceService);
    const comment = await dataSourceService.addComment(originComment);
    const commandService = accessor.get(ICommandService);
    const doMutation = addCustomDecorationBySelectionFactory(
      accessor,
      {
        id: comment.threadId,
        type: 0 /* COMMENT */,
        unitId
      }
    );
    if (doMutation) {
      const addComment = {
        id: AddCommentMutation.id,
        params: {
          unitId,
          subUnitId: DEFAULT_DOC_SUBUNIT_ID,
          comment
        }
      };
      const activeOperation = {
        id: SetActiveCommentOperation.id,
        params: {
          unitId,
          subUnitId: DEFAULT_DOC_SUBUNIT_ID,
          commentId: comment.id
        }
      };
      return (await sequenceExecute([addComment, doMutation, activeOperation], commandService)).result;
    }
    return false;
  }
};

// ../packages/docs-thread-comment-ui/src/commands/commands/delete-doc-comment.command.ts
var DeleteDocCommentComment = {
  id: "docs.command.delete-comment",
  type: 0 /* COMMAND */,
  async handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { commentId, unitId } = params;
    const commandService = accessor.get(ICommandService);
    const doMutation = deleteCustomDecorationFactory(accessor, {
      id: commentId,
      unitId
    });
    if (doMutation) {
      return (await sequenceExecute([doMutation], commandService)).result;
    }
    return false;
  }
};

// ../packages/docs-thread-comment-ui/src/services/doc-thread-comment.service.ts
var DocThreadCommentService = class extends Disposable {
  constructor(_sidebarService, _threadCommentPanelService) {
    super();
    __publicField(this, "_sidebarService", _sidebarService);
    __publicField(this, "_threadCommentPanelService", _threadCommentPanelService);
    __publicField(this, "_addingComment$", new BehaviorSubject(void 0));
    __publicField(this, "addingComment$", this._addingComment$.asObservable());
    this.disposeWithMe(() => {
      this._addingComment$.complete();
    });
  }
  get addingComment() {
    return this._addingComment$.getValue();
  }
  startAdd(comment) {
    this._addingComment$.next(comment);
  }
  endAdd() {
    this._addingComment$.next(void 0);
  }
};
DocThreadCommentService = __decorateClass([
  __decorateParam(0, ISidebarService),
  __decorateParam(1, Inject(ThreadCommentPanelService))
], DocThreadCommentService);

// ../packages/docs-thread-comment-ui/src/commands/operations/show-comment-panel.operation.ts
var ShowCommentPanelOperation = {
  id: "docs.operation.show-comment-panel",
  type: 1 /* OPERATION */,
  handler(accessor, params) {
    var _a;
    const panelService = accessor.get(ThreadCommentPanelService);
    const sidebarService = accessor.get(ISidebarService);
    if (!panelService.panelVisible || ((_a = sidebarService.options.children) == null ? void 0 : _a.label) !== DOCS_THREAD_COMMENT_PANEL) {
      sidebarService.open({
        header: { title: "docs-thread-comment-ui.panel.title" },
        children: { label: DOCS_THREAD_COMMENT_PANEL },
        width: 320,
        onClose: () => panelService.setPanelVisible(false)
      });
      panelService.setPanelVisible(true);
    }
    if (params) {
      panelService.setActiveComment(params == null ? void 0 : params.activeComment);
    }
    return true;
  }
};
var ToggleCommentPanelOperation = {
  id: "docs.operation.toggle-comment-panel",
  type: 1 /* OPERATION */,
  handler(accessor) {
    var _a;
    const panelService = accessor.get(ThreadCommentPanelService);
    const sidebarService = accessor.get(ISidebarService);
    if (!panelService.panelVisible || ((_a = sidebarService.options.children) == null ? void 0 : _a.label) !== DOCS_THREAD_COMMENT_PANEL) {
      sidebarService.open({
        header: { title: "docs-thread-comment-ui.panel.title" },
        children: { label: DOCS_THREAD_COMMENT_PANEL },
        width: 320,
        onClose: () => panelService.setPanelVisible(false)
      });
      panelService.setPanelVisible(true);
    } else {
      sidebarService.close();
      panelService.setPanelVisible(false);
      panelService.setActiveComment(null);
    }
    return true;
  }
};
var StartAddCommentOperation = {
  id: "docs.operation.start-add-comment",
  type: 1 /* OPERATION */,
  handler(accessor) {
    var _a, _b, _c;
    const panelService = accessor.get(ThreadCommentPanelService);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const doc = univerInstanceService.getCurrentUnitOfType(1 /* UNIVER_DOC */);
    const docSelectionManagerService = accessor.get(DocSelectionManagerService);
    const renderManagerService = accessor.get(IRenderManagerService);
    const userManagerService = accessor.get(UserManagerService);
    const docCommentService = accessor.get(DocThreadCommentService);
    const commandService = accessor.get(ICommandService);
    const sidebarService = accessor.get(ISidebarService);
    const textRange = docSelectionManagerService.getActiveTextRange();
    if (!doc || !textRange) {
      return false;
    }
    const docSelectionRenderManager = (_a = renderManagerService.getRenderById(doc.getUnitId())) == null ? void 0 : _a.with(DocSelectionRenderService);
    docSelectionRenderManager == null ? void 0 : docSelectionRenderManager.setReserveRangesStatus(true);
    if (textRange.collapsed) {
      if (panelService.panelVisible) {
        panelService.setPanelVisible(false);
        sidebarService.close();
      } else {
        commandService.executeCommand(ShowCommentPanelOperation.id);
      }
      return true;
    }
    commandService.executeCommand(ShowCommentPanelOperation.id);
    const unitId = doc.getUnitId();
    const dataStream = ((_c = (_b = doc.getBody()) == null ? void 0 : _b.dataStream) != null ? _c : "").slice(textRange.startOffset, textRange.endOffset);
    const text = BuildTextUtils.transform.getPlainText(dataStream);
    const subUnitId = DEFAULT_DOC_SUBUNIT_ID;
    const commentId = "";
    const comment = {
      unitId,
      subUnitId,
      id: commentId,
      ref: text,
      dT: getDT(),
      personId: userManagerService.getCurrentUser().userID,
      text: {
        dataStream: "\r\n"
      },
      startOffset: textRange.startOffset,
      endOffset: textRange.endOffset,
      collapsed: true,
      threadId: commentId
    };
    docSelectionRenderManager == null ? void 0 : docSelectionRenderManager.blur();
    docCommentService.startAdd(comment);
    panelService.setActiveComment({
      unitId,
      subUnitId,
      commentId
    });
    return true;
  }
};

// ../packages/docs-thread-comment-ui/src/menu/menu.ts
var shouldDisableAddComment = (accessor) => {
  var _a;
  const renderManagerService = accessor.get(IRenderManagerService);
  const docSelectionManagerService = accessor.get(DocSelectionManagerService);
  const skeleton = (_a = withCurrentTypeOfRenderer(
    1 /* UNIVER_DOC */,
    DocSkeletonManagerService,
    accessor.get(IUniverInstanceService),
    renderManagerService
  )) == null ? void 0 : _a.getSkeleton();
  const editArea = skeleton == null ? void 0 : skeleton.getViewModel().getEditArea();
  if (editArea === "FOOTER" /* FOOTER */ || editArea === "HEADER" /* HEADER */) {
    return true;
  }
  const range = docSelectionManagerService.getActiveTextRange();
  if (range == null || range.collapsed) {
    return true;
  }
  return false;
};
function AddDocCommentMenuItemFactory(accessor) {
  return {
    id: StartAddCommentOperation.id,
    type: 0 /* BUTTON */,
    icon: "CommentIcon",
    title: "docs-thread-comment-ui.panel.addComment",
    tooltip: "docs-thread-comment-ui.panel.addComment",
    hidden$: getMenuHiddenObservable(accessor, 1 /* UNIVER_DOC */, void 0, SHEET_EDITOR_UNITS),
    disabled$: new Observable(function(subscribe) {
      const textSelectionService = accessor.get(DocSelectionManagerService);
      const observer = textSelectionService.textSelection$.pipe(debounceTime(16)).subscribe(() => {
        subscribe.next(shouldDisableAddComment(accessor));
      });
      return () => {
        observer.unsubscribe();
      };
    })
  };
}
function ToolbarDocCommentMenuItemFactory(accessor) {
  return {
    id: ToggleCommentPanelOperation.id,
    type: 0 /* BUTTON */,
    icon: "CommentIcon",
    title: "docs-thread-comment-ui.panel.addComment",
    tooltip: "docs-thread-comment-ui.panel.addComment",
    hidden$: getMenuHiddenObservable(accessor, 1 /* UNIVER_DOC */)
  };
}

// ../packages/docs-thread-comment-ui/src/views/DocThreadCommentPanel.tsx
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
var DocThreadCommentPanel = () => {
  const univerInstanceService = useDependency(IUniverInstanceService);
  const injector = useDependency(Injector);
  const doc$ = (0, import_react2.useMemo)(() => univerInstanceService.getCurrentTypeOfUnit$(1 /* UNIVER_DOC */).pipe(filter((doc2) => !!doc2 && !isInternalEditorID(doc2.getUnitId()))), [univerInstanceService]);
  const doc = useObservable(doc$);
  const subUnitId$ = (0, import_react2.useMemo)(() => new Observable((sub) => sub.next(DEFAULT_DOC_SUBUNIT_ID)), []);
  const docSelectionManagerService = useDependency(DocSelectionManagerService);
  const selectionChange$ = (0, import_react2.useMemo)(
    () => docSelectionManagerService.textSelection$.pipe(debounceTime(16)),
    [docSelectionManagerService.textSelection$]
  );
  useObservable(selectionChange$);
  const commandService = useDependency(ICommandService);
  const docCommentService = useDependency(DocThreadCommentService);
  const tempComment = useObservable(docCommentService.addingComment$);
  const [commentIds, setCommentIds] = (0, import_react2.useState)([]);
  (0, import_react2.useEffect)(() => {
    var _a;
    const set = /* @__PURE__ */ new Set();
    const customRanges = doc == null ? void 0 : doc.getCustomDecorations();
    setCommentIds((_a = customRanges == null ? void 0 : customRanges.map((r) => r.id).filter((i) => {
      const hasRepeat = set.has(i);
      set.add(i);
      return !hasRepeat;
    })) != null ? _a : []);
    const dispose = commandService.onCommandExecuted((command) => {
      var _a2;
      if (command.id === RichTextEditingMutation.id) {
        const set2 = /* @__PURE__ */ new Set();
        const customRanges2 = doc == null ? void 0 : doc.getCustomDecorations();
        setCommentIds((_a2 = customRanges2 == null ? void 0 : customRanges2.map((r) => r.id).filter((i) => {
          const hasRepeat = set2.has(i);
          set2.add(i);
          return !hasRepeat;
        })) != null ? _a2 : []);
      }
    });
    return () => {
      dispose.dispose();
    };
  }, [commandService, doc]);
  if (!doc) {
    return null;
  }
  const isInValidSelection = shouldDisableAddComment(injector);
  const unitId = doc.getUnitId();
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    ThreadCommentPanel,
    {
      unitId,
      subUnitId$,
      type: 1 /* UNIVER_DOC */,
      onAdd: () => {
        commandService.executeCommand(StartAddCommentOperation.id);
      },
      getSubUnitName: () => "",
      disableAdd: isInValidSelection,
      tempComment,
      onAddComment: (comment) => {
        if (!comment.parentId) {
          const params = {
            unitId,
            range: tempComment,
            comment
          };
          commandService.executeCommand(AddDocCommentComment.id, params);
          docCommentService.endAdd();
          return false;
        }
        return true;
      },
      onDeleteComment: (comment) => {
        if (!comment.parentId) {
          const params = {
            unitId,
            commentId: comment.id
          };
          commandService.executeCommand(DeleteDocCommentComment.id, params);
          return false;
        }
        return true;
      },
      showComments: commentIds
    }
  );
};

// ../packages/docs-thread-comment-ui/src/controllers/components.controller.ts
var ComponentsController2 = class extends Disposable {
  constructor(_componentManager, _iconManager) {
    super();
    __publicField(this, "_componentManager", _componentManager);
    __publicField(this, "_iconManager", _iconManager);
    this._registerComponents();
    this._registerIcons();
  }
  _registerComponents() {
    [
      [DOCS_THREAD_COMMENT_PANEL, DocThreadCommentPanel]
    ].forEach(([id, comp]) => {
      this.disposeWithMe(
        this._componentManager.register(id, comp)
      );
    });
  }
  _registerIcons() {
    this.disposeWithMe(this._iconManager.register({
      CommentIcon
    }));
  }
};
ComponentsController2 = __decorateClass([
  __decorateParam(0, Inject(ComponentManager)),
  __decorateParam(1, Inject(IconManager))
], ComponentsController2);

// ../packages/docs-thread-comment-ui/src/controllers/doc-thread-comment-selection.controller.ts
var DocThreadCommentSelectionController = class extends Disposable {
  constructor(_threadCommentPanelService, _univerInstanceService, _commandService, _docThreadCommentService, _renderManagerService, _threadCommentModel) {
    super();
    __publicField(this, "_threadCommentPanelService", _threadCommentPanelService);
    __publicField(this, "_univerInstanceService", _univerInstanceService);
    __publicField(this, "_commandService", _commandService);
    __publicField(this, "_docThreadCommentService", _docThreadCommentService);
    __publicField(this, "_renderManagerService", _renderManagerService);
    __publicField(this, "_threadCommentModel", _threadCommentModel);
    this._initSelectionChange();
    this._initActiveCommandChange();
  }
  _initSelectionChange() {
    let lastSelection;
    this.disposeWithMe(
      this._commandService.onCommandExecuted((commandInfo) => {
        var _a, _b, _c, _d;
        if (commandInfo.id === SetTextSelectionsOperation.id) {
          const params = commandInfo.params;
          const { unitId, ranges } = params;
          if (isInternalEditorID(unitId)) return;
          const doc = this._univerInstanceService.getUnit(unitId, 1 /* UNIVER_DOC */);
          const primary = ranges[0];
          if ((lastSelection == null ? void 0 : lastSelection.startOffset) === (primary == null ? void 0 : primary.startOffset) && (lastSelection == null ? void 0 : lastSelection.endOffset) === (primary == null ? void 0 : primary.endOffset)) {
            return;
          }
          lastSelection = primary;
          if (primary && doc) {
            const { startOffset, endOffset, collapsed } = primary;
            let customRange;
            if (collapsed) {
              customRange = (_b = (_a = doc.getBody()) == null ? void 0 : _a.customDecorations) == null ? void 0 : _b.find((value) => value.startIndex <= startOffset && value.endIndex >= endOffset - 1);
            } else {
              customRange = (_d = (_c = doc.getBody()) == null ? void 0 : _c.customDecorations) == null ? void 0 : _d.find((value) => value.startIndex <= startOffset && value.endIndex >= endOffset - 1);
            }
            if (customRange) {
              const comment = this._threadCommentModel.getComment(unitId, DEFAULT_DOC_SUBUNIT_ID, customRange.id);
              if (comment && !comment.resolved) {
                this._commandService.executeCommand(ShowCommentPanelOperation.id, {
                  activeComment: {
                    unitId,
                    subUnitId: DEFAULT_DOC_SUBUNIT_ID,
                    commentId: customRange.id
                  }
                });
              }
              return;
            }
          }
          if (!this._threadCommentPanelService.activeCommentId) {
            return;
          }
          const addingComment = this._docThreadCommentService.addingComment;
          const activeComment = this._threadCommentPanelService.activeCommentId;
          if (addingComment && (activeComment == null ? void 0 : activeComment.unitId) === addingComment.unitId && (activeComment == null ? void 0 : activeComment.subUnitId) === DEFAULT_DOC_SUBUNIT_ID && (activeComment == null ? void 0 : activeComment.commentId) === addingComment.id) {
            return;
          }
          this._commandService.executeCommand(SetActiveCommentOperation.id);
        }
      })
    );
  }
  _initActiveCommandChange() {
    this.disposeWithMe(this._threadCommentPanelService.activeCommentId$.subscribe((activeComment) => {
      var _a, _b, _c, _d;
      if (activeComment) {
        const doc = this._univerInstanceService.getUnit(activeComment.unitId);
        if (doc) {
          const backScrollController = (_a = this._renderManagerService.getRenderById(activeComment.unitId)) == null ? void 0 : _a.with(DocBackScrollRenderController);
          const customRange = (_c = (_b = doc.getBody()) == null ? void 0 : _b.customDecorations) == null ? void 0 : _c.find((range) => range.id === activeComment.commentId);
          if (customRange && backScrollController) {
            backScrollController.scrollToRange({
              startOffset: customRange.startIndex,
              endOffset: customRange.endIndex,
              collapsed: false
            });
          }
        }
      }
      if (!activeComment || activeComment.commentId !== ((_d = this._docThreadCommentService.addingComment) == null ? void 0 : _d.id)) {
        this._docThreadCommentService.endAdd();
      }
    }));
  }
};
DocThreadCommentSelectionController = __decorateClass([
  __decorateParam(0, Inject(ThreadCommentPanelService)),
  __decorateParam(1, IUniverInstanceService),
  __decorateParam(2, ICommandService),
  __decorateParam(3, Inject(DocThreadCommentService)),
  __decorateParam(4, IRenderManagerService),
  __decorateParam(5, Inject(ThreadCommentModel))
], DocThreadCommentSelectionController);

// ../packages/docs-thread-comment-ui/src/controllers/render-controllers/render.controller.ts
var DocThreadCommentRenderController = class extends Disposable {
  constructor(_context, _docInterceptorService, _threadCommentPanelService, _docRenderController, _univerInstanceService, _threadCommentModel, _commandService) {
    super();
    __publicField(this, "_context", _context);
    __publicField(this, "_docInterceptorService", _docInterceptorService);
    __publicField(this, "_threadCommentPanelService", _threadCommentPanelService);
    __publicField(this, "_docRenderController", _docRenderController);
    __publicField(this, "_univerInstanceService", _univerInstanceService);
    __publicField(this, "_threadCommentModel", _threadCommentModel);
    __publicField(this, "_commandService", _commandService);
    this._interceptorViewModel();
    this._initReRender();
    this._initSyncComments();
  }
  _initReRender() {
    this.disposeWithMe(this._threadCommentPanelService.activeCommentId$.subscribe((activeComment) => {
      var _a;
      if (activeComment) {
        this._docRenderController.reRender(activeComment.unitId);
        return;
      }
      const unitId = (_a = this._univerInstanceService.getCurrentUnitOfType(1 /* UNIVER_DOC */)) == null ? void 0 : _a.getUnitId();
      if (unitId) {
        this._docRenderController.reRender(unitId);
      }
    }));
    this.disposeWithMe(this._threadCommentModel.commentUpdate$.subscribe((update) => {
      if (update.type === "resolve") {
        this._docRenderController.reRender(update.unitId);
      }
    }));
  }
  _interceptorViewModel() {
    this._docInterceptorService.intercept(DOC_INTERCEPTOR_POINT.CUSTOM_DECORATION, {
      handler: (data, pos, next) => {
        if (!data) {
          return next(data);
        }
        const { unitId, index, customDecorations } = pos;
        const activeComment = this._threadCommentPanelService.activeCommentId;
        const { commentId, unitId: commentUnitID } = activeComment || {};
        const activeCustomDecoration = customDecorations.find((i) => i.id === commentId);
        const comment = this._threadCommentModel.getComment(unitId, DEFAULT_DOC_SUBUNIT_ID, data.id);
        if (!comment) {
          return next({
            ...data,
            show: false
          });
        }
        const isActiveIndex = activeCustomDecoration && index >= activeCustomDecoration.startIndex && index <= activeCustomDecoration.endIndex;
        const isActive = commentUnitID === unitId && data.id === commentId;
        return next({
          ...data,
          active: isActive || isActiveIndex,
          show: !comment.resolved
        });
      }
    });
  }
  _initSyncComments() {
    var _a, _b, _c;
    const unitId = this._context.unit.getUnitId();
    const subUnitId = DEFAULT_DOC_SUBUNIT_ID;
    const threadIds = (_c = (_b = (_a = this._context.unit.getBody()) == null ? void 0 : _a.customDecorations) == null ? void 0 : _b.filter((i) => i.type === 0 /* COMMENT */).map((i) => i.id)) != null ? _c : [];
    threadIds.length && this._threadCommentModel.syncThreadComments(this._context.unit.getUnitId(), DEFAULT_DOC_SUBUNIT_ID, threadIds);
    let prevThreadIds = threadIds.sort();
    this.disposeWithMe(this._commandService.onCommandExecuted((commandInfo) => {
      var _a2, _b2, _c2;
      if (commandInfo.id === RichTextEditingMutation.id) {
        const params = commandInfo.params;
        if (params.unitId !== this._context.unit.getUnitId()) {
          return;
        }
        const currentThreadIds = (_c2 = (_b2 = (_a2 = this._context.unit.getBody()) == null ? void 0 : _a2.customDecorations) == null ? void 0 : _b2.filter((i) => i.type === 0 /* COMMENT */).map((i) => i.id)) != null ? _c2 : [];
        const currentThreadIdsSorted = currentThreadIds.sort();
        if (JSON.stringify(prevThreadIds) !== JSON.stringify(currentThreadIdsSorted)) {
          const preIds = new Set(prevThreadIds);
          const addIds = /* @__PURE__ */ new Set();
          currentThreadIds.forEach((id) => {
            if (!preIds.has(id)) {
              addIds.add(id);
            }
          });
          prevThreadIds = currentThreadIdsSorted;
          this._threadCommentModel.syncThreadComments(unitId, subUnitId, [...addIds]);
        }
      }
    }));
  }
};
DocThreadCommentRenderController = __decorateClass([
  __decorateParam(1, Inject(DocInterceptorService)),
  __decorateParam(2, Inject(ThreadCommentPanelService)),
  __decorateParam(3, Inject(DocRenderController)),
  __decorateParam(4, IUniverInstanceService),
  __decorateParam(5, Inject(ThreadCommentModel)),
  __decorateParam(6, ICommandService)
], DocThreadCommentRenderController);

// ../packages/docs-thread-comment-ui/src/menu/schema.ts
var menuSchema2 = {
  ["ribbon.insert.media" /* MEDIA */]: {
    [ToggleCommentPanelOperation.id]: {
      order: 3,
      menuItemFactory: ToolbarDocCommentMenuItemFactory
    }
  },
  [FLOAT_TOOLBAR_MENU_POSITION]: {
    [StartAddCommentOperation.id]: {
      order: 21,
      menuItemFactory: AddDocCommentMenuItemFactory
    }
  },
  ["contextMenu.mainArea" /* MAIN_AREA */]: {
    ["contextMenu.data" /* DATA */]: {
      [StartAddCommentOperation.id]: {
        order: 1,
        menuItemFactory: AddDocCommentMenuItemFactory
      }
    }
  }
};

// ../packages/docs-thread-comment-ui/src/controllers/ui.controller.ts
var DocThreadCommentUIController = class extends Disposable {
  constructor(_commandService, _menuManagerService) {
    super();
    __publicField(this, "_commandService", _commandService);
    __publicField(this, "_menuManagerService", _menuManagerService);
    this._initCommands();
    this._initMenus();
  }
  _initCommands() {
    [
      AddDocCommentComment,
      DeleteDocCommentComment,
      ShowCommentPanelOperation,
      StartAddCommentOperation,
      ToggleCommentPanelOperation
    ].forEach((command) => {
      this.disposeWithMe(this._commandService.registerCommand(command));
    });
  }
  _initMenus() {
    this._menuManagerService.appendRootMenu({ [FLOAT_TOOLBAR_MENU_POSITION]: {} });
    this._menuManagerService.mergeMenu(menuSchema2);
  }
};
DocThreadCommentUIController = __decorateClass([
  __decorateParam(0, ICommandService),
  __decorateParam(1, IMenuManagerService)
], DocThreadCommentUIController);

// ../packages/docs-thread-comment-ui/src/plugin.ts
var UniverDocsThreadCommentUIPlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig3, _injector, _renderManagerSrv, _configService) {
    super();
    __publicField(this, "_config", _config);
    __publicField(this, "_injector", _injector);
    __publicField(this, "_renderManagerSrv", _renderManagerSrv);
    __publicField(this, "_configService", _configService);
    const { menu, ...rest } = merge_default(
      {},
      defaultPluginConfig3,
      this._config
    );
    if (menu) {
      this._configService.setConfig("menu", menu, { merge: true });
    }
    this._configService.setConfig(DOCS_THREAD_COMMENT_UI_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    this._injector.add([ComponentsController2]);
    this._injector.get(ComponentsController2);
    [
      [DocThreadCommentUIController],
      [DocThreadCommentSelectionController],
      [DocThreadCommentService]
    ].forEach((dep) => {
      this._injector.add(dep);
    });
  }
  onRendered() {
    this._initRenderModule();
    this._injector.get(DocThreadCommentSelectionController);
    this._injector.get(DocThreadCommentUIController);
  }
  _initRenderModule() {
    [DocThreadCommentRenderController].forEach((dep) => {
      this._renderManagerSrv.registerRenderModule(1 /* UNIVER_DOC */, dep);
    });
  }
};
__publicField(UniverDocsThreadCommentUIPlugin, "pluginName", PLUGIN_NAME);
__publicField(UniverDocsThreadCommentUIPlugin, "packageName", package_default3.name);
__publicField(UniverDocsThreadCommentUIPlugin, "version", package_default3.version);
__publicField(UniverDocsThreadCommentUIPlugin, "type", 1 /* UNIVER_DOC */);
UniverDocsThreadCommentUIPlugin = __decorateClass([
  DependentOn(UniverThreadCommentUIPlugin),
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, IRenderManagerService),
  __decorateParam(3, IConfigService)
], UniverDocsThreadCommentUIPlugin);

export {
  UniverDocsHyperLinkPlugin,
  UniverDocsHyperLinkUIPlugin,
  UniverDocsThreadCommentUIPlugin
};
