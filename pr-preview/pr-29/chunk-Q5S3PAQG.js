import {
  SheetSkeletonManagerService,
  getCoordByCell
} from "./chunk-YEVD4X4C.js";
import {
  ComponentManager,
  CrossHighlightingIcon,
  IMenuManagerService,
  IconManager,
  borderClassName,
  clsx,
  getMenuHiddenObservable,
  require_jsx_runtime,
  require_react,
  useDependency,
  useObservable
} from "./chunk-JL7CYBV7.js";
import {
  IRefSelectionsService,
  REF_SELECTIONS_ENABLED,
  SheetsSelectionsService
} from "./chunk-4P44Q6QX.js";
import {
  BehaviorSubject,
  ColorKit,
  Disposable,
  ICommandService,
  IConfigService,
  IContextService,
  IRenderManagerService,
  Inject,
  Injector,
  Plugin,
  Rect,
  Rectangle,
  Shape,
  ThemeService,
  combineLatest,
  map,
  merge,
  merge_default,
  startWith,
  tap
} from "./chunk-M6CFAGRR.js";
import {
  __decorateClass,
  __decorateParam,
  __publicField,
  __toESM
} from "./chunk-HECJ2TYE.js";

// ../packages/sheets-crosshair-highlight/package.json
var package_default = {
  name: "@univerjs/sheets-crosshair-highlight",
  version: "0.25.0",
  private: false,
  description: "Crosshair highlight plugin for Univer Sheets.",
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
    "sheets",
    "crosshair",
    "highlight",
    "plugin"
  ],
  exports: {
    ".": "./src/index.ts",
    "./*": "./src/*",
    "./locale/*": "./src/locale/*.ts",
    "./facade": "./src/facade/index.ts"
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
      "./facade": {
        import: "./lib/es/facade.js",
        require: "./lib/cjs/facade.js",
        types: "./lib/types/facade/index.d.ts"
      },
      "./lib/facade": {
        import: "./lib/es/facade.js",
        require: "./lib/cjs/facade.js",
        types: "./lib/types/facade/index.d.ts"
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
    "@univerjs/engine-render": "workspace:*",
    "@univerjs/icons": "1.12.0",
    "@univerjs/sheets": "workspace:*",
    "@univerjs/sheets-ui": "workspace:*",
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

// ../packages/sheets-crosshair-highlight/src/config/config.ts
var SHEETS_CROSSHAIR_HIGHLIGHT_PLUGIN_CONFIG_KEY = "sheets-crosshair-highlight.config";
var configSymbol = Symbol(SHEETS_CROSSHAIR_HIGHLIGHT_PLUGIN_CONFIG_KEY);
var defaultPluginConfig = {};

// ../packages/sheets-crosshair-highlight/src/services/crosshair.service.ts
var CROSSHAIR_HIGHLIGHT_COLOR_THEME_PATHS = Array.from({ length: 16 }, (_, index) => `highlight.background.${index + 1}`);
var DEFAULT_CROSSHAIR_HIGHLIGHT_COLOR_THEME_PATH = CROSSHAIR_HIGHLIGHT_COLOR_THEME_PATHS[0];
function resolveCrosshairHighlightColor(themeService, tokenPath) {
  var _a;
  const token = themeService.getColorFromTheme(tokenPath);
  if (token == null || typeof token.color !== "string" || typeof token.alpha !== "number") {
    throw new Error(`Theme token ${tokenPath} is required.`);
  }
  const color = (_a = themeService.getColorFromTheme(token.color)) != null ? _a : token.color;
  return new ColorKit(color).setAlpha(token.alpha).toRgbString();
}
function resolveCrosshairHighlightColors(themeService) {
  return CROSSHAIR_HIGHLIGHT_COLOR_THEME_PATHS.map((tokenPath) => resolveCrosshairHighlightColor(themeService, tokenPath));
}
var SheetsCrosshairHighlightService = class extends Disposable {
  constructor(_themeService) {
    super();
    __publicField(this, "_themeService", _themeService);
    __publicField(this, "_enabled$", new BehaviorSubject(false));
    __publicField(this, "enabled$", this._enabled$.asObservable());
    __publicField(this, "_colorToken$", new BehaviorSubject(DEFAULT_CROSSHAIR_HIGHLIGHT_COLOR_THEME_PATH));
    __publicField(this, "colorToken$", this._colorToken$.asObservable());
    __publicField(this, "color$");
    __publicField(this, "highlightColor$");
    this.color$ = combineLatest([this._colorToken$, this._themeService.currentTheme$]).pipe(
      map(([tokenPath]) => resolveCrosshairHighlightColor(this._themeService, tokenPath))
    );
    this.highlightColor$ = this.color$;
  }
  get enabled() {
    return this._enabled$.getValue();
  }
  dispose() {
    this._enabled$.complete();
    this._colorToken$.complete();
  }
  setEnabled(value) {
    this._enabled$.next(value);
  }
  setColor(value) {
    this._colorToken$.next(value);
  }
};
SheetsCrosshairHighlightService = __decorateClass([
  __decorateParam(0, Inject(ThemeService))
], SheetsCrosshairHighlightService);

// ../packages/sheets-crosshair-highlight/src/commands/operations/operation.ts
var ToggleCrosshairHighlightOperation = {
  id: "sheet.operation.toggle-crosshair-highlight",
  type: 1 /* OPERATION */,
  handler(accessor) {
    const service = accessor.get(SheetsCrosshairHighlightService);
    const turnedOn = service.enabled;
    service.setEnabled(!turnedOn);
    return true;
  }
};
var SetCrosshairHighlightColorOperation = {
  id: "sheet.operation.set-crosshair-highlight-color",
  type: 1 /* OPERATION */,
  handler(accessor, { value }) {
    const service = accessor.get(SheetsCrosshairHighlightService);
    if (!service.enabled) service.setEnabled(true);
    service.setColor(value);
    return true;
  }
};
var EnableCrosshairHighlightOperation = {
  id: "sheet.operation.enable-crosshair-highlight",
  type: 1 /* OPERATION */,
  handler(accessor) {
    const service = accessor.get(SheetsCrosshairHighlightService);
    if (service.enabled) {
      return false;
    }
    service.setEnabled(true);
    return true;
  }
};
var DisableCrosshairHighlightOperation = {
  id: "sheet.operation.disable-crosshair-highlight",
  type: 1 /* OPERATION */,
  handler(accessor) {
    const service = accessor.get(SheetsCrosshairHighlightService);
    if (!service.enabled) {
      return false;
    }
    service.setEnabled(false);
    return true;
  }
};

// ../packages/sheets-crosshair-highlight/src/menu/crosshair.menu.ts
var CROSSHAIR_HIGHLIGHT_OVERLAY_COMPONENT = "CROSSHAIR_HIGHLIGHT_OVERLAY_COMPONENT";
function CrosshairHighlightMenuItemFactory(accessor) {
  const crosshairHighlightService = accessor.get(SheetsCrosshairHighlightService);
  return {
    id: ToggleCrosshairHighlightOperation.id,
    tooltip: "sheets-crosshair-highlight.button.tooltip",
    type: 2 /* BUTTON_SELECTOR */,
    icon: "CrossHighlightingIcon",
    selections: [
      {
        label: {
          name: CROSSHAIR_HIGHLIGHT_OVERLAY_COMPONENT,
          hoverable: false,
          selectable: false
        }
      }
    ],
    selectionsCommandId: SetCrosshairHighlightColorOperation.id,
    activated$: crosshairHighlightService.enabled$,
    hidden$: getMenuHiddenObservable(accessor, 2 /* UNIVER_SHEET */)
  };
}

// ../packages/sheets-crosshair-highlight/src/menu/schema.ts
var menuSchema = {
  ["contextMenu.footerMenu" /* FOOTER_MENU */]: {
    ["contextMenu.others" /* OTHERS */]: {
      [ToggleCrosshairHighlightOperation.id]: {
        order: 0,
        menuItemFactory: CrosshairHighlightMenuItemFactory
      }
    }
  }
};

// ../packages/sheets-crosshair-highlight/src/views/components/CrosshairHighlight.tsx
var import_react = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
function CrosshairOverlay(props) {
  const { onChange } = props;
  const crosshairSrv = useDependency(SheetsCrosshairHighlightService);
  const themeService = useDependency(ThemeService);
  const currentColor = useObservable(crosshairSrv.color$);
  useObservable(themeService.currentTheme$);
  const colors = resolveCrosshairHighlightColors(themeService);
  const handleColorPicked = (0, import_react.useCallback)((tokenPath) => {
    onChange == null ? void 0 : onChange(tokenPath);
  }, [onChange]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "univer-grid univer-grid-cols-8 univer-gap-x-2 univer-gap-y-3", children: colors.map((color, index) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: clsx(`hover:univer-ring-primary-600/40 univer-box-border univer-size-5 univer-cursor-pointer univer-rounded univer-ring-offset-1 univer-transition-shadow hover:univer-ring-[1.5px]`, borderClassName, {
          "univer-ring-[1.5px] univer-ring-primary-600 hover:univer-ring-primary-600": color === currentColor
        }),
        style: { backgroundColor: color },
        onClick: () => handleColorPicked(CROSSHAIR_HIGHLIGHT_COLOR_THEME_PATHS[index])
      },
      CROSSHAIR_HIGHLIGHT_COLOR_THEME_PATHS[index]
    );
  }) });
}

