import {
  IDrawingManagerService,
  SetDrawingSelectedOperation,
  UnitDrawingService,
  getDrawingShapeKeyByDrawingSearch
} from "./chunk-DXOT3Z2O.js";
import {
  AutofillDoubleIcon,
  BottomIcon,
  Button,
  Checkbox,
  ComponentManager,
  CreateCopyIcon,
  CropIcon,
  DeleteIcon,
  DocSettingIcon,
  Dropdown,
  DropdownMenu,
  GroupIcon,
  IDialogService,
  IGalleryService,
  IMenuManagerService,
  IMessageService,
  IconManager,
  InputNumber,
  MoreDownIcon,
  MoveDownIcon,
  MoveUpIcon,
  Select,
  Separator,
  TextWrapShapeIcon,
  Tooltip,
  TopmostIcon,
  UngroupIcon,
  borderClassName,
  clsx,
  require_jsx_runtime,
  require_react,
  useDependency,
  useObservable
} from "./chunk-JL7CYBV7.js";
import {
  BehaviorSubject,
  Canvas,
  DRAWING_OBJECT_LAYER_INDEX,
  Disposable,
  DrawingGroupObject,
  Group,
  ICommandService,
  IConfigService,
  IImageIoService,
  IRenderManagerService,
  IResourceManagerService,
  IURLImageService,
  IUniverInstanceService,
  Image,
  Inject,
  Injector,
  LocaleService,
  Observable,
  Plugin,
  Rect,
  Shape,
  Vector2,
  bufferTime,
  checkIfMove,
  createIdentifier,
  debounce_default,
  degToRad,
  filter,
  generateRandomId,
  getGroupState,
  map,
  merge_default,
  of,
  precisionTo,
  switchMap,
  toDisposable,
  touchDependencies,
  transformObjectOutOfGroup
} from "./chunk-M6CFAGRR.js";
import {
  __decorateClass,
  __decorateParam,
  __publicField,
  __toESM
} from "./chunk-HECJ2TYE.js";

// ../packages/docs-drawing/package.json
var package_default = {
  name: "@univerjs/docs-drawing",
  version: "0.25.0",
  private: false,
  description: "Drawing model integration for Univer Docs.",
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
    "drawing",
    "document",
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
    "@univerjs/core": "workspace:*",
    "@univerjs/drawing": "workspace:*"
  },
  devDependencies: {
    "@univerjs-infra/shared": "workspace:*",
    typescript: "^6.0.3",
    vitest: "^4.1.9"
  }
};

// ../packages/docs-drawing/src/config/config.ts
var DOCS_DRAWING_PLUGIN_CONFIG_KEY = "docs-drawing.config";
var configSymbol = Symbol(DOCS_DRAWING_PLUGIN_CONFIG_KEY);
var defaultPluginConfig = {};

// ../packages/docs-drawing/src/services/doc-drawing.service.ts
var DocDrawingService = class extends UnitDrawingService {
};
var IDocDrawingService = createIdentifier("univer.doc.plugin.doc-drawing.service");

// ../packages/docs-drawing/src/controllers/doc-drawing.controller.ts
var DOCS_DRAWING_PLUGIN = "DOC_DRAWING_PLUGIN";
var DocDrawingController = class extends Disposable {
  constructor(_docDrawingService, _drawingManagerService, _resourceManagerService, _univerInstanceService) {
    super();
    __publicField(this, "_docDrawingService", _docDrawingService);
    __publicField(this, "_drawingManagerService", _drawingManagerService);
    __publicField(this, "_resourceManagerService", _resourceManagerService);
    __publicField(this, "_univerInstanceService", _univerInstanceService);
    this._init();
  }
  _init() {
    this._initSnapshot();
  }
  _initSnapshot() {
    const toJson = (unitId) => {
      const doc = this._univerInstanceService.getUnit(unitId, 1 /* UNIVER_DOC */);
      if (doc) {
        const drawings = doc.getSnapshot().drawings;
        const drawingOrder = doc.getSnapshot().drawingsOrder;
        const data = {
          data: drawings != null ? drawings : {},
          order: drawingOrder != null ? drawingOrder : []
        };
        return JSON.stringify(data);
      }
      return "";
    };
    const parseJson = (json) => {
      if (!json) {
        return { data: {}, order: [] };
      }
      try {
        return JSON.parse(json);
      } catch (err) {
        return { data: {}, order: [] };
      }
    };
    this.disposeWithMe(
      this._resourceManagerService.registerPluginResource({
        pluginName: DOCS_DRAWING_PLUGIN,
        businesses: [1 /* UNIVER_DOC */],
        toJson: (unitId) => toJson(unitId),
        parseJson: (json) => parseJson(json),
        onUnLoad: (unitId) => {
          this._setDrawingDataForUnit(unitId, { data: {}, order: [] });
        },
        onLoad: (unitId, value) => {
          var _a, _b;
          this._setDrawingDataForUnit(unitId, { data: (_a = value.data) != null ? _a : {}, order: (_b = value.order) != null ? _b : [] });
        }
      })
    );
  }
  _setDrawingDataForUnit(unitId, drawingMapItem) {
    const documentDataModel = this._univerInstanceService.getUnit(unitId);
    if (documentDataModel == null) {
      return;
    }
    documentDataModel.resetDrawing(drawingMapItem.data, drawingMapItem.order);
    this.loadDrawingDataForUnit(unitId);
  }
  loadDrawingDataForUnit(unitId) {
    const dataModel = this._univerInstanceService.getUnit(unitId, 1 /* UNIVER_DOC */);
    if (!dataModel) {
      return false;
    }
    const subUnitId = unitId;
    const drawingDataModels = dataModel.getDrawings();
    const drawingOrderModel = dataModel.getDrawingsOrder();
    if (!drawingDataModels || !drawingOrderModel) {
      return false;
    }
    const subDrawings = {
      [subUnitId]: {
        unitId,
        subUnitId,
        data: drawingDataModels,
        order: drawingOrderModel
      }
    };
    this._docDrawingService.registerDrawingData(unitId, subDrawings);
    this._drawingManagerService.registerDrawingData(unitId, subDrawings);
    return true;
  }
};
DocDrawingController = __decorateClass([
  __decorateParam(0, IDocDrawingService),
  __decorateParam(1, IDrawingManagerService),
  __decorateParam(2, IResourceManagerService),
  __decorateParam(3, IUniverInstanceService)
], DocDrawingController);

// ../packages/docs-drawing/src/plugin.ts
var UniverDocsDrawingPlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig, _injector, _configService) {
    super();
    __publicField(this, "_config", _config);
    __publicField(this, "_injector", _injector);
    __publicField(this, "_configService", _configService);
    const { ...rest } = merge_default(
      {},
      defaultPluginConfig,
      this._config
    );
    this._configService.setConfig(DOCS_DRAWING_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    [
      [DocDrawingController],
      [DocDrawingService],
      [IDocDrawingService, { useClass: DocDrawingService }]
    ].forEach((dependency) => this._injector.add(dependency));
    touchDependencies(this._injector, [
      [DocDrawingController]
    ]);
  }
};
__publicField(UniverDocsDrawingPlugin, "pluginName", DOCS_DRAWING_PLUGIN);
__publicField(UniverDocsDrawingPlugin, "packageName", package_default.name);
__publicField(UniverDocsDrawingPlugin, "version", package_default.version);
__publicField(UniverDocsDrawingPlugin, "type", 1 /* UNIVER_DOC */);
UniverDocsDrawingPlugin = __decorateClass([
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, IConfigService)
], UniverDocsDrawingPlugin);

// ../packages/drawing-ui/package.json
var package_default2 = {
  name: "@univerjs/drawing-ui",
  version: "0.25.0",
  private: false,
  description: "Shared drawing UI components and services for Univer.",
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
    "drawing",
    "graphics",
    "ui",
    "plugin"
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
    "@univerjs/drawing": "workspace:*",
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

// ../packages/drawing-ui/src/config/config.ts
var DRAWING_UI_PLUGIN_CONFIG_KEY = "drawing-ui.config";
var configSymbol2 = Symbol(DRAWING_UI_PLUGIN_CONFIG_KEY);
var defaultPluginConfig2 = {};

// ../packages/drawing-ui/src/views/image-popup-menu/component-name.ts
var COMPONENT_IMAGE_POPUP_MENU = "COMPONENT_IMAGE_POPUP_MENU";

// ../packages/drawing-ui/src/views/image-popup-menu/ImagePopupMenu.tsx
var import_react = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
function ImagePopupMenu(props) {
  var _a, _b;
  const { popup } = props;
  const menuItems = (_a = popup == null ? void 0 : popup.extraProps) == null ? void 0 : _a.menuItems;
  if (!menuItems) return null;
  if (((_b = popup.extraProps) == null ? void 0 : _b.variant) === "doc-floating-toolbar" && popup.extraProps.unitId && popup.extraProps.subUnitId && popup.extraProps.drawingId) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      DocImageFloatingToolbar,
      {
        menuItems,
        unitId: popup.extraProps.unitId,
        subUnitId: popup.extraProps.subUnitId,
        drawingId: popup.extraProps.drawingId
      }
    );
  }
  const commandService = useDependency(ICommandService);
  const localeService = useDependency(LocaleService);
  const [visible, setVisible] = (0, import_react.useState)(false);
  const [isHovered, setHovered] = (0, import_react.useState)(false);
  const handleMouseEnter = () => {
    setHovered(true);
  };
  const handleMouseLeave = () => {
    setHovered(false);
  };
  const onVisibleChange = (visible2) => {
    setVisible(visible2);
  };
  const handleClick = (item) => {
    commandService.executeCommand(item.commandId, item.commandParams);
    setVisible(false);
  };
  const showMore = visible || isHovered;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        DropdownMenu,
        {
          align: "start",
          items: menuItems.map((item) => ({
            type: "item",
            children: localeService.t(item.label),
            disabled: item.disable,
            onSelect: () => handleClick(item)
          })),
          open: visible,
          onOpenChange: onVisibleChange,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "div",
            {
              className: clsx(`univer-flex univer-items-center univer-gap-2 univer-rounded univer-p-1 hover:univer-bg-gray-100 dark:hover:!univer-bg-gray-800`, borderClassName, {
                "univer-bg-gray-100 dark:!univer-bg-gray-800": visible,
                "univer-bg-white dark:!univer-bg-gray-900": !visible
              }),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  AutofillDoubleIcon,
                  {
                    className: `univer-fill-primary-600 univer-text-gray-900 dark:!univer-text-white`
                  }
                ),
                showMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreDownIcon, { className: "dark:!univer-text-white" })
              ]
            }
          )
        }
      )
    }
  );
}
var UPDATE_DOC_DRAWING_WRAPPING_STYLE_COMMAND_ID = "doc.command.update-doc-drawing-wrapping-style";
function getWrappingStyle(documentDataModel, drawingId) {
  var _a;
  const drawing = (_a = documentDataModel == null ? void 0 : documentDataModel.getSnapshot().drawings) == null ? void 0 : _a[drawingId];
  if (!drawing) {
    return "inline" /* INLINE */;
  }
  if (drawing.layoutType === 1 /* WRAP_NONE */) {
    return drawing.behindDoc === 1 /* TRUE */ ? "behindText" /* BEHIND_TEXT */ : "inFrontOfText" /* IN_FRONT_OF_TEXT */;
  }
  if (drawing.layoutType === 3 /* WRAP_SQUARE */) {
    return "wrapSquare" /* WRAP_SQUARE */;
  }
  if (drawing.layoutType === 6 /* WRAP_TOP_AND_BOTTOM */) {
    return "wrapTopAndBottom" /* WRAP_TOP_AND_BOTTOM */;
  }
  return "inline" /* INLINE */;
}
function ToolbarGroup(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "univer-flex univer-h-7 univer-items-center univer-gap-1 univer-px-1", children: props.children });
}
function ToolbarButton(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { title: props.title, placement: "bottom", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "button",
    {
      type: "button",
      disabled: props.disabled,
      onClick: props.onClick,
      className: clsx(`univer-flex univer-h-6 univer-w-6 univer-items-center univer-justify-center univer-rounded-md univer-border-none univer-bg-transparent univer-p-0 univer-text-sm univer-text-gray-700 univer-transition-colors hover:univer-bg-gray-100 disabled:univer-cursor-not-allowed disabled:univer-opacity-40 dark:!univer-text-gray-100 dark:hover:!univer-bg-gray-700`, {
        "univer-bg-gray-100 univer-text-primary-600 dark:!univer-bg-gray-700 dark:!univer-text-primary-300": props.active
      }),
      children: props.children
    }
  ) });
}
function ToolbarDropdownButton(props) {
  var _a;
  const [open, setOpen] = (0, import_react.useState)(false);
  const activeOption = (_a = props.options.find((option) => option.value === props.value)) != null ? _a : props.options[0];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    Dropdown,
    {
      open,
      onOpenChange: setOpen,
      overlay: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "div",
        {
          className: `univer-min-w-32 univer-rounded-lg univer-border univer-border-solid univer-border-gray-200 univer-bg-white univer-p-1 univer-shadow-lg dark:!univer-border-gray-700 dark:!univer-bg-gray-900`,
          children: props.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "button",
            {
              type: "button",
              onClick: () => {
                props.onChange(option.value);
                setOpen(false);
              },
              className: clsx(`univer-flex univer-h-8 univer-w-full univer-items-center univer-gap-2 univer-rounded-md univer-border-none univer-bg-transparent univer-px-2 univer-text-left univer-text-sm univer-text-gray-700 univer-transition-colors hover:univer-bg-gray-100 dark:!univer-text-gray-100 dark:hover:!univer-bg-gray-800`, {
                "univer-bg-primary-50 univer-text-primary-600 dark:!univer-bg-gray-800 dark:!univer-text-primary-300": option.value === props.value
              }),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "univer-flex univer-size-4 univer-items-center univer-justify-center", children: option.icon }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "univer-flex-1", children: option.label })
              ]
            },
            option.value
          ))
        }
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { title: props.title, placement: "bottom", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "button",
        {
          type: "button",
          className: clsx(`univer-flex univer-h-6 univer-min-w-9 univer-items-center univer-justify-center univer-gap-1 univer-rounded-md univer-border-none univer-bg-transparent univer-px-1.5 univer-text-sm univer-text-gray-700 univer-transition-colors hover:univer-bg-gray-100 dark:!univer-text-gray-100 dark:hover:!univer-bg-gray-700`, {
            "univer-bg-gray-100 univer-text-primary-600 dark:!univer-bg-gray-700 dark:!univer-text-primary-300": open
          }),
          children: [
            activeOption.icon,
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreDownIcon, { className: "univer-text-xs" })
          ]
        }
      ) }) })
    }
  );
}
function DocImageFloatingToolbar(props) {
  var _a, _b, _c;
  const commandService = useDependency(ICommandService);
  const localeService = useDependency(LocaleService);
  const univerInstanceService = useDependency(IUniverInstanceService);
  const documentDataModel = (_a = univerInstanceService.getUnit(props.unitId, 1 /* UNIVER_DOC */)) != null ? _a : void 0;
  const [wrappingStyle, setWrappingStyle] = (0, import_react.useState)(() => getWrappingStyle(documentDataModel, props.drawingId));
  const [hidden, setHidden] = (0, import_react.useState)(false);
  const getMenuItem = (label) => props.menuItems.find((item) => item.label === label);
  const editItem = getMenuItem("drawing-ui.image-popup.edit");
  const cropItem = getMenuItem("drawing-ui.image-popup.crop");
  const deleteItem = getMenuItem("drawing-ui.image-popup.delete");
  const wrappingStyleOptions = [
    {
      label: localeService.t("drawing-ui.image-text-wrap.inline"),
      value: "inline" /* INLINE */,
      icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextWrapShapeIcon, {})
    },
    {
      label: localeService.t("drawing-ui.image-text-wrap.square"),
      value: "wrapSquare" /* WRAP_SQUARE */,
      icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextWrapShapeIcon, {})
    },
    {
      label: localeService.t("drawing-ui.image-text-wrap.topAndBottom"),
      value: "wrapTopAndBottom" /* WRAP_TOP_AND_BOTTOM */,
      icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextWrapShapeIcon, {})
    },
    {
      label: localeService.t("drawing-ui.image-text-wrap.behindText"),
      value: "behindText" /* BEHIND_TEXT */,
      icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextWrapShapeIcon, {})
    },
    {
      label: localeService.t("drawing-ui.image-text-wrap.inFrontText"),
      value: "inFrontOfText" /* IN_FRONT_OF_TEXT */,
      icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextWrapShapeIcon, {})
    }
  ];
  const executeMenuItem = (item) => {
    if (!item || item.disable) {
      return;
    }
    commandService.executeCommand(item.commandId, item.commandParams);
  };
  const updateWrappingStyle = (value) => {
    setWrappingStyle(value);
    commandService.executeCommand(UPDATE_DOC_DRAWING_WRAPPING_STYLE_COMMAND_ID, {
      unitId: props.unitId,
      subUnitId: props.subUnitId,
      drawings: [{ unitId: props.unitId, subUnitId: props.subUnitId, drawingId: props.drawingId }],
      wrappingStyle: value
    });
  };
  if (hidden) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      "data-u-comp": "doc-image-floating-toolbar",
      onMouseDown: (event) => {
        event.stopPropagation();
        event.preventDefault();
      },
      className: clsx(`univer-box-border univer-flex univer-items-center univer-rounded univer-bg-white univer-px-1 univer-py-1 univer-shadow-sm dark:!univer-border-gray-700 dark:!univer-bg-gray-900`, borderClassName),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          ToolbarDropdownButton,
          {
            title: (_c = (_b = wrappingStyleOptions.find((option) => option.value === wrappingStyle)) == null ? void 0 : _b.label) != null ? _c : localeService.t("drawing-ui.image-text-wrap.inline"),
            value: wrappingStyle,
            options: wrappingStyleOptions,
            onChange: updateWrappingStyle
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { orientation: "vertical" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToolbarGroup, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            ToolbarButton,
            {
              title: editItem ? localeService.t(editItem.label) : localeService.t("drawing-ui.image-popup.edit"),
              disabled: !editItem || editItem.disable,
              onClick: () => {
                setHidden(true);
                executeMenuItem(editItem);
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocSettingIcon, {})
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            ToolbarButton,
            {
              title: cropItem ? localeService.t(cropItem.label) : localeService.t("drawing-ui.image-popup.crop"),
              disabled: !cropItem || cropItem.disable,
              onClick: () => executeMenuItem(cropItem),
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CropIcon, {})
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { orientation: "vertical" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          ToolbarButton,
          {
            title: deleteItem ? localeService.t(deleteItem.label) : localeService.t("drawing-ui.image-popup.delete"),
            disabled: !deleteItem || deleteItem.disable,
            onClick: () => executeMenuItem(deleteItem),
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteIcon, {})
          }
        ) })
      ]
    }
  );
}