// ../packages/sheets-crosshair-highlight/src/controllers/crosshair.controller.ts
var SheetsCrosshairHighlightController = class extends Disposable {
  constructor(_componentMgr, _iconMgr, _menuManagerService, _cmdSrv) {
    super();
    __publicField(this, "_componentMgr", _componentMgr);
    __publicField(this, "_iconMgr", _iconMgr);
    __publicField(this, "_menuManagerService", _menuManagerService);
    __publicField(this, "_cmdSrv", _cmdSrv);
    this._initCommands();
    this._initMenus();
    this._initComponents();
    this._registerIcons();
  }
  _initCommands() {
    [
      ToggleCrosshairHighlightOperation,
      SetCrosshairHighlightColorOperation,
      EnableCrosshairHighlightOperation,
      DisableCrosshairHighlightOperation
    ].forEach((c) => this._cmdSrv.registerCommand(c));
  }
  _initMenus() {
    this._menuManagerService.mergeMenu(menuSchema);
  }
  _initComponents() {
    this._componentMgr.register(CROSSHAIR_HIGHLIGHT_OVERLAY_COMPONENT, CrosshairOverlay);
  }
  _registerIcons() {
    this.disposeWithMe(this._iconMgr.register({
      CrossHighlightingIcon
    }));
  }
};
SheetsCrosshairHighlightController = __decorateClass([
  __decorateParam(0, Inject(ComponentManager)),
  __decorateParam(1, Inject(IconManager)),
  __decorateParam(2, IMenuManagerService),
  __decorateParam(3, ICommandService)
], SheetsCrosshairHighlightController);