// ../packages/drawing-ui/src/controllers/components.controller.ts
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
      [COMPONENT_IMAGE_POPUP_MENU, ImagePopupMenu]
    ].forEach(([key, component]) => {
      this.disposeWithMe(this._componentManager.register(key, component));
    });
  }
  _registerIcons() {
    this.disposeWithMe(this._iconManager.register({
      BottomIcon,
      GroupIcon,
      MoveDownIcon,
      MoveUpIcon,
      TopmostIcon,
      UngroupIcon
    }));
  }
};
ComponentsController = __decorateClass([
  __decorateParam(0, Inject(ComponentManager)),
  __decorateParam(1, Inject(IconManager))
], ComponentsController);

// ../packages/drawing-ui/src/commands/operations/drawing-align.operation.ts
var SetDrawingAlignOperation = {
  id: "sheet.operation.set-image-align",
  type: 1 /* OPERATION */,
  handler: (accessor, params) => {
    return true;
  }
};
var SetDrawingAlignLeftOperation = {
  id: "sheet.operation.set-drawing-align-left",
  type: 1 /* OPERATION */,
  handler: (accessor) => {
    return accessor.get(ICommandService).syncExecuteCommand(SetDrawingAlignOperation.id, { alignType: "1" /* left */ });
  }
};
var SetDrawingAlignCenterOperation = {
  id: "sheet.operation.set-drawing-align-center",
  type: 1 /* OPERATION */,
  handler: (accessor) => {
    return accessor.get(ICommandService).syncExecuteCommand(SetDrawingAlignOperation.id, { alignType: "2" /* center */ });
  }
};
var SetDrawingAlignRightOperation = {
  id: "sheet.operation.set-drawing-align-right",
  type: 1 /* OPERATION */,
  handler: (accessor) => {
    return accessor.get(ICommandService).syncExecuteCommand(SetDrawingAlignOperation.id, { alignType: "3" /* right */ });
  }
};
var SetDrawingAlignTopOperation = {
  id: "sheet.operation.set-drawing-align-top",
  type: 1 /* OPERATION */,
  handler: (accessor) => {
    return accessor.get(ICommandService).syncExecuteCommand(SetDrawingAlignOperation.id, { alignType: "4" /* top */ });
  }
};
var SetDrawingAlignMiddleOperation = {
  id: "sheet.operation.set-drawing-align-middle",
  type: 1 /* OPERATION */,
  handler: (accessor) => {
    return accessor.get(ICommandService).syncExecuteCommand(SetDrawingAlignOperation.id, { alignType: "5" /* middle */ });
  }
};
var SetDrawingAlignBottomOperation = {
  id: "sheet.operation.set-drawing-align-bottom",
  type: 1 /* OPERATION */,
  handler: (accessor) => {
    return accessor.get(ICommandService).syncExecuteCommand(SetDrawingAlignOperation.id, { alignType: "6" /* bottom */ });
  }
};
var SetDrawingAlignHorizonOperation = {
  id: "sheet.operation.set-drawing-align-horizon",
  type: 1 /* OPERATION */,
  handler: (accessor) => {
    return accessor.get(ICommandService).syncExecuteCommand(SetDrawingAlignOperation.id, { alignType: "7" /* horizon */ });
  }
};
var SetDrawingAlignVerticalOperation = {
  id: "sheet.operation.set-drawing-align-vertical",
  type: 1 /* OPERATION */,
  handler: (accessor) => {
    return accessor.get(ICommandService).syncExecuteCommand(SetDrawingAlignOperation.id, { alignType: "8" /* vertical */ });
  }
};

// ../packages/drawing-ui/src/commands/operations/image-crop.operation.ts
var OpenImageCropOperation = {
  id: "sheet.operation.open-image-crop",
  type: 1 /* OPERATION */,
  handler: (accessor, params) => {
    return true;
  }
};
var CloseImageCropOperation = {
  id: "sheet.operation.close-image-crop",
  type: 1 /* OPERATION */,
  handler: (accessor, params) => {
    return true;
  }
};
var AutoImageCropOperation = {
  id: "sheet.operation.Auto-image-crop",
  type: 1 /* OPERATION */,
  handler: (accessor, params) => {
    return true;
  }
};

// ../packages/drawing-ui/src/controllers/utils.ts
function insertGroupObject(objectParam, object, scene, drawingManagerService) {
  const groupParam = drawingManagerService.getDrawingByParam(objectParam);
  if (groupParam == null) {
    return;
  }
  const groupKey = getDrawingShapeKeyByDrawingSearch(objectParam);
  const groupObject = scene.getObjectIncludeInGroup(groupKey);
  if (groupObject && !(groupObject instanceof Group)) {
    return;
  }
  if (groupObject != null) {
    const objects = groupObject.getObjects();
    for (const obj of objects) {
      if (obj.oKey === object.oKey) {
        return;
      }
    }
    groupObject.addObject(object);
    return;
  }
  const group = new DrawingGroupObject(groupKey);
  scene.addObject(group, DRAWING_OBJECT_LAYER_INDEX).attachTransformerTo(group);
  group.addObject(object);
  const { transform, groupBaseBound } = groupParam;
  if (groupBaseBound) {
    group.setBaseBound(groupBaseBound);
  }
  if (groupParam.groupId) {
    group.isInGroup = true;
    insertGroupObject(
      { drawingId: groupParam.groupId, unitId: objectParam.unitId, subUnitId: objectParam.subUnitId },
      group,
      scene,
      drawingManagerService
    );
  }
  transform && group.transformByState(
    {
      left: transform.left,
      top: transform.top,
      angle: transform.angle,
      width: transform.width,
      height: transform.height
    }
  );
}
function getCurrentUnitInfo(currentUniverService, propUnitId) {
  var _a;
  const current = propUnitId ? currentUniverService.getUnit(propUnitId) : currentUniverService.getFocusedUnit();
  if (current == null) {
    return;
  }
  const unitId = current.getUnitId();
  let subUnitId;
  if (current.type === 2 /* UNIVER_SHEET */) {
    subUnitId = (_a = current.getActiveSheet()) == null ? void 0 : _a.getSheetId();
  } else if (current.type === 1 /* UNIVER_DOC */) {
    subUnitId = unitId;
  } else if (current.type === 3 /* UNIVER_SLIDE */) {
    subUnitId = unitId;
  }
  return { unitId, subUnitId, current };
}

// ../packages/drawing-ui/src/services/drawing-image-clip.service.ts
var IMAGE_CLIP_SHAPE_PICKER_COMPONENT = "sheet.image-clip.shape.picker.component";
var DrawingImageClipService = class extends Disposable {
  constructor() {
    super();
    __publicField(this, "_clipDelegate", null);
    __publicField(this, "_canUseShapeClip$", new BehaviorSubject(false));
    __publicField(this, "canUseShapeClip$", this._canUseShapeClip$.asObservable());
  }
  setCanUseShapeClip(canUse) {
    this._canUseShapeClip$.next(canUse);
  }
  /**
   * Register a clip delegate that knows how to build shape clip paths.
   * Typically called by the pro-side plugin with a ShapeModel-based implementation.
   * @returns IDisposable to unregister the delegate
   */
  registerClipDelegate(delegate) {
    this._clipDelegate = delegate;
    return toDisposable(() => {
      if (this._clipDelegate === delegate) {
        this._clipDelegate = null;
      }
    });
  }
  applyShapeClip(ctx, prstGeom, width, height, adjustValues) {
    if (this._clipDelegate) {
      return this._clipDelegate(ctx, prstGeom, width, height, adjustValues);
    }
    return false;
  }
  dispose() {
    this._clipDelegate = null;
    this._canUseShapeClip$.complete();
    super.dispose();
  }
};

// ../packages/drawing-ui/src/services/drawing-render.service.ts
var DOC_DRAWING_BEHIND_TEXT_LAYER_INDEX = 1;
function getDrawingRenderLayerIndex(param) {
  return param.behindText === true || param.behindText === 1 /* TRUE */ ? DOC_DRAWING_BEHIND_TEXT_LAYER_INDEX : DRAWING_OBJECT_LAYER_INDEX;
}
function ensureDrawingRenderLayer(scene, object, param) {
  const layerIndex = getDrawingRenderLayerIndex(param);
  if (object.layer == null || object.layer.zIndex === layerIndex) {
    return;
  }
  scene.removeObject(object);
  scene.addObject(object, layerIndex);
}
function isRenderableImageCache(image) {
  return (image == null ? void 0 : image.complete) === true && image.naturalWidth > 0 && image.naturalHeight > 0;
}
var DrawingRenderService = class {
  constructor(_drawingManagerService, _imageIoService, _galleryService, _urlImageService, _univerInstanceService, _drawingImageClipService) {
    __publicField(this, "_drawingManagerService", _drawingManagerService);
    __publicField(this, "_imageIoService", _imageIoService);
    __publicField(this, "_galleryService", _galleryService);
    __publicField(this, "_urlImageService", _urlImageService);
    __publicField(this, "_univerInstanceService", _univerInstanceService);
    __publicField(this, "_drawingImageClipService", _drawingImageClipService);
  }
  // eslint-disable-next-line max-lines-per-function, complexity
  async renderImages(imageParam, scene) {
    var _a;
    const {
      transform: singleTransform,
      drawingType,
      source,
      imageSourceType,
      srcRect,
      prstGeom,
      groupId,
      unitId,
      subUnitId,
      drawingId,
      isMultiTransform,
      transforms: multiTransforms,
      adjustValues,
      hidden
    } = imageParam;
    if (drawingType !== 0 /* DRAWING_IMAGE */) {
      return;
    }
    if (!this._drawingManagerService.getDrawingVisible()) {
      return;
    }
    if (this._univerInstanceService.getUnitType(unitId) === 2 /* UNIVER_SHEET */ && subUnitId !== this._getActiveSheetId()) {
      return;
    }
    if (singleTransform == null) {
      return;
    }
    const transforms = isMultiTransform && multiTransforms ? multiTransforms : [singleTransform];
    const images = [];
    for (const transform of transforms) {
      const { left, top, width, height, angle, flipX, flipY, skewX, skewY } = transform;
      const index = transforms.indexOf(transform);
      const imageShapeKey = getDrawingShapeKeyByDrawingSearch({ unitId, subUnitId, drawingId }, isMultiTransform ? index : void 0);
      const imageShape = scene.getObject(imageShapeKey);
      if (imageShape != null) {
        imageShape.transformByState({ left, top, width, height, angle, flipX, flipY, skewX, skewY });
        (_a = imageShape.setClipBounds) == null ? void 0 : _a.call(imageShape, transform.clipBounds);
        ensureDrawingRenderLayer(scene, imageShape, imageParam);
        continue;
      }
      const orders = this._drawingManagerService.getDrawingOrder(unitId, subUnitId);
      const zIndex = orders.indexOf(drawingId);
      const imageConfig = { ...transform, zIndex: zIndex === -1 ? orders.length - 1 : zIndex };
      const imageNativeCache = this._imageIoService.getImageSourceCache(source, imageSourceType);
      let shouldBeCache = false;
      if (isRenderableImageCache(imageNativeCache)) {
        imageConfig.image = imageNativeCache;
      } else {
        if (imageSourceType === "UUID" /* UUID */) {
          try {
            imageConfig.url = await this._imageIoService.getImage(source);
          } catch (error) {
            console.error(error);
            continue;
          }
        } else if (imageSourceType === "URL" /* URL */) {
          try {
            imageConfig.url = await this._urlImageService.getImage(source);
          } catch (error) {
            console.error(error);
            imageConfig.url = source;
          }
          shouldBeCache = true;
        } else {
          imageConfig.url = source;
          shouldBeCache = true;
        }
      }
      if (hidden) {
        imageConfig.visible = false;
      }
      if (scene.getObject(imageShapeKey)) {
        continue;
      }
      imageConfig.printable = true;
      const image = new Image(imageShapeKey, imageConfig);
      image.setClipService(this._drawingImageClipService);
      if (shouldBeCache) {
        this._imageIoService.addImageSourceCache(source, imageSourceType, image.getNative());
      }
      scene.addObject(image, getDrawingRenderLayerIndex(imageParam));
      if (this._drawingManagerService.getDrawingEditable()) {
        scene.attachTransformerTo(image);
      }
      groupId && insertGroupObject({ drawingId: groupId, unitId, subUnitId }, image, scene, this._drawingManagerService);
      if (prstGeom != null) {
        image.setPrstGeom(prstGeom);
      }
      if (adjustValues != null) {
        image.setPrstGeomAdjValues(adjustValues);
      }
      if (srcRect != null) {
        image.setSrcRect(srcRect);
      }
      images.push(image);
    }
    return images;
  }
  _getActiveSheetId() {
    var _a, _b;
    return (_b = (_a = this._univerInstanceService.getCurrentUnitOfType(2 /* UNIVER_SHEET */)) == null ? void 0 : _a.getActiveSheet()) == null ? void 0 : _b.getSheetId();
  }
  renderFloatDom(param, scene) {
    const {
      transform: singleTransform,
      drawingType,
      groupId,
      unitId,
      subUnitId,
      drawingId,
      isMultiTransform,
      transforms: multiTransforms
    } = param;
    if (drawingType !== 8 /* DRAWING_DOM */) {
      return;
    }
    if (!this._drawingManagerService.getDrawingVisible()) {
      return;
    }
    if (singleTransform == null) {
      return;
    }
    const transforms = isMultiTransform && multiTransforms ? multiTransforms : [singleTransform];
    const rects = [];
    for (const transform of transforms) {
      const { left, top, width, height, angle, flipX, flipY, skewX, skewY } = transform;
      const index = transforms.indexOf(transform);
      const imageShapeKey = getDrawingShapeKeyByDrawingSearch({ unitId, subUnitId, drawingId }, isMultiTransform ? index : void 0);
      const imageShape = scene.getObject(imageShapeKey);
      if (imageShape != null) {
        imageShape.transformByState({ left, top, width, height, angle, flipX, flipY, skewX, skewY });
        continue;
      }
      const orders = this._drawingManagerService.getDrawingOrder(unitId, subUnitId);
      const zIndex = orders.indexOf(drawingId);
      const rectConfig = { ...transform, zIndex: zIndex === -1 ? orders.length - 1 : zIndex };
      if (scene.getObject(imageShapeKey)) {
        continue;
      }
      rectConfig.printable = false;
      const rect = new Rect(imageShapeKey, rectConfig);
      if (!this._drawingManagerService.getDrawingVisible()) {
        continue;
      }
      scene.addObject(rect, DRAWING_OBJECT_LAYER_INDEX);
      if (this._drawingManagerService.getDrawingEditable() && param.allowTransform !== false) {
        scene.attachTransformerTo(rect);
      }
      groupId && insertGroupObject({ drawingId: groupId, unitId, subUnitId }, rect, scene, this._drawingManagerService);
      rects.push(rect);
    }
    return rects;
  }
  renderDrawing(param, scene) {
    const drawingParam = this._drawingManagerService.getDrawingByParam(param);
    if (drawingParam == null) {
      return;
    }
    switch (drawingParam.drawingType) {
      case 0 /* DRAWING_IMAGE */:
        return this.renderImages(drawingParam, scene);
      default:
    }
  }
  previewImage(key, src, width, height) {
    this._galleryService.open({
      images: [src],
      onOpenChange: (open) => {
        if (!open) {
          this._galleryService.close();
        }
      }
    });
  }
  _adjustImageSize(nativeWidth, nativeHeight, screenWidth, screenHeight) {
    if (nativeWidth <= screenWidth && nativeHeight <= screenHeight) {
      return {
        width: nativeWidth,
        height: nativeHeight
      };
    }
    const widthRatio = screenWidth / nativeWidth;
    const heightRatio = screenHeight / nativeHeight;
    const scale = Math.min(widthRatio, heightRatio);
    return {
      width: Math.floor(nativeWidth * scale),
      height: Math.floor(nativeHeight * scale)
    };
  }
};
DrawingRenderService = __decorateClass([
  __decorateParam(0, IDrawingManagerService),
  __decorateParam(1, IImageIoService),
  __decorateParam(2, IGalleryService),
  __decorateParam(3, IURLImageService),
  __decorateParam(4, IUniverInstanceService),
  __decorateParam(5, Inject(DrawingImageClipService))
], DrawingRenderService);