// ../packages/sheets-crosshair-highlight/src/const.ts
var SHEETS_CROSSHAIR_HIGHLIGHT_Z_INDEX = 1;

// ../packages/sheets-crosshair-highlight/src/util.ts
var CrossHairRangeCollection = class {
  constructor() {
    __publicField(this, "_selectedRanges", []);
    __publicField(this, "_ranges", []);
  }
  addRange(range) {
    if (range.rangeType === 2 /* COLUMN */ || range.rangeType === 1 /* ROW */ || range.rangeType === 3 /* ALL */) {
      return;
    }
    const intersects = this._getIntersects(range);
    const splitRanges = this._getSplitRanges(range, intersects);
    if (splitRanges.length > 0) {
      this._ranges.push(...splitRanges);
    }
  }
  setSelectedRanges(selectedRange) {
    this._selectedRanges = selectedRange;
  }
  _getSplitRanges(range, intersects) {
    let splitRanges = [range];
    for (const intersect of intersects.concat(this._selectedRanges)) {
      const newRanges = [];
      for (const splitRange of splitRanges) {
        const split = Rectangle.subtract(splitRange, intersect);
        if (split && split.length > 0) {
          newRanges.push(...split);
        }
      }
      splitRanges = newRanges;
    }
    return splitRanges.filter((range2) => range2.startRow <= range2.endRow && range2.startColumn <= range2.endColumn);
  }
  _getIntersects(addRange) {
    const intersects = [];
    for (const range of this._ranges) {
      const intersect = Rectangle.getIntersects(range, addRange);
      if (intersect) {
        intersects.push(intersect);
      }
    }
    return intersects;
  }
  getRanges() {
    return this._ranges;
  }
  reset() {
    this._ranges = [];
    this._selectedRanges = [];
  }
};