// ../packages/drawing-ui/src/utils/get-update-params.ts
function getUpdateParams(objects, drawingManagerService) {
  const params = [];
  objects.forEach((object) => {
    const { oKey, left, top, height, width, angle } = object;
    const searchParam = drawingManagerService.getDrawingOKey(oKey);
    if (searchParam == null) {
      params.push(null);
      return true;
    }
    const { unitId, subUnitId, drawingId, drawingType } = searchParam;
    const param = {
      unitId,
      subUnitId,
      drawingId,
      drawingType,
      transform: {
        left,
        top,
        height,
        width,
        angle
      }
    };
    if (drawingType === 0 /* DRAWING_IMAGE */) {
      param.srcRect = object.srcRect;
    }
    params.push(param);
  });
  return params;
}

// ../packages/drawing-ui/src/controllers/drawing-update.controller.ts
var DrawingUpdateController = class extends Disposable {
  constructor(_currentUniverService, _commandService, _renderManagerService, _drawingManagerService) {
    super();
    __publicField(this, "_currentUniverService", _currentUniverService);
    __publicField(this, "_commandService", _commandService);
    __publicField(this, "_renderManagerService", _renderManagerService);
    __publicField(this, "_drawingManagerService", _drawingManagerService);
    __publicField(this, "_sceneListenerOnDrawingMap", /* @__PURE__ */ new WeakSet());
    this._initialize();
  }
  dispose() {
    super.dispose();
  }
  _initialize() {
    this._recoveryImages();
    this._drawingAddListener();
    this._drawingRemoveListener();
    this._drawingUpdateListener();
    this._commandExecutedListener();
    this._drawingArrangeListener();
    this._drawingGroupListener();
    this._drawingRefreshListener();
    this._drawingVisibleListener();
  }
  _recoveryImages() {
    const drawingList = this._drawingManagerService.drawingManagerData;
    const info = getCurrentUnitInfo(this._currentUniverService);
    if (info == null) {
      return;
    }
    const { unitId: currentUnitId, subUnitId: currentSubUnitId } = info;
    Object.keys(drawingList).forEach((unitId) => {
      Object.keys(drawingList[unitId]).forEach((subUnitId) => {
        const drawingMap = drawingList[unitId][subUnitId].data;
        if (drawingMap == null || unitId !== currentUnitId || subUnitId !== currentSubUnitId) {
          return;
        }
        Object.keys(drawingMap).forEach((drawingId) => {
          const drawing = drawingMap[drawingId];
          if (drawing) {
            this._insertDrawing([{ unitId, subUnitId, drawingId }]);
          }
        });
      });
    });
  }
  _commandExecutedListener() {
    this.disposeWithMe(
      this._commandService.onCommandExecuted((command) => {
        if (command.id === SetDrawingAlignOperation.id) {
          const params = command.params;
          if (params == null) {
            return;
          }
          this._drawingAlign(params);
        }
      })
    );
  }
  _drawingGroupListener() {
    this.disposeWithMe(
      this._drawingManagerService.group$.subscribe((params) => {
        this._groupDrawings(params);
      })
    );
    this.disposeWithMe(
      this._drawingManagerService.ungroup$.subscribe((params) => {
        this._ungroupDrawings(params);
      })
    );
  }
  // private _drawingGroup(params: ISetImageGroupOperationParams) {
  //     const { groupType } = params;
  //     const drawings = this._drawingManagerService.getFocusDrawings();
  //     if (drawings.length === 0) {
  //         return;
  //     }
  //     switch (groupType) {
  //         case GroupType.group:
  //             this._groupDrawings(drawings);
  //             break;
  //         case GroupType.regroup:
  //             this._regroupDrawings(drawings);
  //             break;
  //         case GroupType.ungroup:
  //             this._ungroupDrawings(drawings);
  //             break;
  //         default:
  //             break;
  //     }
  // }
  _getSceneAndTransformerByDrawingSearch(unitId) {
    if (unitId == null) {
      return;
    }
    const renderObject = this._renderManagerService.getRenderById(unitId);
    const scene = renderObject == null ? void 0 : renderObject.scene;
    if (scene == null) {
      return null;
    }
    const transformer = scene.getTransformerByCreate();
    return { scene, transformer };
  }
  _groupDrawings(drawings) {
    drawings.forEach((drawing) => {
      this._groupDrawing(drawing);
    });
  }
  _groupDrawing(params) {
    const { parent, children } = params;
    const { unitId, subUnitId, drawingId } = parent;
    const renderObject = this._getSceneAndTransformerByDrawingSearch(parent.unitId);
    if (renderObject == null) {
      return;
    }
    const { scene, transformer } = renderObject;
    this._commandService.syncExecuteCommand(CloseImageCropOperation.id);
    const objects = [];
    children.forEach((drawing) => {
      const drawingShapeKey = getDrawingShapeKeyByDrawingSearch(drawing);
      const object = scene.getObjectIncludeInGroup(drawingShapeKey);
      if (object == null || objects.includes(object)) {
        return;
      }
      objects.push(object);
      const { transform } = drawing;
      if (transform == null) {
        return;
      }
      if (object.classType === "Group" /* GROUP */) {
        object.transformByState({ left: transform.left, top: transform.top });
      } else {
        object.transformByState(transform);
      }
    });
    if (objects.length === 0) {
      return;
    }
    const groupKey = getDrawingShapeKeyByDrawingSearch({ unitId, subUnitId, drawingId });
    const group = new DrawingGroupObject(groupKey);
    scene.addObject(group, DRAWING_OBJECT_LAYER_INDEX).attachTransformerTo(group);
    group.addObjects(...objects);
    if (parent.groupBaseBound) {
      group.setBaseBound(parent.groupBaseBound);
    }
    if (parent.groupId) {
      group.isInGroup = true;
      insertGroupObject(
        { drawingId: parent.groupId, unitId, subUnitId },
        group,
        scene,
        this._drawingManagerService
      );
    }
    parent.transform && group.transformByState({ left: parent.transform.left, top: parent.transform.top, width: parent.transform.width, height: parent.transform.height, angle: parent.transform.angle });
    transformer.clearSelectedObjects();
    transformer.setSelectedControl(group);
  }
  // private _regroupDrawings(drawings: IDrawingSearch[]) {
  //     const renderObject = this._getSceneAndTransformerByDrawingSearch(drawings[0].unitId);
  //     if (renderObject == null) {
  //         return;
  //     }
  //     const { scene, transformer } = renderObject;
  //     const objects: BaseObject[] = [];
  //     let firstGroup: Nullable<Group> = null;
  //     drawings.forEach((drawing) => {
  //         const imageShapeKey = getDrawingShapeKeyByDrawingSearch(drawing);
  //         const o = scene.getObject(imageShapeKey);
  //         if (o == null) {
  //             return true;
  //         }
  //         const group = o.ancestorGroup as Nullable<Group>;
  //         if (group != null && firstGroup == null) {
  //             firstGroup = group;
  //         } else if (group != null && !objects.includes(group)) {
  //             objects.push(group);
  //         } else if (!objects.includes(o)) {
  //             objects.push(o);
  //         }
  //     });
  //     if (firstGroup == null) {
  //         return;
  //     }
  //     if (objects.length === 0) {
  //         return;
  //     }
  //     (firstGroup as Group).addObjects(...objects);
  //     (firstGroup as Group).reCalculateObjects();
  //     transformer.clearSelectedObjects();
  //     transformer.setSelectedControl(firstGroup);
  // }
  _ungroupDrawings(drawings) {
    drawings.forEach((drawing) => {
      this._ungroupDrawing(drawing);
    });
  }
  _ungroupDrawing(drawing) {
    const { parent, children } = drawing;
    const renderObject = this._getSceneAndTransformerByDrawingSearch(parent.unitId);
    if (renderObject == null) {
      return;
    }
    const { scene, transformer } = renderObject;
    children.forEach((drawing2) => {
      const drawingKey = getDrawingShapeKeyByDrawingSearch(drawing2);
      const object = scene.getObjectIncludeInGroup(drawingKey);
      if (object == null) {
        return true;
      }
      if (object == null) {
        return;
      }
      const { transform } = drawing2;
      if (transform == null) {
        return;
      }
      if (object.classType === "Group" /* GROUP */) {
        object.transformByState({ left: transform.left, top: transform.top });
      } else {
        object.transformByState(transform);
      }
    });
    const groupKey = getDrawingShapeKeyByDrawingSearch(parent);
    const group = scene.getObject(groupKey);
    const { width, height } = group;
    group.getObjects().forEach((object) => {
      group.removeSelfObjectAndTransform(object.oKey, width, height);
    });
    group.dispose();
    transformer.clearSelectedObjects();
  }
  _drawingAlign(params) {
    const { alignType } = params;
    const drawings = params.drawings || this._drawingManagerService.getFocusDrawings();
    if (alignType === "0" /* default */) {
      return;
    }
    const drawingTransformCaches = [];
    let minLeft = Number.POSITIVE_INFINITY;
    let minTop = Number.POSITIVE_INFINITY;
    let maxRight = Number.NEGATIVE_INFINITY;
    let maxBottom = Number.NEGATIVE_INFINITY;
    let drawingCount = 0;
    drawings.forEach((drawing) => {
      const { unitId, subUnitId, drawingId, drawingType } = drawing;
      const drawingParam = this._drawingManagerService.getDrawingByParam({ unitId, subUnitId, drawingId });
      if (drawingParam == null || drawingParam.transform == null) {
        return;
      }
      drawingTransformCaches.push({
        unitId,
        subUnitId,
        drawingId,
        drawingType,
        transform: drawingParam.transform
      });
      const { left = 0, top = 0, width = 0, height = 0 } = drawingParam.transform;
      minLeft = Math.min(minLeft, left);
      minTop = Math.min(minTop, top);
      maxRight = Math.max(maxRight, left + width);
      maxBottom = Math.max(maxBottom, top + height);
      drawingCount++;
    });
    if (drawingCount === 0) {
      return;
    }
    this._sortDrawingTransform(drawingTransformCaches, alignType);
    this._applyAlignType(drawingTransformCaches, alignType, minLeft, minTop, maxRight, maxBottom, drawingCount);
  }
  _applyAlignType(drawingTransformCaches, alignType, minLeft, minTop, maxRight, maxBottom, drawingCount) {
    const averageHorizon = Math.round((maxRight - minLeft) / drawingCount * 10) / 10;
    const averageVertical = Math.round((maxBottom - minTop) / drawingCount * 10) / 10;
    const updateParams = [];
    const renderObject = this._getSceneAndTransformerByDrawingSearch(drawingTransformCaches[0].unitId);
    if (renderObject == null) {
      return;
    }
    const { scene, transformer } = renderObject;
    drawingTransformCaches.forEach((drawingTransformCache, index) => {
      const { unitId, subUnitId, drawingId, transform, drawingType } = drawingTransformCache;
      const { left = 0, top = 0, width = 0, height = 0 } = transform;
      let newLeft = left;
      let newTop = top;
      switch (alignType) {
        case "1" /* left */:
          newLeft = minLeft;
          break;
        case "2" /* center */:
          newLeft = minLeft + (maxRight - minLeft) / 2 - width / 2;
          break;
        case "3" /* right */:
          newLeft = maxRight - width;
          break;
        case "4" /* top */:
          newTop = minTop;
          break;
        case "5" /* middle */:
          newTop = minTop + (maxBottom - minTop) / 2 - height / 2;
          break;
        case "6" /* bottom */:
          newTop = maxBottom - height;
          break;
        case "7" /* horizon */:
          newLeft = minLeft + averageHorizon * index;
          break;
        case "8" /* vertical */:
          newTop = minTop + averageVertical * index;
          break;
        default:
          break;
      }
      if (newLeft !== left || newTop !== top) {
        updateParams.push({
          unitId,
          subUnitId,
          drawingId,
          drawingType,
          transform: {
            left: newLeft,
            top: newTop
          }
        });
      }
    });
    this._drawingManagerService.featurePluginUpdateNotification(updateParams);
    transformer.refreshControls().changeNotification();
  }
  _sortDrawingTransform(drawingTransformCaches, alignType) {
    drawingTransformCaches.sort((a, b) => {
      const aTransform = a.transform;
      const bTransform = b.transform;
      const {
        left: aLeft = 0,
        top: aTop = 0,
        width: aWidth = 0,
        height: aHeight = 0
      } = aTransform;
      const {
        left: bLeft = 0,
        top: bTop = 0,
        width: bWidth = 0,
        height: bHeight = 0
      } = bTransform;
      switch (alignType) {
        case "1" /* left */:
          return aLeft - bLeft;
        case "2" /* center */:
          return aLeft + aWidth / 2 - (bLeft + bWidth / 2);
        case "3" /* right */:
          return aLeft + aWidth - (bLeft + bWidth);
        case "4" /* top */:
          return aTop - bTop;
        case "5" /* middle */:
          return aTop + aHeight / 2 - (bTop + bHeight / 2);
        case "6" /* bottom */:
          return aTop + aHeight - (bTop + bHeight);
        case "7" /* horizon */:
          return aLeft + aWidth / 2 - (bLeft + bWidth / 2);
        case "8" /* vertical */:
          return aTop + aHeight / 2 - (bTop + bHeight / 2);
        default:
          return 0;
      }
    });
  }
  _drawingArrangeListener() {
    this.disposeWithMe(
      this._drawingManagerService.order$.subscribe((params) => {
        this._drawingArrange(params);
      })
    );
  }
  _drawingArrange(params) {
    const { unitId, subUnitId, drawingIds } = params;
    const renderObject = this._getSceneAndTransformerByDrawingSearch(unitId);
    if (renderObject == null) {
      return;
    }
    const { scene } = renderObject;
    drawingIds.forEach((drawingId) => {
      const oKey = getDrawingShapeKeyByDrawingSearch({ unitId, subUnitId, drawingId });
      const drawingShapes = scene.fuzzyMathObjects(oKey, true);
      if (drawingShapes == null || drawingShapes.length === 0) {
        return;
      }
      const index = this._drawingManagerService.getDrawingOrder(unitId, subUnitId).indexOf(drawingId);
      for (const shape of drawingShapes) {
        shape.setProps({ zIndex: index });
        shape.makeDirty();
      }
    });
  }
  _drawingAddListener() {
    this.disposeWithMe(
      this._drawingManagerService.add$.subscribe((params) => {
        this._insertDrawing(params);
      })
    );
  }
  _insertDrawing(params) {
    const sceneList = [];
    params.forEach((param) => {
      const { unitId } = param;
      const drawingParam = this._drawingManagerService.getDrawingByParam(param);
      if (drawingParam == null) {
        return;
      }
      const renderObject = this._getSceneAndTransformerByDrawingSearch(unitId);
      if (renderObject == null) {
        return;
      }
      const { scene } = renderObject;
      if (!sceneList.includes(scene)) {
        sceneList.push(scene);
      }
    });
    sceneList.forEach((scene) => {
      if (this._sceneListenerOnDrawingMap.has(scene)) {
        return;
      }
      this._addListenerOnDrawing(scene);
      this._sceneListenerOnDrawingMap.add(scene);
    });
  }
  _drawingRemoveListener() {
    this.disposeWithMe(
      this._drawingManagerService.remove$.subscribe((params) => {
        params.forEach((param) => {
          var _a;
          const { unitId, subUnitId, drawingId } = param;
          const renderObject = this._getSceneAndTransformerByDrawingSearch(unitId);
          if (renderObject == null) {
            return;
          }
          const { scene } = renderObject;
          const drawingShapeKey = getDrawingShapeKeyByDrawingSearch({ unitId, subUnitId, drawingId });
          const drawingShapes = scene.fuzzyMathObjects(drawingShapeKey, true);
          if (drawingShapes.length > 0) {
            for (const drawingShape of drawingShapes) {
              drawingShape.dispose();
            }
            (_a = scene.getTransformer()) == null ? void 0 : _a.clearSelectedObjects();
          }
        });
      })
    );
  }
  _drawingUpdateListener() {
    this.disposeWithMe(
      this._drawingManagerService.update$.subscribe((params) => {
        params.forEach((param) => {
          var _a, _b;
          const { unitId, subUnitId, drawingId } = param;
          const drawingParam = this._drawingManagerService.getDrawingByParam(param);
          if (drawingParam == null) {
            return;
          }
          const { transform, drawingType } = drawingParam;
          const renderObject = this._getSceneAndTransformerByDrawingSearch(unitId);
          if (renderObject == null) {
            return;
          }
          const { scene, transformer } = renderObject;
          if (transform == null) {
            return true;
          }
          const { left = 0, top = 0, width = 0, height = 0, angle = 0, flipX = false, flipY = false, skewX = 0, skewY = 0 } = transform;
          const drawingShapeKey = getDrawingShapeKeyByDrawingSearch({ unitId, subUnitId, drawingId });
          const drawingShape = scene.getObject(drawingShapeKey);
          if (drawingShape == null) {
            return true;
          }
          drawingShape.transformByState({ left, top, width, height, angle, flipX, flipY, skewX, skewY });
          (_a = drawingShape.setClipBounds) == null ? void 0 : _a.call(drawingShape, transform.clipBounds);
          ensureDrawingRenderLayer(scene, drawingShape, drawingParam);
          (_b = scene.getTransformer()) == null ? void 0 : _b.debounceRefreshControls();
        });
      })
    );
  }
  _drawingRefreshListener() {
    this.disposeWithMe(
      this._drawingManagerService.refreshTransform$.subscribe((params) => {
        params.forEach((param) => {
          var _a;
          const { unitId, subUnitId, drawingId } = param;
          const renderObject = this._getSceneAndTransformerByDrawingSearch(unitId);
          if (renderObject == null) {
            return;
          }
          const drawingParam = this._drawingManagerService.getDrawingByParam(param);
          if (drawingParam == null) {
            return;
          }
          const { transform } = drawingParam;
          const { scene } = renderObject;
          if (transform == null) {
            return true;
          }
          const drawingShapeKey = getDrawingShapeKeyByDrawingSearch({ unitId, subUnitId, drawingId });
          const drawingShape = scene.getObject(drawingShapeKey);
          if (drawingShape == null) {
            this._drawingManagerService.addNotification([{ unitId, subUnitId, drawingId }]);
            return true;
          }
          const {
            left = 0,
            top = 0,
            width = 0,
            height = 0,
            angle = 0,
            flipX = false,
            flipY = false,
            skewX = 0,
            skewY = 0
          } = transform;
          drawingShape.transformByState({ left, top, width, height, angle, flipX, flipY, skewX, skewY });
          (_a = drawingShape.setClipBounds) == null ? void 0 : _a.call(drawingShape, transform.clipBounds);
          ensureDrawingRenderLayer(scene, drawingShape, drawingParam);
        });
      })
    );
  }
  _drawingVisibleListener() {
    this.disposeWithMe(
      this._drawingManagerService.visible$.subscribe((params) => {
        params.forEach((param) => {
          const { unitId, subUnitId, drawingId, visible } = param;
          const renderObject = this._getSceneAndTransformerByDrawingSearch(unitId);
          if (renderObject == null) {
            return;
          }
          const { scene } = renderObject;
          const drawingShapeKey = getDrawingShapeKeyByDrawingSearch({ unitId, subUnitId, drawingId });
          const drawingShape = scene.getObject(drawingShapeKey);
          if (drawingShape == null) {
            return true;
          }
          if (visible) {
            drawingShape.show();
          } else {
            drawingShape.hide();
          }
        });
      })
    );
  }
  _filterUpdateParams(params, startTransforms) {
    return params.filter((param, index) => {
      if (param == null) {
        return false;
      }
      const { transform } = param;
      return checkIfMove(transform, startTransforms == null ? void 0 : startTransforms[index]);
    });
  }
  // group?.getObjects().forEach((o) => {
  //     const drawing = this._drawingManagerService.getDrawingOKey(o.oKey);
  //     if (drawing != null) {
  //         const { unitId, subUnitId, drawingId } = drawing;
  //         drawings.push({ unitId, subUnitId, drawingId });
  //     }
  // });
  _addListenerOnDrawing(scene) {
    const transformer = scene.getTransformerByCreate();
    let startTransforms = null;
    this.disposeWithMe(
      toDisposable(
        transformer.changeStart$.subscribe((state) => {
          const { objects } = state;
          const objectArray = Array.from(objects.values());
          const drawings = [];
          startTransforms = objectArray.map((object) => {
            const { left, top, height, width, angle, oKey, isInGroup } = object;
            const drawing = this._drawingManagerService.getDrawingOKey(oKey);
            if (isInGroup || object instanceof Group) {
              let group = object.ancestorGroup;
              if (group == null && object instanceof Group) {
                group = object;
              }
              if (group == null) {
                return null;
              }
              const groupDrawing = this._drawingManagerService.getDrawingOKey(group.oKey);
              if (groupDrawing) {
                const { unitId, subUnitId, drawingId } = groupDrawing;
                drawings.push({ unitId, subUnitId, drawingId });
                const { left: left2, top: top2, height: height2, width: width2, angle: angle2 } = group;
                return { left: left2, top: top2, height: height2, width: width2, angle: angle2 };
              }
            } else if (drawing != null) {
              const { unitId, subUnitId, drawingId } = drawing;
              drawings.push({ unitId, subUnitId, drawingId });
              return { left, top, height, width, angle };
            }
            return null;
          }).filter((transform) => transform != null);
          if (drawings.length > 0) {
            this._commandService.syncExecuteCommand(SetDrawingSelectedOperation.id, drawings);
          } else {
            this._commandService.syncExecuteCommand(SetDrawingSelectedOperation.id, []);
          }
        })
      )
    );
    this.disposeWithMe(
      toDisposable(
        transformer.changeEnd$.subscribe((state) => {
          const { objects } = state;
          const params = this._filterUpdateParams(getUpdateParams(objects, this._drawingManagerService), startTransforms);
          if (params.length > 0) {
            this._drawingManagerService.featurePluginUpdateNotification(params);
          }
        })
      )
    );
  }
};
DrawingUpdateController = __decorateClass([
  __decorateParam(0, IUniverInstanceService),
  __decorateParam(1, ICommandService),
  __decorateParam(2, IRenderManagerService),
  __decorateParam(3, IDrawingManagerService)
], DrawingUpdateController);

// ../packages/drawing-ui/src/views/crop/image-cropper-object.ts
var ImageCropperObject = class extends Shape {
  constructor(key, props) {
    if (props == null) {
      props = {};
    }
    props.transformerConfig = {
      keepRatio: false,
      isCropper: true,
      anchorFill: "rgb(0, 0, 0)",
      anchorStroke: "rgb(255, 255, 255)",
      anchorSize: 24
    };
    super(key, props);
    __publicField(this, "_srcRect");
    __publicField(this, "_prstGeom");
    __publicField(this, "_applyTransform");
    __publicField(this, "_dragPadding", 8);
    __publicField(this, "_cacheCanvas");
    if (props == null ? void 0 : props.srcRect) {
      this._srcRect = props.srcRect;
    }
    if (props == null ? void 0 : props.prstGeom) {
      this._prstGeom = props.prstGeom;
    }
    if (props == null ? void 0 : props.applyTransform) {
      this._applyTransform = props.applyTransform;
    }
    if (props == null ? void 0 : props.dragPadding) {
      this._dragPadding = props.dragPadding;
    }
    this._applyProps();
  }
  refreshSrcRect(value, transform) {
    this._srcRect = value;
    this._applyTransform = transform;
    this._applyProps();
  }
  get srcRect() {
    return this._srcRect;
  }
  dispose() {
    var _a;
    super.dispose();
    (_a = this._cacheCanvas) == null ? void 0 : _a.dispose();
    this._srcRect = null;
  }
  isHit(coord) {
    const oCoord = this.getInverseCoord(coord);
    if (oCoord.x >= -this.strokeWidth / 2 && oCoord.x <= this.width + this.strokeWidth / 2 && oCoord.y >= -this.strokeWidth / 2 && oCoord.y <= this.height + this.strokeWidth / 2 && !this._inSurround(oCoord)) {
      return true;
    }
    return false;
  }
  _inSurround(oCoord) {
    const padding = this._dragPadding;
    if (oCoord.x >= padding - this.strokeWidth / 2 && oCoord.x <= this.width + this.strokeWidth / 2 - padding && oCoord.y >= padding - this.strokeWidth / 2 && oCoord.y <= this.height + this.strokeWidth / 2 - padding) {
      return true;
    }
    return false;
  }
  render(mainCtx, bounds) {
    if (!this.visible) {
      this.makeDirty(false);
      return this;
    }
    mainCtx.save();
    this._draw(mainCtx);
    mainCtx.restore();
    this.makeDirty(false);
    return this;
  }
  _draw(ctx) {
    var _a, _b;
    const scene = this.getScene();
    const engine = scene.getEngine();
    const { width: engineWidth, height: engineHeight } = engine;
    this._initialCacheCanvas();
    (_a = this._cacheCanvas) == null ? void 0 : _a.clear();
    const cacheCtx = (_b = this._cacheCanvas) == null ? void 0 : _b.getContext();
    if (cacheCtx == null) {
      return;
    }
    cacheCtx.save();
    Rect.drawWith(cacheCtx, {
      left: 0,
      top: 0,
      width: engineWidth,
      height: engineHeight,
      fill: "rgba(0, 0, 0, 0.5)"
    });
    cacheCtx.setTransform(ctx.getTransform());
    this._clipForApplyObject(cacheCtx);
    this._applyCache(ctx);
    cacheCtx.restore();
  }
  _clipForApplyObject(cacheCtx) {
    let objectType = 0 /* RECT */;
    if (this._prstGeom != null) {
      objectType = 1 /* PATH */;
    }
    cacheCtx.globalCompositeOperation = "destination-out";
    cacheCtx.beginPath();
    if (objectType === 0 /* RECT */) {
      const m = this.transform.getMatrix();
      cacheCtx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      cacheCtx.rect(0, 0, this.width, this.height);
      cacheCtx.fill();
    } else {
    }
  }
  _applyProps() {
    if (this._applyTransform == null) {
      return;
    }
    let cropLeft = 0;
    let cropTop = 0;
    let cropRight = 0;
    let cropBottom = 0;
    const { left: applyLeft = 0, top: applyTop = 0, width: applyWidth = 0, height: applyHeight = 0, angle } = this._applyTransform;
    if (this._srcRect != null) {
      const { left: left2 = 0, top: top2 = 0, right = 0, bottom = 0 } = this._srcRect;
      cropLeft = left2;
      cropTop = top2;
      cropRight = right;
      cropBottom = bottom;
    }
    const left = applyLeft + cropLeft;
    const top = applyTop + cropTop;
    this.transformByState({
      left,
      top,
      width: applyLeft + applyWidth - cropRight - left,
      height: applyTop + applyHeight - cropBottom - top,
      angle
    });
  }
  _applyCache(ctx) {
    if (!ctx || this._cacheCanvas == null) {
      return;
    }
    const cacheCtx = this._cacheCanvas.getContext();
    cacheCtx.save();
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    cacheCtx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(this._cacheCanvas.getCanvasEle(), 0, 0);
    ctx.restore();
    cacheCtx.restore();
  }
  _initialCacheCanvas() {
    if (this._cacheCanvas != null) {
      return;
    }
    const scene = this.getScene();
    if (scene == null) return;
    this._cacheCanvas = new Canvas();
    const engine = scene.getEngine();
    this._cacheCanvas.setSize(engine.width, engine.height);
    engine.onTransformChange$.subscribeEvent(() => {
      var _a;
      (_a = this._cacheCanvas) == null ? void 0 : _a.setSize(engine.width, engine.height);
      this.makeDirty(true);
    });
  }
};