// ../packages/sheets-crosshair-highlight/src/views/widgets/crosshair-highlight-shape.ts
var SheetCrossHairHighlightShape = class extends Shape {
  constructor(key, props) {
    super(key, props);
    // protected _showHighLight = false;
    __publicField(this, "_color");
    if (props) {
      this.setShapeProps(props);
    }
  }
  setShapeProps(props) {
    if (typeof props.color !== "undefined") {
      this._color = props.color;
    }
    this.transformByState({
      width: props.width,
      height: props.height
    });
  }
  _draw(ctx) {
    var _a, _b;
    const color = `rgba(${this._color.r}, ${this._color.g}, ${this._color.b}, ${(_b = (_a = this._color) == null ? void 0 : _a.a) != null ? _b : 0.5})`;
    Rect.drawWith(ctx, {
      width: this.width,
      height: this.height,
      fill: color,
      stroke: void 0,
      strokeWidth: 0,
      evented: false
    });
  }
};

// ../packages/sheets-crosshair-highlight/src/views/widgets/crosshair-highlight.render-controller.ts
var SheetCrosshairHighlightRenderController = class extends Disposable {
  constructor(_context, _sheetSkeletonManagerService, _sheetsSelectionsService, _sheetsCrosshairHighlightService, _contextService, _refSelectionsService) {
    super();
    __publicField(this, "_context", _context);
    __publicField(this, "_sheetSkeletonManagerService", _sheetSkeletonManagerService);
    __publicField(this, "_sheetsSelectionsService", _sheetsSelectionsService);
    __publicField(this, "_sheetsCrosshairHighlightService", _sheetsCrosshairHighlightService);
    __publicField(this, "_contextService", _contextService);
    __publicField(this, "_refSelectionsService", _refSelectionsService);
    __publicField(this, "_shapes", []);
    __publicField(this, "_rangeCollection", new CrossHairRangeCollection());
    __publicField(this, "_color", "rgba(255,0,0,0.5)");
    this._initRenderListener();
  }
  _transformSelection(selectionData, sheet) {
    if (!selectionData) {
      return;
    }
    const rowCount = sheet.getRowCount();
    const columnCount = sheet.getColumnCount();
    const ranges = [];
    for (const selection of selectionData) {
      const { startRow, endRow, startColumn, endColumn } = selection.range;
      if (endRow - startRow + 1 === rowCount || endColumn - startColumn + 1 === columnCount) {
        continue;
      }
      ranges.push(selection.range);
    }
    this._rangeCollection.setSelectedRanges(ranges);
    for (const range of ranges) {
      this.addSelection(range, sheet);
    }
  }
  _initRenderListener() {
    const workbook = this._context.unit;
    this.disposeWithMe(combineLatest([
      this._contextService.subscribeContextValue$(REF_SELECTIONS_ENABLED).pipe(startWith(false)),
      this._sheetSkeletonManagerService.currentSkeleton$,
      this._sheetsCrosshairHighlightService.enabled$,
      this._sheetsCrosshairHighlightService.highlightColor$.pipe(tap((color) => this._color = color)),
      merge(
        this._sheetsSelectionsService.selectionMoveStart$,
        this._sheetsSelectionsService.selectionMoving$,
        this._sheetsSelectionsService.selectionMoveEnd$,
        this._sheetsSelectionsService.selectionSet$,
        workbook.activeSheet$.pipe(map(() => this._sheetsSelectionsService.getCurrentSelections()))
      ),
      merge(
        this._refSelectionsService.selectionMoveStart$,
        this._refSelectionsService.selectionMoving$,
        this._refSelectionsService.selectionMoveEnd$,
        this._sheetsSelectionsService.selectionSet$,
        workbook.activeSheet$.pipe(map(() => this._refSelectionsService.getCurrentSelections()))
      )
    ]).subscribe(([refSelectionEnabled, _, enabled, _color, normalSelections, refSelection]) => {
      this._clear();
      if (!enabled) return;
      const selections = refSelectionEnabled ? refSelection : normalSelections;
      this._rangeCollection.reset();
      this._transformSelection(selections, workbook.getActiveSheet());
      this.render(this._rangeCollection.getRanges());
    }));
  }
  addSelection(range, sheet) {
    if (range.rangeType === 2 /* COLUMN */ || range.rangeType === 1 /* ROW */ || range.rangeType === 3 /* ALL */) {
      return;
    }
    const maxRow = sheet.getRowCount();
    const maxColumn = sheet.getColumnCount();
    const { startRow, endRow, startColumn, endColumn } = range;
    const left = {
      startRow,
      endRow,
      startColumn: 0,
      endColumn: startColumn - 1
    };
    const right = {
      startRow,
      endRow,
      startColumn: endColumn + 1,
      endColumn: maxColumn
    };
    const top = {
      startRow: 0,
      endRow: startRow - 1,
      startColumn,
      endColumn
    };
    const bottom = {
      startRow: endRow + 1,
      endRow: maxRow,
      startColumn,
      endColumn
    };
    for (const range2 of [left, right, top, bottom]) {
      if (range2.startRow <= range2.endRow && range2.startColumn <= range2.endColumn) {
        this._rangeCollection.addRange(range2);
      }
    }
  }
  _clear() {
    this._shapes.forEach((shape) => {
      shape.dispose();
    });
    this._shapes = [];
  }
  _addShapes(range, index, scene, skeleton) {
    const { startRow, endRow, startColumn, endColumn } = range;
    const startPosition = getCoordByCell(startRow, startColumn, scene, skeleton);
    const endPosition = getCoordByCell(endRow, endColumn, scene, skeleton);
    const { startX, startY } = startPosition;
    const { endX, endY } = endPosition;
    const width = endX - startX;
    const height = endY - startY;
    const shapeProps = {
      left: startX,
      top: startY,
      color: new ColorKit(this._color).toRgb(),
      width,
      height,
      zIndex: SHEETS_CROSSHAIR_HIGHLIGHT_Z_INDEX,
      evented: false
    };
    const currentShapes = new SheetCrossHairHighlightShape(`crosshair-${index}`, shapeProps);
    this._shapes.push(currentShapes);
    scene.addObject(currentShapes);
  }
  render(ranges) {
    const skeleton = this._sheetSkeletonManagerService.getCurrentSkeleton();
    if (!skeleton) {
      return;
    }
    const { scene } = this._context;
    this._clear();
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      this._addShapes(range, i, scene, skeleton);
    }
    scene.makeDirty(true);
  }
  async dispose() {
    super.dispose();
  }
};
SheetCrosshairHighlightRenderController = __decorateClass([
  __decorateParam(1, Inject(SheetSkeletonManagerService)),
  __decorateParam(2, Inject(SheetsSelectionsService)),
  __decorateParam(3, Inject(SheetsCrosshairHighlightService)),
  __decorateParam(4, Inject(IContextService)),
  __decorateParam(5, IRefSelectionsService)
], SheetCrosshairHighlightRenderController);

// ../packages/sheets-crosshair-highlight/src/plugin.ts
var UniverSheetsCrosshairHighlightPlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig, _injector, _renderManagerService, _configService) {
    super();
    __publicField(this, "_config", _config);
    __publicField(this, "_injector", _injector);
    __publicField(this, "_renderManagerService", _renderManagerService);
    __publicField(this, "_configService", _configService);
    const { ...rest } = merge_default(
      {},
      defaultPluginConfig,
      this._config
    );
    this._configService.setConfig(SHEETS_CROSSHAIR_HIGHLIGHT_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    [
      [SheetsCrosshairHighlightService],
      [SheetsCrosshairHighlightController]
    ].forEach((d) => this._injector.add(d));
  }
  onReady() {
    [
      [SheetCrosshairHighlightRenderController]
    ].forEach((d) => this._injector.add(d));
    this._injector.get(SheetsCrosshairHighlightController);
    this._renderManagerService.registerRenderModule(2 /* UNIVER_SHEET */, [SheetCrosshairHighlightRenderController]);
  }
};
__publicField(UniverSheetsCrosshairHighlightPlugin, "pluginName", "SHEET_CROSSHAIR_HIGHLIGHT_PLUGIN");
__publicField(UniverSheetsCrosshairHighlightPlugin, "packageName", package_default.name);
__publicField(UniverSheetsCrosshairHighlightPlugin, "version", package_default.version);
__publicField(UniverSheetsCrosshairHighlightPlugin, "type", 2 /* UNIVER_SHEET */);
UniverSheetsCrosshairHighlightPlugin = __decorateClass([
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, IRenderManagerService),
  __decorateParam(3, IConfigService)
], UniverSheetsCrosshairHighlightPlugin);

export {
  SheetsCrosshairHighlightService,
  ToggleCrosshairHighlightOperation,
  EnableCrosshairHighlightOperation,
  DisableCrosshairHighlightOperation,
  UniverSheetsCrosshairHighlightPlugin
};