// ../packages/drawing-ui/src/controllers/image-cropper.controller.ts
var ImageCropperController = class extends Disposable {
  constructor(_commandService, _drawingManagerService, _renderManagerService, _univerInstanceService, _messageService, _localeService) {
    super();
    __publicField(this, "_commandService", _commandService);
    __publicField(this, "_drawingManagerService", _drawingManagerService);
    __publicField(this, "_renderManagerService", _renderManagerService);
    __publicField(this, "_univerInstanceService", _univerInstanceService);
    __publicField(this, "_messageService", _messageService);
    __publicField(this, "_localeService", _localeService);
    __publicField(this, "_sceneListenerOnImageMap", /* @__PURE__ */ new WeakSet());
    this._init();
  }
  _init() {
    this._initOpenCrop();
    this._initCloseCrop();
    this._initAutoCrop();
  }
  _initAutoCrop() {
    this.disposeWithMe(
      this._commandService.onCommandExecuted((command) => {
        if (command.id !== AutoImageCropOperation.id) {
          return;
        }
        const params = command.params;
        if (params == null) {
          return;
        }
        const { cropType } = params;
        const drawingParams = this._drawingManagerService.getFocusDrawings();
        if (drawingParams.length !== 1) {
          return;
        }
        const drawingParam = drawingParams[0];
        const { unitId, subUnitId, drawingId } = drawingParam;
        const renderObject = this._renderManagerService.getRenderById(unitId);
        const scene = renderObject == null ? void 0 : renderObject.scene;
        if (scene == null) {
          return true;
        }
        const imageCropperObject = this._searchCropObject(scene);
        if (imageCropperObject != null) {
          this._commandService.syncExecuteCommand(CloseImageCropOperation.id, { isAuto: true });
        }
        const imageShapeKey = getDrawingShapeKeyByDrawingSearch({ unitId, subUnitId, drawingId });
        const imageShape = scene.getObject(imageShapeKey);
        if (!(imageShape instanceof Image)) {
          this._messageService.show({
            type: "error" /* Error */,
            content: this._localeService.t("drawing-ui.image-cropper.error")
          });
          return;
        }
        if (imageShape == null) {
          return;
        }
        this._updateCropperObject(cropType, imageShape);
        this._commandService.executeCommand(OpenImageCropOperation.id, { unitId, subUnitId, drawingId });
      })
    );
  }
  _calculateSrcRectByRatio(left, top, width, height, numerator, denominator) {
    const srcRatio = width / height;
    const ratio = numerator / denominator;
    let newWidth = width;
    let newHeight = height;
    if (srcRatio > ratio) {
      newWidth = height * ratio;
    } else {
      newHeight = width / ratio;
    }
    const newLeft = (width - newWidth) / 2;
    const newTop = (height - newHeight) / 2;
    return {
      left: precisionTo(newLeft, 1),
      top: precisionTo(newTop, 1),
      right: precisionTo(width - (newLeft + newWidth), 1),
      bottom: precisionTo(height - (newTop + newHeight), 1)
    };
  }
  _updateCropperObject(cropType, imageShape) {
    const { left, top, width, height } = imageShape.calculateTransformWithSrcRect();
    let newSrcRect;
    switch (cropType) {
      case "1" /* R1_1 */:
        newSrcRect = this._calculateSrcRectByRatio(left, top, width, height, 1, 1);
        break;
      case "2" /* R16_9 */:
        newSrcRect = this._calculateSrcRectByRatio(left, top, width, height, 16, 9);
        break;
      case "3" /* R9_16 */:
        newSrcRect = this._calculateSrcRectByRatio(left, top, width, height, 9, 16);
        break;
      case "4" /* R5_4 */:
        newSrcRect = this._calculateSrcRectByRatio(left, top, width, height, 5, 4);
        break;
      case "5" /* R4_5 */:
        newSrcRect = this._calculateSrcRectByRatio(left, top, width, height, 4, 5);
        break;
      case "6" /* R4_3 */:
        newSrcRect = this._calculateSrcRectByRatio(left, top, width, height, 4, 3);
        break;
      case "7" /* R3_4 */:
        newSrcRect = this._calculateSrcRectByRatio(left, top, width, height, 3, 4);
        break;
      case "8" /* R3_2 */:
        newSrcRect = this._calculateSrcRectByRatio(left, top, width, height, 3, 2);
        break;
      case "9" /* R2_3 */:
        newSrcRect = this._calculateSrcRectByRatio(left, top, width, height, 2, 3);
        break;
      case "0" /* FREE */:
      default:
        break;
    }
    if (newSrcRect == null) {
      return;
    }
    imageShape.setSrcRect(newSrcRect);
    const { left: newLeft = 0, top: newTop = 0, bottom: newBottom = 0, right: newRight = 0 } = newSrcRect;
    imageShape.transformByStateCloseCropper({
      left: left + newLeft,
      top: top + newTop,
      width: width - newRight - newLeft,
      height: height - newBottom - newTop
    });
  }
  _initOpenCrop() {
    this.disposeWithMe(
      this._commandService.onCommandExecuted((command) => {
        if (command.id !== OpenImageCropOperation.id) {
          return;
        }
        const params = command.params;
        if (params == null) {
          return;
        }
        const { unitId, subUnitId, drawingId } = params;
        const renderObject = this._renderManagerService.getRenderById(unitId);
        const scene = renderObject == null ? void 0 : renderObject.scene;
        if (scene == null) {
          return true;
        }
        if (!this._sceneListenerOnImageMap.has(scene)) {
          this._addListenerOnImage(scene);
          this._sceneListenerOnImageMap.add(scene);
        }
        const imageData = this._drawingManagerService.getDrawingByParam({ unitId, subUnitId, drawingId });
        if (imageData == null) {
          return;
        }
        const imageShapeKey = getDrawingShapeKeyByDrawingSearch({ unitId, subUnitId, drawingId });
        const imageShape = scene.getObject(imageShapeKey);
        if (imageShape == null) {
          return;
        }
        if (!(imageShape instanceof Image)) {
          this._messageService.show({
            type: "error" /* Error */,
            content: this._localeService.t("drawing-ui.image-cropper.error")
          });
          return;
        }
        const transformer = scene.getTransformer();
        transformer == null ? void 0 : transformer.clearControls();
        const imageCropperObject = new ImageCropperObject(`${imageShapeKey}-crop`, {
          srcRect: imageShape.srcRect,
          prstGeom: imageShape.prstGeom,
          applyTransform: imageShape.calculateTransformWithSrcRect()
        });
        scene.addObject(imageCropperObject, imageShape.getLayerIndex() + 1).attachTransformerTo(imageCropperObject);
        transformer == null ? void 0 : transformer.createControlForCopper(imageCropperObject);
        this._addHoverForImageCopper(imageCropperObject);
        imageShape.openRenderByCropper();
        transformer == null ? void 0 : transformer.refreshControls();
        imageCropperObject.makeDirty(true);
        this._commandService.syncExecuteCommand(SetDrawingSelectedOperation.id, [{ unitId, subUnitId, drawingId }]);
      })
    );
  }
  _searchCropObject(scene) {
    const objects = scene.getAllObjectsByOrder();
    for (const object of objects) {
      if (object instanceof ImageCropperObject) {
        return object;
      }
    }
  }
  _initCloseCrop() {
    this.disposeWithMe(
      this._commandService.onCommandExecuted((command) => {
        if (command.id !== CloseImageCropOperation.id) {
          return;
        }
        const currentUnit = this._univerInstanceService.getFocusedUnit();
        if (currentUnit == null) {
          return;
        }
        const unitId = currentUnit.getUnitId();
        const renderObject = this._renderManagerService.getRenderById(unitId);
        const scene = renderObject == null ? void 0 : renderObject.scene;
        if (scene == null) {
          return true;
        }
        const imageCropperObject = this._searchCropObject(scene);
        if (imageCropperObject == null) {
          return;
        }
        const imageShape = this._getApplyObjectByCropObject(imageCropperObject);
        if (imageShape == null) {
          return;
        }
        const transformer = scene.getTransformerByCreate();
        transformer.detachFrom(imageCropperObject);
        transformer.clearCopperControl();
        const srcRect = this._getSrcRectByTransformState(imageShape, imageCropperObject);
        const drawingParam = this._drawingManagerService.getDrawingOKey(imageShape.oKey);
        if (drawingParam != null) {
          const { left, top, height, width } = imageCropperObject;
          this._drawingManagerService.featurePluginUpdateNotification([{
            ...drawingParam,
            transform: {
              ...drawingParam.transform,
              left,
              top,
              height,
              width
            },
            srcRect: srcRect.srcRectAngle
          }]);
        }
        imageShape.setSrcRect({ ...srcRect.srcRectAngle });
        imageShape.closeRenderByCropper();
        imageShape.makeDirty(true);
        imageCropperObject == null ? void 0 : imageCropperObject.dispose();
      })
    );
    const sheetUnit$ = this._univerInstanceService.getCurrentTypeOfUnit$(2 /* UNIVER_SHEET */).pipe(
      switchMap((workbook) => workbook ? workbook.activeSheet$ : of(null))
    );
    this.disposeWithMe(sheetUnit$.subscribe(() => {
      this._commandService.syncExecuteCommand(CloseImageCropOperation.id);
    }));
  }
  _getApplyObjectByCropObject(cropObject) {
    const cropOKey = cropObject.oKey;
    const applyOKey = cropOKey.slice(0, cropOKey.length - 5);
    const scene = cropObject.getScene();
    if (!scene) return null;
    const applyObject = scene.getObject(applyOKey);
    if (applyObject == null) {
      return null;
    }
    return applyObject;
  }
  _addListenerOnImage(scene) {
    const transformer = scene.getTransformerByCreate();
    let startTransform = null;
    this.disposeWithMe(
      transformer.changeStart$.subscribe((state) => {
        const { objects } = state;
        const cropObject = objects.values().next().value;
        if (cropObject == null || !(cropObject instanceof ImageCropperObject)) {
          return;
        }
        const { left, top, height, width, angle } = cropObject;
        startTransform = { left, top, height, width, angle };
        transformer.clearCopperControl();
      })
    );
    this.disposeWithMe(
      transformer.changeEnd$.subscribe((state) => {
        const { objects } = state;
        const cropObject = objects.values().next().value;
        if (cropObject == null || !(cropObject instanceof ImageCropperObject)) {
          return;
        }
        const { left, top, height, width, angle } = cropObject;
        if (!checkIfMove({ left, top, height, width, angle }, startTransform)) {
          return;
        }
        const applyObject = this._getApplyObjectByCropObject(cropObject);
        if (applyObject == null) {
          return;
        }
        const srcRect = this._getSrcRectByTransformState(applyObject, cropObject);
        cropObject.refreshSrcRect(srcRect.srcRect, applyObject.getState());
        transformer.createControlForCopper(cropObject);
      })
    );
    this._endCropListener(scene);
  }
  _addHoverForImageCopper(o) {
    this.disposeWithMe(
      o.onPointerEnter$.subscribeEvent(() => {
        o.cursor = "move" /* MOVE */;
      })
    );
    this.disposeWithMe(
      o.onPointerLeave$.subscribeEvent(() => {
        o.cursor = "default" /* DEFAULT */;
      })
    );
  }
  _endCropListener(scene) {
    const transformer = scene.getTransformerByCreate();
    this.disposeWithMe(
      transformer.clearControl$.subscribe((changeSelf) => {
        if (changeSelf === true) {
          this._commandService.syncExecuteCommand(CloseImageCropOperation.id);
        }
      })
    );
  }
  _getSrcRectByTransformState(applyObject, imageCropperObject) {
    const { left, top, height, width, strokeWidth, angle: copperAngle } = imageCropperObject;
    const { left: applyLeft, top: applyTop, width: applyWidth, height: applyHeight, angle: applyAngle, strokeWidth: applyStrokeWidth } = applyObject;
    const newLeft = left - applyLeft;
    const newTop = top - applyTop;
    const srcRect = {
      left: newLeft,
      top: newTop,
      right: applyWidth - newLeft - width,
      bottom: applyHeight - newTop - height
    };
    const srcRectAngle = { ...srcRect };
    if (applyAngle !== 0) {
      const cx = left + width / 2;
      const cy = top + height / 2;
      const centerPoint = new Vector2(cx, cy);
      const newCx = applyWidth / 2 + applyLeft;
      const newCy = applyHeight / 2 + applyTop;
      const newCenterPoint = new Vector2(newCx, newCy);
      const vertexPoint = new Vector2(applyLeft, applyTop);
      vertexPoint.rotateByPoint(degToRad(applyAngle), newCenterPoint);
      const applyFinalPoint = vertexPoint.clone();
      applyFinalPoint.rotateByPoint(degToRad(-applyAngle), centerPoint);
      const newAngleLeft = left - applyFinalPoint.x;
      const newAngleTop = top - applyFinalPoint.y;
      srcRectAngle.left = newAngleLeft;
      srcRectAngle.top = newAngleTop;
      srcRectAngle.right = applyWidth - newAngleLeft - width;
      srcRectAngle.bottom = applyHeight - newAngleTop - height;
    }
    return {
      srcRect,
      srcRectAngle
    };
  }
};
ImageCropperController = __decorateClass([
  __decorateParam(0, ICommandService),
  __decorateParam(1, IDrawingManagerService),
  __decorateParam(2, IRenderManagerService),
  __decorateParam(3, IUniverInstanceService),
  __decorateParam(4, IMessageService),
  __decorateParam(5, Inject(LocaleService))
], ImageCropperController);

// ../packages/drawing-ui/src/commands/operations/image-reset-size.operation.ts
var ImageResetSizeOperation = {
  id: "sheet.operation.image-reset-size",
  type: 1 /* OPERATION */,
  handler: (accessor, params) => {
    return true;
  }
};

// ../packages/drawing-ui/src/controllers/image-update.controller.ts
var ImageUpdateController = class extends Disposable {
  constructor(_commandService, _renderManagerService, _drawingManagerService, _dialogService, _imageIoService, _currentUniverService, _drawingRenderService) {
    super();
    __publicField(this, "_commandService", _commandService);
    __publicField(this, "_renderManagerService", _renderManagerService);
    __publicField(this, "_drawingManagerService", _drawingManagerService);
    __publicField(this, "_dialogService", _dialogService);
    __publicField(this, "_imageIoService", _imageIoService);
    __publicField(this, "_currentUniverService", _currentUniverService);
    __publicField(this, "_drawingRenderService", _drawingRenderService);
    this._initialize();
  }
  dispose() {
    super.dispose();
  }
  _initialize() {
    this._drawingAddListener();
    this._commandExecutedListener();
    this._imageUpdateListener();
  }
  _commandExecutedListener() {
    this.disposeWithMe(
      this._commandService.onCommandExecuted((command) => {
        if (command.id === ImageResetSizeOperation.id) {
          const params = command.params;
          if (params == null) {
            return;
          }
          this._resetImageSize(params);
        }
      })
    );
  }
  _getSceneAndTransformerByDrawingSearch(unitId) {
    if (unitId == null) {
      return;
    }
    const renderObject = this._renderManagerService.getRenderById(unitId);
    const scene = renderObject == null ? void 0 : renderObject.scene;
    if (scene == null) {
      return null;
    }
    const transformer = scene.getTransformerByCreate();
    return { scene, transformer };
  }
  _resetImageSize(params) {
    const updateParams = [];
    const sceneList = [];
    params.forEach((param) => {
      const { unitId, subUnitId, drawingId } = param;
      const renderObject = this._getSceneAndTransformerByDrawingSearch(unitId);
      if (renderObject == null) {
        return;
      }
      const { scene } = renderObject;
      const imageShapeKey = getDrawingShapeKeyByDrawingSearch({ unitId, subUnitId, drawingId });
      const imageShape = scene.getObject(imageShapeKey);
      if (imageShape == null) {
        return true;
      }
      const imageData = this._drawingManagerService.getDrawingByParam(param);
      if (imageData == null) {
        return true;
      }
      if (imageData.drawingType !== 0 /* DRAWING_IMAGE */) {
        return;
      }
      imageShape.resetSize();
      const { width, height } = imageShape.getNativeSize();
      if (sceneList.includes(scene) === false) {
        sceneList.push(scene);
      }
      updateParams.push({
        ...imageData,
        transform: {
          ...imageData.transform,
          height,
          width,
          angle: 0
        },
        srcRect: null,
        prstGeom: null
      });
    });
    this._drawingManagerService.featurePluginUpdateNotification(updateParams);
    sceneList.forEach((scene) => {
      const transformer = scene.getTransformerByCreate();
      transformer.refreshControls().changeNotification();
    });
    this._commandService.syncExecuteCommand(SetDrawingSelectedOperation.id, params);
  }
  _drawingAddListener() {
    this.disposeWithMe(
      this._drawingManagerService.add$.pipe(
        bufferTime(33),
        filter((batches) => batches.length > 0),
        map((batches) => batches.flat()),
        map((items) => {
          const map2 = /* @__PURE__ */ new Map();
          for (const it of items) {
            map2.set(`${it.unitId}|${it.subUnitId}|${it.drawingId}`, it);
          }
          return [...map2.values()];
        }),
        filter((items) => items.length > 0)
      ).subscribe((uniqueParams) => {
        void this._insertImages(uniqueParams);
      })
    );
  }
  _insertImages(params) {
    params.forEach(async (param) => {
      var _a;
      const { unitId, subUnitId } = param;
      const renderObject = this._getSceneAndTransformerByDrawingSearch(unitId);
      const currentSubUnitId = (_a = getCurrentUnitInfo(this._currentUniverService, unitId)) == null ? void 0 : _a.subUnitId;
      if (renderObject == null || currentSubUnitId !== subUnitId) {
        return;
      }
      const imageParam = this._drawingManagerService.getDrawingByParam(param);
      if (imageParam == null) {
        return;
      }
      const images = await this._drawingRenderService.renderImages(imageParam, renderObject.scene);
      this._drawingManagerService.refreshTransform([imageParam]);
      if (images == null || images.length === 0) {
        return;
      }
      for (const image of images) {
        this._addHoverForImage(image);
        this._addDialogForImage(image);
      }
    });
  }
  _imageUpdateListener() {
    this.disposeWithMe(
      this._drawingManagerService.update$.subscribe((params) => {
        params.forEach((param) => {
          var _a;
          const { unitId, subUnitId, drawingId } = param;
          const drawingParam = this._drawingManagerService.getDrawingByParam(param);
          if (drawingParam == null) {
            return;
          }
          const { transform, drawingType, srcRect, prstGeom, source, imageSourceType } = drawingParam;
          if (drawingType !== 0 /* DRAWING_IMAGE */) {
            return;
          }
          const renderObject = this._getSceneAndTransformerByDrawingSearch(unitId);
          if (renderObject == null) {
            return;
          }
          const { scene, transformer } = renderObject;
          if (transform == null) {
            return true;
          }
          const drawingShapeKey = getDrawingShapeKeyByDrawingSearch({ unitId, subUnitId, drawingId });
          const imageShape = scene.getObject(drawingShapeKey);
          if (imageShape == null) {
            return true;
          }
          imageShape.transformByState(transform);
          (_a = imageShape.setClipBounds) == null ? void 0 : _a.call(imageShape, transform.clipBounds);
          ensureDrawingRenderLayer(scene, imageShape, drawingParam);
          imageShape.setSrcRect(srcRect);
          imageShape.setPrstGeom(prstGeom);
          if (source != null && source.length > 0 && (imageSourceType === "BASE64" /* BASE64 */ || imageSourceType === "URL" /* URL */)) {
            imageShape.changeSource(source);
          }
        });
      })
    );
  }
  _addHoverForImage(o) {
    this.disposeWithMe(
      toDisposable(
        o.onPointerEnter$.subscribeEvent(() => {
          o.cursor = "grab" /* GRAB */;
        })
      )
    );
    this.disposeWithMe(
      toDisposable(
        o.onPointerLeave$.subscribeEvent(() => {
          o.cursor = "default" /* DEFAULT */;
        })
      )
    );
  }
  _addDialogForImage(o) {
    this.disposeWithMe(
      toDisposable(
        o.onDblclick$.subscribeEvent(() => {
          const dialogId = `${o.oKey}-viewer-dialog`;
          this._drawingRenderService.previewImage(dialogId, o.getNative().src, o.getNativeSize().width, o.getNativeSize().height);
        })
      )
    );
  }
};
ImageUpdateController = __decorateClass([
  __decorateParam(0, ICommandService),
  __decorateParam(1, IRenderManagerService),
  __decorateParam(2, IDrawingManagerService),
  __decorateParam(3, IDialogService),
  __decorateParam(4, IImageIoService),
  __decorateParam(5, IUniverInstanceService),
  __decorateParam(6, Inject(DrawingRenderService))
], ImageUpdateController);

// ../packages/drawing-ui/src/commands/operations/drawing-arrange.operation.ts
var SetDrawingArrangeOperation = {
  id: "drawing.operation.set-drawing-arrange",
  type: 1 /* OPERATION */,
  handler: (accessor, params) => {
    const drawingManagerService = accessor.get(IDrawingManagerService);
    const { arrangeType } = params;
    const drawings = params.drawings || drawingManagerService.getFocusDrawings();
    const { unitId, subUnitId } = drawings[0];
    const drawingIds = drawings.map((drawing) => drawing.drawingId);
    drawingManagerService.featurePluginOrderUpdateNotification({ unitId, subUnitId, drawingIds, arrangeType });
    return true;
  }
};
var SetDrawingArrangeFrontOperation = {
  id: "drawing.operation.set-drawing-arrange-front",
  type: 1 /* OPERATION */,
  handler: (accessor) => {
    return accessor.get(ICommandService).syncExecuteCommand(SetDrawingArrangeOperation.id, { arrangeType: 2 /* front */ });
  }
};
var SetDrawingArrangeForwardOperation = {
  id: "drawing.operation.set-drawing-arrange-forward",
  type: 1 /* OPERATION */,
  handler: (accessor) => {
    return accessor.get(ICommandService).syncExecuteCommand(SetDrawingArrangeOperation.id, { arrangeType: 0 /* forward */ });
  }
};
var SetDrawingArrangeBackOperation = {
  id: "drawing.operation.set-drawing-arrange-back",
  type: 1 /* OPERATION */,
  handler: (accessor) => {
    return accessor.get(ICommandService).syncExecuteCommand(SetDrawingArrangeOperation.id, { arrangeType: 3 /* back */ });
  }
};
var SetDrawingArrangeBackwardOperation = {
  id: "drawing.operation.set-drawing-arrange-backward",
  type: 1 /* OPERATION */,
  handler: (accessor) => {
    return accessor.get(ICommandService).syncExecuteCommand(SetDrawingArrangeOperation.id, { arrangeType: 1 /* backward */ });
  }
};

// ../packages/drawing-ui/src/commands/operations/drawing-group.operation.ts
var DRAWING_GROUP_TYPES = [0 /* DRAWING_IMAGE */, 1 /* DRAWING_SHAPE */, 6 /* DRAWING_GROUP */];
var SetDrawingGroupOperation = {
  id: "drawing.operation.set-drawing-group",
  type: 1 /* OPERATION */,
  handler: (accessor, params) => {
    const drawingManagerService = accessor.get(IDrawingManagerService);
    const drawings = params.drawings || drawingManagerService.getFocusDrawings();
    if (drawings.length < 2) return false;
    if (!drawings.every((drawing) => DRAWING_GROUP_TYPES.includes(drawing.drawingType))) return false;
    const { unitId, subUnitId } = drawings[0];
    const groupId = generateRandomId(10);
    const groupTransform = getGroupState(0, 0, drawings.map((o) => o.transform || {}));
    const groupParam = {
      unitId,
      subUnitId,
      drawingId: groupId,
      drawingType: 6 /* DRAWING_GROUP */,
      transform: groupTransform,
      groupBaseBound: {
        left: groupTransform.left,
        top: groupTransform.top,
        width: groupTransform.width,
        height: groupTransform.height
      }
    };
    const children = drawings.map((drawing) => {
      const transform = drawing.transform || { left: 0, top: 0 };
      const { unitId: unitId2, subUnitId: subUnitId2, drawingId } = drawing;
      return {
        unitId: unitId2,
        subUnitId: subUnitId2,
        drawingId,
        transform: {
          ...transform
          // left: transform.left! - groupTransform.left,
          // top: transform.top! - groupTransform.top,
        },
        groupId
      };
    });
    drawingManagerService.featurePluginGroupUpdateNotification([{
      parent: groupParam,
      children
    }]);
    return true;
  }
};
var CancelDrawingGroupOperation = {
  id: "drawing.operation.cancel-drawing-group",
  type: 1 /* OPERATION */,
  handler: (accessor, params) => {
    const drawingManagerService = accessor.get(IDrawingManagerService);
    const drawings = params.drawings || drawingManagerService.getFocusDrawings();
    const groupParams = drawings.map((drawing) => {
      if (drawing.drawingType !== 6 /* DRAWING_GROUP */) return null;
      const { unitId, subUnitId, drawingId, transform: groupTransform = { width: 0, height: 0 }, groupBaseBound } = drawing;
      if (groupTransform === null) return null;
      const objects = drawingManagerService.getDrawingsByGroup({ unitId, subUnitId, drawingId });
      if (objects.length === 0) return null;
      const children = objects.map((object) => {
        const { transform } = object;
        const { unitId: unitId2, subUnitId: subUnitId2, drawingId: drawingId2 } = object;
        const newTransform = transformObjectOutOfGroup(transform || {}, groupTransform, groupTransform.width || 0, groupTransform.height || 0, groupBaseBound);
        return {
          unitId: unitId2,
          subUnitId: subUnitId2,
          drawingId: drawingId2,
          transform: {
            ...transform,
            ...newTransform
          },
          groupId: void 0
        };
      });
      return {
        parent: drawing,
        children
      };
    }).filter((o) => o !== null);
    if (groupParams.length === 0) return false;
    drawingManagerService.featurePluginUngroupUpdateNotification(groupParams);
    return true;
  }
};

// ../packages/drawing-ui/src/menu/align.menu.ts
var getMenuStateByDrawingFocusChangedObservable$ = (accessor) => {
  const drawingManagerService = accessor.get(IDrawingManagerService);
  return new Observable((subscriber) => {
    const update = (drawings) => {
      if (!drawings || drawings.length === 0) {
        return subscriber.next(true);
      }
      if (drawings.length < 2) {
        return subscriber.next(true);
      }
      subscriber.next(false);
    };
    const subscription = drawingManagerService.focus$.subscribe((drawings) => {
      if (!drawings || drawings.length === 0) {
        return subscriber.next(true);
      }
      update(drawings);
    });
    update(drawingManagerService.getFocusDrawings());
    return () => subscription.unsubscribe();
  });
};
var DRAWING_ALIGN_CONTEXT_MENU_ID = "contextMenu.drawing-align";
function DrawingAlignContextMenuItemFactory(accessor) {
  return {
    id: DRAWING_ALIGN_CONTEXT_MENU_ID,
    type: 3 /* SUBITEMS */,
    icon: "HorizontallyIcon",
    title: "drawing-ui.image-panel.align.title",
    hidden$: getMenuStateByDrawingFocusChangedObservable$(accessor)
  };
}
function SetDrawingAlignLeftMenuItemFactory() {
  return {
    id: SetDrawingAlignLeftOperation.id,
    type: 0 /* BUTTON */,
    icon: "LeftJustifyingIcon",
    title: "drawing-ui.image-panel.align.left"
  };
}
function SetDrawingAlignCenterMenuItemFactory() {
  return {
    id: SetDrawingAlignCenterOperation.id,
    type: 0 /* BUTTON */,
    icon: "HorizontallyIcon",
    title: "drawing-ui.image-panel.align.center"
  };
}
function SetDrawingAlignRightMenuItemFactory() {
  return {
    id: SetDrawingAlignRightOperation.id,
    type: 0 /* BUTTON */,
    icon: "RightJustifyingIcon",
    title: "drawing-ui.image-panel.align.right"
  };
}
function SetDrawingAlignTopMenuItemFactory() {
  return {
    id: SetDrawingAlignTopOperation.id,
    type: 0 /* BUTTON */,
    icon: "AlignTopIcon",
    title: "drawing-ui.image-panel.align.top"
  };
}
function SetDrawingAlignMiddleMenuItemFactory() {
  return {
    id: SetDrawingAlignMiddleOperation.id,
    type: 0 /* BUTTON */,
    icon: "VerticalCenterIcon",
    title: "drawing-ui.image-panel.align.middle"
  };
}
function SetDrawingAlignBottomMenuItemFactory() {
  return {
    id: SetDrawingAlignBottomOperation.id,
    type: 0 /* BUTTON */,
    icon: "AlignBottomIcon",
    title: "drawing-ui.image-panel.align.bottom"
  };
}
function SetDrawingAlignHorizonMenuItemFactory() {
  return {
    id: SetDrawingAlignHorizonOperation.id,
    type: 0 /* BUTTON */,
    icon: "HorizontallyIcon",
    title: "drawing-ui.image-panel.align.horizon"
  };
}
function SetDrawingAlignVerticalMenuItemFactory() {
  return {
    id: SetDrawingAlignVerticalOperation.id,
    type: 0 /* BUTTON */,
    icon: "VerticalCenterIcon",
    title: "drawing-ui.image-panel.align.vertical"
  };
}

// ../packages/drawing-ui/src/menu/arrange.menu.ts
var DRAWING_ARRANGE_CONTEXT_MENU_ID = "contextMenu.drawing-arrange";
function DrawingArrangeContextMenuItemFactory() {
  return {
    id: DRAWING_ARRANGE_CONTEXT_MENU_ID,
    type: 3 /* SUBITEMS */,
    icon: "TopmostIcon",
    title: "drawing-ui.image-panel.arrange.title"
  };
}
function SetDrawingArrangeFrontMenuItemFactory() {
  return {
    id: SetDrawingArrangeFrontOperation.id,
    type: 0 /* BUTTON */,
    icon: "TopmostIcon",
    title: "drawing-ui.image-panel.arrange.front"
  };
}
function SetDrawingArrangeForwardMenuItemFactory() {
  return {
    id: SetDrawingArrangeForwardOperation.id,
    type: 0 /* BUTTON */,
    icon: "MoveUpIcon",
    title: "drawing-ui.image-panel.arrange.forward"
  };
}
function SetDrawingArrangeBackMenuItemFactory() {
  return {
    id: SetDrawingArrangeBackOperation.id,
    type: 0 /* BUTTON */,
    icon: "BottomIcon",
    title: "drawing-ui.image-panel.arrange.back"
  };
}
function SetDrawingArrangeBackwardMenuItemFactory() {
  return {
    id: SetDrawingArrangeBackwardOperation.id,
    type: 0 /* BUTTON */,
    icon: "MoveDownIcon",
    title: "drawing-ui.image-panel.arrange.backward"
  };
}

// ../packages/drawing-ui/src/menu/group.menu.ts
var getMenuStateByDrawingFocusChangedObservable$2 = (accessor, type) => {
  const drawingManagerService = accessor.get(IDrawingManagerService);
  return new Observable((subscriber) => {
    const update = (drawings) => {
      if (!drawings || drawings.length === 0) {
        return subscriber.next(true);
      }
      if (type === "group") {
        if (drawings.length < 2) {
          return subscriber.next(true);
        }
        if (!drawings.every((drawing) => DRAWING_GROUP_TYPES.includes(drawing.drawingType))) {
          return subscriber.next(true);
        }
      } else if (type === "unGroup") {
        const groups = drawings.filter((drawing) => drawing.drawingType === 6 /* DRAWING_GROUP */);
        if (groups.length === 0) {
          return subscriber.next(true);
        }
      } else {
        if (!drawings.every((drawing) => DRAWING_GROUP_TYPES.includes(drawing.drawingType))) {
          return subscriber.next(true);
        }
      }
      subscriber.next(false);
    };
    const subscription = drawingManagerService.focus$.subscribe((drawings) => {
      if (!drawings || drawings.length === 0) {
        return subscriber.next(true);
      }
      update(drawings);
    });
    update(drawingManagerService.getFocusDrawings());
    return () => subscription.unsubscribe();
  });
};
var DRAWING_GROUP_CONTEXT_MENU_ID = "contextMenu.drawing-group";
function DrawingGroupContextMenuItemFactory(accessor) {
  return {
    id: DRAWING_GROUP_CONTEXT_MENU_ID,
    type: 3 /* SUBITEMS */,
    icon: "GroupIcon",
    title: "drawing-ui.image-panel.group.title",
    hidden$: getMenuStateByDrawingFocusChangedObservable$2(accessor)
  };
}
function SetDrawingGroupMenuItemFactory(accessor) {
  return {
    id: SetDrawingGroupOperation.id,
    type: 0 /* BUTTON */,
    icon: "GroupIcon",
    title: "drawing-ui.image-panel.group.group",
    disabled$: getMenuStateByDrawingFocusChangedObservable$2(accessor, "group")
  };
}
function CancelDrawingGroupMenuItemFactory(accessor) {
  return {
    id: CancelDrawingGroupOperation.id,
    type: 0 /* BUTTON */,
    icon: "UngroupIcon",
    title: "drawing-ui.image-panel.group.unGroup",
    disabled$: getMenuStateByDrawingFocusChangedObservable$2(accessor, "unGroup")
  };
}

// ../packages/drawing-ui/src/menu/schema.ts
var menuSchema = {
  ["contextMenu.drawing" /* DRAWING */]: {
    ["contextMenu.others" /* OTHERS */]: {
      [DRAWING_GROUP_CONTEXT_MENU_ID]: {
        order: 1,
        menuItemFactory: DrawingGroupContextMenuItemFactory,
        [SetDrawingGroupOperation.id]: {
          order: 0,
          menuItemFactory: SetDrawingGroupMenuItemFactory
        },
        [CancelDrawingGroupOperation.id]: {
          order: 1,
          menuItemFactory: CancelDrawingGroupMenuItemFactory
        }
      },
      [DRAWING_ARRANGE_CONTEXT_MENU_ID]: {
        order: 2,
        menuItemFactory: DrawingArrangeContextMenuItemFactory,
        [SetDrawingArrangeFrontOperation.id]: {
          order: 0,
          menuItemFactory: SetDrawingArrangeFrontMenuItemFactory
        },
        [SetDrawingArrangeForwardOperation.id]: {
          order: 1,
          menuItemFactory: SetDrawingArrangeForwardMenuItemFactory
        },
        [SetDrawingArrangeBackOperation.id]: {
          order: 2,
          menuItemFactory: SetDrawingArrangeBackMenuItemFactory
        },
        [SetDrawingArrangeBackwardOperation.id]: {
          order: 3,
          menuItemFactory: SetDrawingArrangeBackwardMenuItemFactory
        }
      },
      [DRAWING_ALIGN_CONTEXT_MENU_ID]: {
        order: 3,
        menuItemFactory: DrawingAlignContextMenuItemFactory,
        [SetDrawingAlignLeftOperation.id]: {
          order: 0,
          menuItemFactory: SetDrawingAlignLeftMenuItemFactory
        },
        [SetDrawingAlignCenterOperation.id]: {
          order: 1,
          menuItemFactory: SetDrawingAlignCenterMenuItemFactory
        },
        [SetDrawingAlignRightOperation.id]: {
          order: 2,
          menuItemFactory: SetDrawingAlignRightMenuItemFactory
        },
        [SetDrawingAlignTopOperation.id]: {
          order: 3,
          menuItemFactory: SetDrawingAlignTopMenuItemFactory
        },
        [SetDrawingAlignMiddleOperation.id]: {
          order: 4,
          menuItemFactory: SetDrawingAlignMiddleMenuItemFactory
        },
        [SetDrawingAlignBottomOperation.id]: {
          order: 5,
          menuItemFactory: SetDrawingAlignBottomMenuItemFactory
        },
        [SetDrawingAlignHorizonOperation.id]: {
          order: 6,
          menuItemFactory: SetDrawingAlignHorizonMenuItemFactory
        },
        [SetDrawingAlignVerticalOperation.id]: {
          order: 7,
          menuItemFactory: SetDrawingAlignVerticalMenuItemFactory
        }
      }
    }
  }
};

// ../packages/drawing-ui/src/controllers/ui.controller.ts
var DrawingUIController = class extends Disposable {
  constructor(_commandService, _menuManagerService) {
    super();
    __publicField(this, "_commandService", _commandService);
    __publicField(this, "_menuManagerService", _menuManagerService);
    this._init();
  }
  _init() {
    this._initMenus();
    this._initCommands();
  }
  _initMenus() {
    this._menuManagerService.mergeMenu(menuSchema);
  }
  _initCommands() {
    [
      OpenImageCropOperation,
      CloseImageCropOperation,
      ImageResetSizeOperation,
      SetDrawingAlignOperation,
      SetDrawingAlignLeftOperation,
      SetDrawingAlignCenterOperation,
      SetDrawingAlignRightOperation,
      SetDrawingAlignTopOperation,
      SetDrawingAlignMiddleOperation,
      SetDrawingAlignBottomOperation,
      SetDrawingAlignHorizonOperation,
      SetDrawingAlignVerticalOperation,
      AutoImageCropOperation,
      SetDrawingGroupOperation,
      CancelDrawingGroupOperation,
      SetDrawingArrangeOperation,
      SetDrawingArrangeFrontOperation,
      SetDrawingArrangeForwardOperation,
      SetDrawingArrangeBackOperation,
      SetDrawingArrangeBackwardOperation
    ].forEach((command) => this.disposeWithMe(this._commandService.registerCommand(command)));
  }
};
DrawingUIController = __decorateClass([
  __decorateParam(0, ICommandService),
  __decorateParam(1, IMenuManagerService)
], DrawingUIController);

// ../packages/drawing-ui/src/plugin.ts
var UniverDrawingUIPlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig2, _injector, _configService) {
    super();
    __publicField(this, "_config", _config);
    __publicField(this, "_injector", _injector);
    __publicField(this, "_configService", _configService);
    const { menu, ...rest } = merge_default(
      {},
      defaultPluginConfig2,
      this._config
    );
    if (menu) {
      this._configService.setConfig("menu", menu, { merge: true });
    }
    this._configService.setConfig(DRAWING_UI_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    this._injector.add([ComponentsController]);
    this._injector.get(ComponentsController);
    this._initDependencies();
  }
  onRendered() {
    this._injector.get(DrawingUpdateController);
    this._injector.get(DrawingUIController);
    this._injector.get(ImageCropperController);
    this._injector.get(ImageUpdateController);
  }
  _initDependencies() {
    const dependencies = [
      [DrawingImageClipService],
      [DrawingRenderService],
      [DrawingUpdateController],
      [DrawingUIController],
      [ImageCropperController],
      [ImageUpdateController]
    ];
    dependencies.forEach((dependency) => this._injector.add(dependency));
  }
};
__publicField(UniverDrawingUIPlugin, "pluginName", "UNIVER_DRAWING_UI_PLUGIN");
__publicField(UniverDrawingUIPlugin, "packageName", package_default2.name);
__publicField(UniverDrawingUIPlugin, "version", package_default2.version);
UniverDrawingUIPlugin = __decorateClass([
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, IConfigService)
], UniverDrawingUIPlugin);

// ../packages/drawing-ui/src/views/panel/DrawingCommonPanel.tsx
var import_react7 = __toESM(require_react());

// ../packages/drawing-ui/src/views/panel/DrawingAlign.tsx
var import_react2 = __toESM(require_react());
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var DrawingAlign = (props) => {
  const commandService = useDependency(ICommandService);
  const localeService = useDependency(LocaleService);
  const { drawings, alignShow } = props;
  const [alignValue, setAlignValue] = (0, import_react2.useState)("0" /* default */);
  const alignOptions = [
    {
      label: localeService.t("drawing-ui.image-panel.align.default"),
      value: "0" /* default */
    },
    {
      options: [
        {
          label: localeService.t("drawing-ui.image-panel.align.left"),
          value: "1" /* left */
        },
        {
          label: localeService.t("drawing-ui.image-panel.align.center"),
          value: "2" /* center */
        },
        {
          label: localeService.t("drawing-ui.image-panel.align.right"),
          value: "3" /* right */
        }
      ]
    },
    {
      options: [
        {
          label: localeService.t("drawing-ui.image-panel.align.top"),
          value: "4" /* top */
        },
        {
          label: localeService.t("drawing-ui.image-panel.align.middle"),
          value: "5" /* middle */
        },
        {
          label: localeService.t("drawing-ui.image-panel.align.bottom"),
          value: "6" /* bottom */
        }
      ]
    },
    {
      options: [
        {
          label: localeService.t("drawing-ui.image-panel.align.horizon"),
          value: "7" /* horizon */
        },
        {
          label: localeService.t("drawing-ui.image-panel.align.vertical"),
          value: "8" /* vertical */
        }
      ]
    }
  ];
  function handleAlignChange(value) {
    setAlignValue(value);
    commandService.executeCommand(SetDrawingAlignOperation.id, {
      alignType: value,
      drawings
    });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "div",
    {
      className: clsx("univer-relative univer-w-full", {
        "univer-hidden": !alignShow
      }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "header",
          {
            className: `univer-text-gray-600 dark:!univer-text-gray-200`,
            children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children: localeService.t("drawing-ui.image-panel.align.title") })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "div",
          {
            className: `univer-w-full univer-text-gray-900 dark:!univer-text-white`,
            children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Select, { value: alignValue, options: alignOptions, onChange: handleAlignChange })
          }
        ) })
      ]
    }
  );
};

// ../packages/drawing-ui/src/views/panel/DrawingArrange.tsx
var import_react3 = __toESM(require_react());
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
var DrawingArrange = (props) => {
  const { arrangeShow, drawings: focusDrawings } = props;
  const localeService = useDependency(LocaleService);
  const drawingManagerService = useDependency(IDrawingManagerService);
  const commandService = useDependency(ICommandService);
  const iconManager = useDependency(IconManager);
  const MoveUpIcon2 = iconManager.get("MoveUpIcon");
  const MoveDownIcon2 = iconManager.get("MoveDownIcon");
  const TopmostIcon2 = iconManager.get("TopmostIcon");
  const BottomIcon2 = iconManager.get("BottomIcon");
  const [drawings, setDrawings] = (0, import_react3.useState)(focusDrawings);
  (0, import_react3.useEffect)(() => {
    const focusDispose = drawingManagerService.focus$.subscribe((drawings2) => {
      setDrawings(drawings2);
    });
    return () => {
      focusDispose.unsubscribe();
    };
  }, []);
  const onArrangeBtnClick = (arrangeType) => {
    commandService.syncExecuteCommand(SetDrawingArrangeOperation.id, { arrangeType, drawings });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      className: clsx("univer-grid univer-gap-2 univer-py-2 univer-text-gray-400", {
        "univer-hidden": !arrangeShow
      }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "header",
          {
            className: `univer-text-gray-600 dark:!univer-text-gray-200`,
            children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { children: localeService.t("drawing-ui.image-panel.arrange.title") })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "univer-grid univer-grid-cols-2 univer-gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Button, { onClick: () => {
            onArrangeBtnClick(0 /* forward */);
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(MoveUpIcon2, {}),
            localeService.t("drawing-ui.image-panel.arrange.forward")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Button, { onClick: () => {
            onArrangeBtnClick(1 /* backward */);
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(MoveDownIcon2, {}),
            localeService.t("drawing-ui.image-panel.arrange.backward")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Button, { onClick: () => {
            onArrangeBtnClick(2 /* front */);
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(TopmostIcon2, {}),
            localeService.t("drawing-ui.image-panel.arrange.front")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Button, { onClick: () => {
            onArrangeBtnClick(3 /* back */);
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(BottomIcon2, {}),
            localeService.t("drawing-ui.image-panel.arrange.back")
          ] })
        ] })
      ]
    }
  );
};

// ../packages/drawing-ui/src/views/panel/DrawingGroup.tsx
var import_react4 = __toESM(require_react());
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
var DrawingGroup = (props) => {
  const localeService = useDependency(LocaleService);
  const renderManagerService = useDependency(IRenderManagerService);
  const drawingManagerService = useDependency(IDrawingManagerService);
  const commandService = useDependency(ICommandService);
  const iconManager = useDependency(IconManager);
  const { hasGroup, drawings } = props;
  const GroupIcon2 = iconManager.get("GroupIcon");
  const UngroupIcon2 = iconManager.get("UngroupIcon");
  const [groupShow, setGroupShow] = (0, import_react4.useState)(false);
  const [groupBtnShow, setGroupBtnShow] = (0, import_react4.useState)(true);
  const [ungroupBtnShow, setUngroupBtnShow] = (0, import_react4.useState)(true);
  const onGroupBtnClick = () => {
    commandService.syncExecuteCommand(SetDrawingGroupOperation.id, { drawings });
  };
  const onUngroupBtnClick = () => {
    commandService.syncExecuteCommand(CancelDrawingGroupOperation.id, { drawings });
  };
  (0, import_react4.useEffect)(() => {
    const drawingParam = drawings[0];
    if (drawingParam == null) {
      return;
    }
    const { unitId } = drawingParam;
    const renderObject = renderManagerService.getRenderById(unitId);
    const scene = renderObject == null ? void 0 : renderObject.scene;
    if (scene == null) {
      return;
    }
    const transformer = scene.getTransformerByCreate();
    const onClearControlObserver = transformer.clearControl$.subscribe((changeSelf) => {
      if (changeSelf === true) {
        setGroupShow(false);
      }
    });
    const onChangeStartObserver = transformer.changeStart$.subscribe((state) => {
      const { objects } = state;
      const params = getUpdateParams(objects, drawingManagerService);
      const groupParams = params.filter((o) => (o == null ? void 0 : o.drawingType) === 6 /* DRAWING_GROUP */);
      let groupBtnShow2 = false;
      let ungroupBtnShow2 = false;
      if (params.length > 1) {
        groupBtnShow2 = true;
      }
      if (groupParams.length > 0) {
        ungroupBtnShow2 = true;
      }
      const groupShow2 = groupBtnShow2 || ungroupBtnShow2;
      setGroupShow(groupShow2);
      setGroupBtnShow(groupBtnShow2);
      setUngroupBtnShow(ungroupBtnShow2);
    });
    return () => {
      onChangeStartObserver.unsubscribe();
      onClearControlObserver.unsubscribe();
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "div",
    {
      className: clsx("univer-grid univer-gap-2 univer-py-2 univer-text-gray-400", {
        "univer-hidden": hasGroup === true && groupShow === false || hasGroup === false
      }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "header",
          {
            className: `univer-text-gray-600 dark:!univer-text-gray-200`,
            children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { children: localeService.t("drawing-ui.image-panel.group.title") })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "univer-flex univer-items-center univer-justify-center univer-gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
            Button,
            {
              className: clsx({
                "univer-hidden": !groupBtnShow
              }),
              onClick: onGroupBtnClick,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(GroupIcon2, {}),
                localeService.t("drawing-ui.image-panel.group.group")
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
            Button,
            {
              className: clsx({
                "univer-hidden": !ungroupBtnShow
              }),
              onClick: onUngroupBtnClick,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(UngroupIcon2, {}),
                localeService.t("drawing-ui.image-panel.group.unGroup")
              ]
            }
          )
        ] })
      ]
    }
  );
};

// ../packages/drawing-ui/src/views/panel/DrawingTransform.tsx
var import_react5 = __toESM(require_react());

// ../packages/drawing-ui/src/utils/config.ts
var MIN_DRAWING_WIDTH_LIMIT = 20;
var MIN_DRAWING_HEIGHT_LIMIT = 20;
var RANGE_DRAWING_ROTATION_LIMIT = [-360, 360];

// ../packages/drawing-ui/src/views/panel/DrawingTransform.tsx
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
var INPUT_DEBOUNCE_TIME = 300;
var DrawingTransform = (props) => {
  var _a;
  const localeService = useDependency(LocaleService);
  const drawingManagerService = useDependency(IDrawingManagerService);
  const renderManagerService = useDependency(IRenderManagerService);
  const { drawings, transformShow } = props;
  const drawingParam = drawings[0];
  if (drawingParam == null) {
    return;
  }
  const transform = drawingParam.transform;
  if (transform == null) {
    return;
  }
  const { unitId, subUnitId, drawingId, drawingType } = drawingParam;
  const renderObject = renderManagerService.getRenderById(unitId);
  const scene = renderObject == null ? void 0 : renderObject.scene;
  if (scene == null) {
    return;
  }
  const topScene = (_a = scene.getEngine()) == null ? void 0 : _a.activeScene;
  if (topScene == null) {
    return;
  }
  const transformer = scene.getTransformerByCreate();
  const {
    width: originWidth = 0,
    height: originHeight = 0,
    left: originX = 0,
    top: originY = 0,
    angle: originRotation = 0
  } = transform;
  const [width, setWidth] = (0, import_react5.useState)(originWidth);
  const [height, setHeight] = (0, import_react5.useState)(originHeight);
  const [xPosition, setXPosition] = (0, import_react5.useState)(originX);
  const [yPosition, setYPosition] = (0, import_react5.useState)(originY);
  const [rotation, setRotation] = (0, import_react5.useState)(originRotation);
  const [lockRatio, setLockRatio] = (0, import_react5.useState)(transformer.keepRatio);
  const checkMoveBoundary = (left, top, width2, height2) => {
    const { width: topSceneWidth, height: topSceneHeight } = topScene;
    const { ancestorLeft, ancestorTop } = scene;
    let limitLeft = left;
    let limitTop = top;
    let limitWidth = width2;
    let limitHeight = height2;
    if (left + ancestorLeft < 0) {
      limitLeft = -ancestorLeft;
    }
    if (top + ancestorTop < 0) {
      limitTop = -ancestorTop;
    }
    limitWidth = topSceneWidth - limitLeft - ancestorLeft;
    if (limitWidth < MIN_DRAWING_WIDTH_LIMIT) {
      limitWidth = MIN_DRAWING_WIDTH_LIMIT;
    }
    limitHeight = topSceneHeight - limitTop - ancestorTop;
    if (limitHeight < MIN_DRAWING_HEIGHT_LIMIT) {
      limitHeight = MIN_DRAWING_HEIGHT_LIMIT;
    }
    if (left + limitWidth + ancestorLeft > topSceneWidth) {
      limitLeft = topSceneWidth - width2 - ancestorLeft;
    }
    if (top + limitHeight + ancestorTop > topSceneHeight) {
      limitTop = topSceneHeight - height2 - ancestorTop;
    }
    return {
      limitLeft,
      limitTop,
      limitWidth,
      limitHeight
    };
  };
  const changeObs = (state) => {
    const { objects } = state;
    const params = getUpdateParams(objects, drawingManagerService);
    if (params.length !== 1) {
      return;
    }
    const drawingParam2 = params[0];
    if (drawingParam2 == null) {
      return;
    }
    const { transform: transform2 } = drawingParam2;
    if (transform2 == null) {
      return;
    }
    const {
      width: originWidth2,
      height: originHeight2,
      left: originX2,
      top: originY2,
      angle: originRotation2
    } = transform2;
    if (originWidth2 != null) {
      setWidth(originWidth2);
    }
    if (originHeight2 != null) {
      setHeight(originHeight2);
    }
    if (originX2 != null) {
      setXPosition(originX2);
    }
    if (originY2 != null) {
      setYPosition(originY2);
    }
    if (originRotation2 != null) {
      setRotation(originRotation2);
    }
  };
  (0, import_react5.useEffect)(() => {
    const subscriptions = [
      transformer.changeStart$.subscribe((state) => {
        changeObs(state);
      }),
      transformer.changing$.subscribe((state) => {
        changeObs(state);
      }),
      transformer.changeEnd$.subscribe((state) => {
        changeObs(state);
      }),
      drawingManagerService.focus$.subscribe((drawings2) => {
        if (drawings2.length !== 1) {
          return;
        }
        const drawingParam2 = drawingManagerService.getDrawingByParam(drawings2[0]);
        if (drawingParam2 == null) {
          return;
        }
        const transform2 = drawingParam2.transform;
        if (transform2 == null) {
          return;
        }
        const {
          width: originWidth2,
          height: originHeight2,
          left: originX2,
          top: originY2,
          angle: originRotation2
        } = transform2;
        if (originWidth2 != null) {
          setWidth(originWidth2);
        }
        if (originHeight2 != null) {
          setHeight(originHeight2);
        }
        if (originX2 != null) {
          setXPosition(originX2);
        }
        if (originY2 != null) {
          setYPosition(originY2);
        }
        if (originRotation2 != null) {
          setRotation(originRotation2);
        }
      })
    ];
    return () => {
      subscriptions.forEach((sub) => sub.unsubscribe());
    };
  }, []);
  const handleWidthChange = debounce_default((val) => {
    if (val == null) {
      return;
    }
    const { limitWidth, limitHeight } = checkMoveBoundary(xPosition, yPosition, val, height);
    val = Math.min(val, limitWidth);
    const updateParam = { unitId, subUnitId, drawingId, drawingType, transform: { width: val } };
    if (lockRatio) {
      let heightFix = val / width * height;
      heightFix = Math.max(heightFix, MIN_DRAWING_HEIGHT_LIMIT);
      if (heightFix > limitHeight) {
        return;
      }
      setHeight(heightFix);
      updateParam.transform.height = heightFix;
    }
    setWidth(val);
    drawingManagerService.featurePluginUpdateNotification([updateParam]);
    transformer.refreshControls().changeNotification();
  }, INPUT_DEBOUNCE_TIME);
  const handleHeightChange = debounce_default((val) => {
    if (val == null) {
      return;
    }
    const { limitHeight, limitWidth } = checkMoveBoundary(xPosition, yPosition, width, val);
    val = Math.min(val, limitHeight);
    const updateParam = { unitId, subUnitId, drawingId, drawingType, transform: { height: val } };
    if (lockRatio) {
      let widthFix = val / height * width;
      widthFix = Math.max(widthFix, MIN_DRAWING_WIDTH_LIMIT);
      if (widthFix > limitWidth) {
        return;
      }
      setWidth(widthFix);
      updateParam.transform.width = widthFix;
    }
    setHeight(val);
    drawingManagerService.featurePluginUpdateNotification([updateParam]);
    transformer.refreshControls().changeNotification();
  }, INPUT_DEBOUNCE_TIME);
  const handleXChange = debounce_default((val) => {
    if (val == null) {
      return;
    }
    const { limitLeft } = checkMoveBoundary(val, yPosition, width, height);
    val = limitLeft;
    const updateParam = { unitId, subUnitId, drawingId, drawingType, transform: { left: val } };
    setXPosition(val);
    drawingManagerService.featurePluginUpdateNotification([updateParam]);
    transformer.refreshControls().changeNotification();
  }, INPUT_DEBOUNCE_TIME);
  const handleYChange = debounce_default((val) => {
    if (val == null) {
      return;
    }
    const { limitTop } = checkMoveBoundary(xPosition, val, width, height);
    val = limitTop;
    const updateParam = { unitId, subUnitId, drawingId, drawingType, transform: { top: val } };
    setYPosition(val);
    drawingManagerService.featurePluginUpdateNotification([updateParam]);
    transformer.refreshControls().changeNotification();
  }, INPUT_DEBOUNCE_TIME);
  const handleRotationChange = (val) => {
    if (val == null) {
      return;
    }
    const updateParam = { unitId, subUnitId, drawingId, drawingType, transform: { angle: val } };
    setRotation(val);
    drawingManagerService.featurePluginUpdateNotification([updateParam]);
    transformer.refreshControls().changeNotification();
  };
  const handleLockRatioChange = (val) => {
    setLockRatio(val);
    transformer.keepRatio = val;
  };
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "div",
    {
      className: clsx("univer-grid univer-gap-2 univer-py-2 univer-text-gray-400", {
        "univer-hidden": !transformShow
      }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "header",
          {
            className: `univer-text-gray-600 dark:!univer-text-gray-200`,
            children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { children: localeService.t("drawing-ui.image-panel.transform.title") })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "div",
          {
            className: `univer-grid univer-grid-cols-3 univer-gap-2 [&>div]:univer-grid [&>div]:univer-gap-2`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: localeService.t("drawing-ui.image-panel.transform.width") }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  InputNumber,
                  {
                    precision: 1,
                    value: width,
                    min: MIN_DRAWING_WIDTH_LIMIT,
                    onChange: (val) => {
                      handleWidthChange(val);
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: localeService.t("drawing-ui.image-panel.transform.height") }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  InputNumber,
                  {
                    precision: 1,
                    value: height,
                    min: MIN_DRAWING_HEIGHT_LIMIT,
                    onChange: (val) => {
                      handleHeightChange(val);
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: localeService.t("drawing-ui.image-panel.transform.lock") }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "univer-text-center", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Checkbox, { checked: lockRatio, onChange: handleLockRatioChange }) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "div",
          {
            className: `univer-grid univer-grid-cols-3 univer-gap-2 [&>div]:univer-grid [&>div]:univer-gap-2`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: localeService.t("drawing-ui.image-panel.transform.x") }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(InputNumber, { precision: 1, value: xPosition, onChange: (val) => {
                  handleXChange(val);
                } })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: localeService.t("drawing-ui.image-panel.transform.y") }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(InputNumber, { precision: 1, value: yPosition, onChange: (val) => {
                  handleYChange(val);
                } })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: localeService.t("drawing-ui.image-panel.transform.rotate") }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  InputNumber,
                  {
                    precision: 1,
                    value: rotation,
                    min: RANGE_DRAWING_ROTATION_LIMIT[0],
                    max: RANGE_DRAWING_ROTATION_LIMIT[1],
                    onChange: handleRotationChange
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
};

// ../packages/drawing-ui/src/views/panel/ImageCropper.tsx
var import_react6 = __toESM(require_react());
var import_jsx_runtime6 = __toESM(require_jsx_runtime());
var ImageCropper = (props) => {
  const commandService = useDependency(ICommandService);
  const localeService = useDependency(LocaleService);
  const clipService = useDependency(DrawingImageClipService);
  const componentManager = useDependency(ComponentManager);
  const canUseShapeClip = useObservable(clipService.canUseShapeClip$, false);
  const { drawings, cropperShow } = props;
  const drawingParam = drawings[0];
  if (drawingParam == null) {
    return;
  }
  const [cropValue, setCropValue] = (0, import_react6.useState)("0" /* FREE */);
  const cropStateRef = (0, import_react6.useRef)(false);
  const cropOptions = [
    {
      label: localeService.t("drawing-ui.image-panel.crop.mode"),
      value: "0" /* FREE */
    },
    {
      label: "1:1",
      value: "1" /* R1_1 */
    },
    {
      label: "16:9",
      value: "2" /* R16_9 */
    },
    {
      label: "9:16",
      value: "3" /* R9_16 */
    },
    {
      label: "5:4",
      value: "4" /* R5_4 */
    },
    {
      label: "4:5",
      value: "5" /* R4_5 */
    },
    {
      label: "4:3",
      value: "6" /* R4_3 */
    },
    {
      label: "3:4",
      value: "7" /* R3_4 */
    },
    {
      label: "3:2",
      value: "8" /* R3_2 */
    },
    {
      label: "2:3",
      value: "9" /* R2_3 */
    }
  ];
  (0, import_react6.useEffect)(() => {
    const onChangeStartObserver = commandService.onCommandExecuted((command) => {
      if (command.id === CloseImageCropOperation.id) {
        const params = command.params;
        if (!(params == null ? void 0 : params.isAuto)) {
          cropStateRef.current = false;
        }
      }
    });
    return () => {
      onChangeStartObserver == null ? void 0 : onChangeStartObserver.dispose();
    };
  }, []);
  function handleCropChange(value) {
    setCropValue(value);
    if (cropStateRef.current) {
      commandService.executeCommand(AutoImageCropOperation.id, {
        cropType: value
      });
    }
  }
  const onCropperBtnClick = (val) => {
    commandService.executeCommand(AutoImageCropOperation.id, {
      cropType: val
    });
    cropStateRef.current = true;
  };
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "div",
    {
      className: clsx("univer-grid univer-gap-2 univer-py-2 univer-text-gray-400", {
        "univer-hidden": !cropperShow
      }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "header",
          {
            className: `univer-text-gray-600 dark:!univer-text-gray-200`,
            children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { children: localeService.t("drawing-ui.image-panel.crop.title") })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "univer-flex univer-items-center univer-justify-center univer-gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Button, { onClick: () => {
            onCropperBtnClick(cropValue);
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CreateCopyIcon, {}),
            localeService.t("drawing-ui.image-panel.crop.start")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Select, { value: cropValue, options: cropOptions, onChange: handleCropChange })
        ] }),
        canUseShapeClip && (() => {
          const ShapeClipPicker = componentManager.get(IMAGE_CLIP_SHAPE_PICKER_COMPONENT);
          return ShapeClipPicker ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ShapeClipPicker, {}) : null;
        })()
      ]
    }
  );
};

// ../packages/drawing-ui/src/views/panel/DrawingCommonPanel.tsx
var import_jsx_runtime7 = __toESM(require_jsx_runtime());
function getPanelShowState(drawings) {
  if (drawings.length === 0) {
    return {
      arrangeShow: false,
      transformShow: false,
      alignShow: false,
      cropperShow: false,
      nullShow: true
    };
  }
  if (drawings.length === 1) {
    return {
      arrangeShow: true,
      transformShow: true,
      alignShow: false,
      cropperShow: true,
      nullShow: false
    };
  }
  return {
    arrangeShow: true,
    transformShow: false,
    alignShow: true,
    cropperShow: false,
    nullShow: false
  };
}
var DrawingCommonPanel = (props) => {
  const drawingManagerService = useDependency(IDrawingManagerService);
  const renderManagerService = useDependency(IRenderManagerService);
  const localeService = useDependency(LocaleService);
  const { drawings, hasArrange = true, hasTransform = true, hasAlign = true, hasCropper = true, hasGroup = true } = props;
  const drawingParam = drawings[0];
  if (drawingParam == null) {
    return;
  }
  const { unitId } = drawingParam;
  const renderObject = renderManagerService.getRenderById(unitId);
  const scene = renderObject == null ? void 0 : renderObject.scene;
  if (scene == null) {
    return;
  }
  const transformer = scene.getTransformerByCreate();
  const initialShowState = getPanelShowState(drawings);
  const [arrangeShow, setArrangeShow] = (0, import_react7.useState)(initialShowState.arrangeShow);
  const [transformShow, setTransformShow] = (0, import_react7.useState)(initialShowState.transformShow);
  const [alignShow, setAlignShow] = (0, import_react7.useState)(initialShowState.alignShow);
  const [cropperShow, setCropperShow] = (0, import_react7.useState)(initialShowState.cropperShow);
  const [nullShow, setNullShow] = (0, import_react7.useState)(initialShowState.nullShow);
  (0, import_react7.useEffect)(() => {
    const clearControlSub = transformer.clearControl$.subscribe((changeSelf) => {
      if (changeSelf === true) {
        setArrangeShow(false);
        setTransformShow(false);
        setAlignShow(false);
        setCropperShow(false);
        setNullShow(true);
      }
    });
    const changeStartSub = transformer.changeStart$.subscribe((state) => {
      const { objects } = state;
      const params = getUpdateParams(objects, drawingManagerService);
      if (params.length === 0) {
        setArrangeShow(false);
        setTransformShow(false);
        setAlignShow(false);
        setCropperShow(false);
        setNullShow(true);
      } else if (params.length === 1) {
        setArrangeShow(true);
        setTransformShow(true);
        setAlignShow(false);
        setCropperShow(true);
        setNullShow(false);
      } else {
        setArrangeShow(true);
        setTransformShow(false);
        setAlignShow(true);
        setCropperShow(false);
        setNullShow(false);
      }
    });
    const focusSub = drawingManagerService.focus$.subscribe((drawings2) => {
      if (drawings2.length === 0) {
        setArrangeShow(false);
        setTransformShow(false);
        setAlignShow(false);
        setCropperShow(false);
        setNullShow(true);
      } else if (drawings2.length === 1) {
        setArrangeShow(true);
        setTransformShow(true);
        setAlignShow(false);
        setCropperShow(true);
        setNullShow(false);
      } else {
        setArrangeShow(true);
        setTransformShow(false);
        setAlignShow(true);
        setCropperShow(false);
        setNullShow(false);
      }
    });
    return () => {
      changeStartSub.unsubscribe();
      clearControlSub.unsubscribe();
      focusSub.unsubscribe();
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "div",
      {
        className: clsx("univer-h-full", {
          "univer-hidden": !nullShow
        }),
        children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "univer-flex univer-h-full univer-items-center univer-justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: localeService.t("drawing-ui.image-panel.null") }) })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DrawingArrange, { arrangeShow: hasArrange === true ? arrangeShow : false, drawings }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DrawingTransform, { transformShow: hasTransform === true ? transformShow : false, drawings }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DrawingAlign, { alignShow: hasAlign === true ? alignShow : false, drawings }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ImageCropper, { cropperShow: hasCropper === true ? cropperShow : false, drawings }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DrawingGroup, { hasGroup, drawings })
  ] });
};

export {
  IDocDrawingService,
  DocDrawingController,
  UniverDocsDrawingPlugin,
  OpenImageCropOperation,
  ImageResetSizeOperation,
  COMPONENT_IMAGE_POPUP_MENU,
  DrawingRenderService,
  ImageCropperObject,
  UniverDrawingUIPlugin,
  DrawingCommonPanel
};
