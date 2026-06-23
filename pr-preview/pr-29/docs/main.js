import "../chunk-3XBZGOHB.js";
import {
  UniverDocsMentionUIPlugin
} from "../chunk-USCRHNX4.js";
import {
  UniverDocsHyperLinkUIPlugin,
  UniverDocsThreadCommentUIPlugin
} from "../chunk-WA2V36FJ.js";
import "../chunk-5CKCHV6U.js";
import {
  UniverDebuggerPlugin
} from "../chunk-6SHGRHNG.js";
import {
  UniverWatermarkPlugin
} from "../chunk-WH3DHUR4.js";
import {
  zh_CN_default
} from "../chunk-5NAVWEQE.js";
import {
  InsertDocImageCommand,
  UniverDocsDrawingUIPlugin
} from "../chunk-E4LJUPAT.js";
import "../chunk-EDYVLQ5J.js";
import {
  DEFAULT_DOCUMENT_DATA_SIMPLE,
  loadDebuggerLocale
} from "../chunk-BMEFCVUP.js";
import "../chunk-ADMC2PQI.js";
import "../chunk-YEVD4X4C.js";
import "../chunk-IMWY7PB3.js";
import "../chunk-R2WETKND.js";
import "../chunk-JMN42JDC.js";
import {
  UniverDocsDrawingPlugin,
  UniverDrawingUIPlugin
} from "../chunk-CSYKENI5.js";
import {
  BulletListCommand,
  CutContentCommand,
  DeleteLeftCommand,
  DeleteTextCommand,
  DocCanvasPopManagerService,
  DocCreateTableOperation,
  DocEventManagerService,
  DocSelectionManagerService,
  DocSkeletonManagerService,
  HorizontalLineCommand,
  IMEInputCommand,
  InsertTextCommand,
  MoveCursorOperation,
  NodePositionConvertToCursor,
  OrderListCommand,
  RichTextEditingMutation,
  UniverDocsPlugin,
  UniverDocsUIPlugin,
  UniverDrawingPlugin,
  getAnchorBounding
} from "../chunk-DXOT3Z2O.js";
import "../chunk-WRDP6BX6.js";
import "../chunk-LI6UXASZ.js";
import {
  ComponentManager,
  DividerIcon,
  ILayoutService,
  IShortcutService,
  IconManager,
  IncreaseIcon,
  TextIcon,
  Tooltip,
  UniverUIPlugin,
  borderBottomClassName,
  borderClassName,
  clsx,
  require_jsx_runtime,
  require_react,
  scrollbarClassName,
  useDependency,
  useEvent,
  useObservable
} from "../chunk-JL7CYBV7.js";
import "../chunk-LOQW54LO.js";
import {
  FUniver
} from "../chunk-JRQIBFK2.js";
import "../chunk-QAY465GM.js";
import "../chunk-IUS37GUB.js";
import {
  UniverFormulaEnginePlugin
} from "../chunk-4P44Q6QX.js";
import {
  BehaviorSubject,
  DependentOn,
  Disposable,
  DisposableCollection,
  ICommandService,
  IConfigService,
  IRenderManagerService,
  IUniverInstanceService,
  Inject,
  Injector,
  LocaleService,
  Plugin,
  Univer,
  UniverRenderEnginePlugin,
  UserManagerService,
  combineLatest,
  distinctUntilChanged,
  generateRandomId,
  map,
  merge_default,
  of,
  ptToPixel,
  tap,
  toDisposable
} from "../chunk-M6CFAGRR.js";
import "../chunk-EQ2B2W73.js";
import {
  __decorateClass,
  __decorateParam,
  __publicField,
  __toESM
} from "../chunk-HECJ2TYE.js";

// ../packages/docs-quick-insert-ui/src/commands/commands/doc-quick-insert.command.ts
var DeleteSearchKeyCommand = {
  id: "doc.command.delete-search-key",
  type: 0 /* COMMAND */,
  handler: (accessor, params) => {
    const commandService = accessor.get(ICommandService);
    const { start, end } = params;
    return commandService.syncExecuteCommand(CutContentCommand.id, {
      segmentId: "",
      textRanges: [{
        startOffset: start,
        endOffset: start,
        collapsed: true
      }],
      selections: [{
        startOffset: start,
        endOffset: end,
        collapsed: false,
        direction: "forward" /* FORWARD */
      }]
    });
  }
};

// ../packages/docs-quick-insert-ui/src/views/KeywordInputPlaceholder.tsx
var import_react = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var KeywordInputPlaceholderComponentKey = "docs.quick.insert.keyword-input-placeholder";
var DEFAULT_FONT_SIZE = 11;
function measureTextWidth(text, font) {
  if (typeof document === "undefined") {
    return text.length * DEFAULT_FONT_SIZE;
  }
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return text.length * DEFAULT_FONT_SIZE;
  }
  context.font = font;
  return Math.ceil(context.measureText(text).width);
}
var KeywordInputPlaceholder = ({ popup }) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const localeService = useDependency(LocaleService);
  const placeholder = localeService.t("docs-quick-insert-ui.keywordInputPlaceholder");
  const fontSize = (_b = (_a = popup.extraProps) == null ? void 0 : _a.fontSize) != null ? _b : DEFAULT_FONT_SIZE;
  const fontSizePx = ptToPixel(fontSize);
  const fontString = (_d = (_c = popup.extraProps) == null ? void 0 : _c.fontString) != null ? _d : `${fontSizePx}px sans-serif`;
  const ascent = (_f = (_e = popup.extraProps) == null ? void 0 : _e.ascent) != null ? _f : fontSizePx;
  const contentHeight = Math.max((_h = (_g = popup.extraProps) == null ? void 0 : _g.contentHeight) != null ? _h : fontSizePx, fontSizePx);
  const textWidth = (0, import_react.useMemo)(() => measureTextWidth(placeholder, fontString), [fontString, placeholder]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: `univer-select-none univer-font-normal univer-text-gray-500 univer-transition-colors dark:!univer-text-gray-400`,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "svg",
        {
          width: textWidth,
          height: contentHeight,
          viewBox: `0 0 ${textWidth} ${contentHeight}`,
          style: { overflow: "visible", display: "block" },
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "text",
            {
              x: 0,
              y: ascent,
              fill: "currentColor",
              style: {
                font: fontString,
                fontFamily: (_i = popup.extraProps) == null ? void 0 : _i.fontFamily,
                fontStyle: (_j = popup.extraProps) == null ? void 0 : _j.fontStyle,
                fontWeight: (_k = popup.extraProps) == null ? void 0 : _k.fontWeight
              },
              children: placeholder
            }
          )
        }
      )
    }
  );
};
KeywordInputPlaceholder.componentKey = KeywordInputPlaceholderComponentKey;

// ../packages/docs-quick-insert-ui/src/views/QuickInsertPopup.tsx
var import_react3 = __toESM(require_react());

// ../packages/docs-quick-insert-ui/src/views/QuickInsertMenu.tsx
var import_react2 = __toESM(require_react());
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
function isMenuGroup(menu) {
  return "children" in menu;
}
function flattenMenuItems(menus) {
  return menus.flatMap((menu) => {
    if (isMenuGroup(menu)) {
      return flattenMenuItems(menu.children);
    }
    return menu;
  });
}
function getQuickInsertMenuLeafCount(menus) {
  return flattenMenuItems(menus).length;
}
function QuickInsertMenu(props) {
  const {
    menus,
    focusedMenuIndex,
    onFocusedMenuIndexChange,
    onFocusedMenuChange,
    onSelect
  } = props;
  const iconManager = useDependency(IconManager);
  const flatMenus = (0, import_react2.useMemo)(() => flattenMenuItems(menus), [menus]);
  const menuNodeMapRef = (0, import_react2.useRef)(/* @__PURE__ */ new Map());
  (0, import_react2.useEffect)(() => {
    var _a, _b;
    const focusedMenu = Number.isNaN(focusedMenuIndex) ? null : (_a = flatMenus[focusedMenuIndex]) != null ? _a : null;
    onFocusedMenuChange(focusedMenu);
    if (!focusedMenu) {
      return;
    }
    (_b = menuNodeMapRef.current.get(focusedMenu.id)) == null ? void 0 : _b.scrollIntoView({
      block: "nearest"
    });
  }, [flatMenus, focusedMenuIndex, onFocusedMenuChange]);
  (0, import_react2.useEffect)(() => {
    const menuNodeMap = menuNodeMapRef.current;
    return () => {
      menuNodeMap.clear();
    };
  }, []);
  const itemIndexRef = (0, import_react2.useRef)(0);
  itemIndexRef.current = 0;
  function renderMenus(currentMenus) {
    return currentMenus.map((menu, index) => {
      const iconKey = menu.icon;
      const Icon = iconKey ? iconManager.get(iconKey) : null;
      if (isMenuGroup(menu)) {
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "div",
          {
            className: clsx("univer-grid univer-gap-1 univer-py-1", index !== currentMenus.length - 1 && borderBottomClassName),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                "div",
                {
                  className: `univer-box-border univer-inline-flex univer-items-center univer-gap-2 univer-px-2 univer-text-xs univer-font-semibold univer-text-gray-600 dark:!univer-text-gray-300`,
                  children: [
                    Icon && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "univer-inline-flex univer-text-base", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Icon, {}) }),
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: menu.title })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "univer-grid univer-gap-1", children: renderMenus(menu.children) })
            ]
          },
          menu.id
        );
      }
      const currentMenuIndex = itemIndexRef.current;
      const isFocused = focusedMenuIndex === currentMenuIndex;
      itemIndexRef.current += 1;
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "div",
        {
          ref: (node) => {
            if (node) {
              menuNodeMapRef.current.set(menu.id, node);
              return;
            }
            menuNodeMapRef.current.delete(menu.id);
          },
          role: "button",
          tabIndex: -1,
          className: clsx(`univer-relative univer-box-border univer-flex univer-min-h-8 univer-w-full univer-cursor-pointer univer-items-center univer-justify-between univer-gap-3 univer-rounded-md univer-border-none univer-bg-transparent univer-px-2 univer-text-left univer-text-sm univer-text-gray-900 univer-outline-none hover:univer-bg-gray-50 dark:!univer-text-white dark:hover:!univer-bg-gray-600`, {
            "hover:univer-bg-transparent": !isFocused,
            "univer-bg-gray-50 dark:!univer-bg-gray-600": isFocused
          }),
          onMouseEnter: () => onFocusedMenuIndexChange(currentMenuIndex),
          onMouseLeave: () => onFocusedMenuIndexChange(Number.NaN),
          onClick: () => onSelect(menu),
          children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "univer-inline-flex univer-w-full univer-items-center univer-gap-2", children: [
            Icon && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "univer-inline-flex univer-text-base", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Icon, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Tooltip, { showIfEllipsis: true, title: menu.title, placement: "right", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "univer-truncate", children: menu.title }) })
          ] })
        },
        menu.id
      );
    });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      className: clsx(`univer-box-border univer-grid univer-max-h-[360px] univer-gap-1 univer-overflow-y-auto univer-overflow-x-hidden univer-overscroll-contain univer-rounded-md univer-bg-white univer-px-2 univer-py-1 univer-text-sm univer-text-gray-900 univer-shadow-md dark:!univer-bg-gray-700 dark:!univer-text-white`, borderClassName, scrollbarClassName),
      onWheel: (event) => event.stopPropagation(),
      children: renderMenus(menus)
    }
  );
}

// ../packages/docs-quick-insert-ui/src/views/QuickInsertPlaceholder.tsx
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
var QuickInsertPlaceholderComponentKey = "docs.quick.insert.placeholder";
var QuickInsertPlaceholder = () => {
  const localeService = useDependency(LocaleService);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "div",
    {
      className: `univer-flex univer-h-full univer-items-center univer-justify-center univer-rounded-lg univer-bg-white univer-px-12 univer-py-6 univer-text-gray-400 univer-shadow-lg`,
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: localeService.t("docs-quick-insert-ui.placeholder") })
    }
  );
};
QuickInsertPlaceholder.componentKey = QuickInsertPlaceholderComponentKey;

// ../packages/docs-quick-insert-ui/src/views/QuickInsertPopup.tsx
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
function filterMenusByKeyword(menus, keyword) {
  return menus.map((menu) => ({ ...menu })).filter((menu) => {
    if ("children" in menu) {
      menu.children = filterMenusByKeyword(menu.children, keyword);
      return menu.children.length > 0;
    }
    const keywords = menu.keywords;
    if (keywords) {
      return keywords.some((word) => word.includes(keyword));
    }
    return menu.title.toLowerCase().includes(keyword);
  });
}
function translateMenus(menus, localeService) {
  return menus.map((_menu) => {
    const menu = { ..._menu };
    if ("children" in menu) {
      menu.children = translateMenus(menu.children, localeService);
    }
    menu.title = localeService.t(menu.title);
    if ("keywords" in menu) {
      menu.keywords = menu.keywords.concat(menu.title).map((word) => word.toLowerCase());
    }
    return menu;
  });
}
var interceptKeys = [38 /* ARROW_UP */, 40 /* ARROW_DOWN */, 13 /* ENTER */];
var QuickInsertPopup = () => {
  const localeService = useDependency(LocaleService);
  const docQuickInsertPopupService = useDependency(DocQuickInsertPopupService);
  const componentManager = useDependency(ComponentManager);
  const shortcutService = useDependency(IShortcutService);
  const commandService = useDependency(ICommandService);
  const id = (0, import_react3.useMemo)(() => generateRandomId(), []);
  const [focusedMenuIndex, setFocusedMenuIndex] = (0, import_react3.useState)(0);
  const focusedMenuRef = (0, import_react3.useRef)(null);
  const filterKeyword = useObservable(docQuickInsertPopupService.filterKeyword$, "");
  const currentPopup = useObservable(docQuickInsertPopupService.editPopup$);
  const menus = useObservable(currentPopup == null ? void 0 : currentPopup.popup.menus$, []);
  const translatedMenus = (0, import_react3.useMemo)(() => {
    return translateMenus(menus, localeService);
  }, [menus]);
  const [filteredMenus, setFilteredMenus] = (0, import_react3.useState)(() => {
    return filterMenusByKeyword(translatedMenus, filterKeyword.toLowerCase());
  });
  const filteredMenuCount = (0, import_react3.useMemo)(() => getQuickInsertMenuLeafCount(filteredMenus), [filteredMenus]);
  const filteredMenuCountRef = (0, import_react3.useRef)(filteredMenuCount);
  (0, import_react3.useEffect)(() => {
    filteredMenuCountRef.current = filteredMenuCount;
  }, [filteredMenuCount]);
  (0, import_react3.useEffect)(() => {
    const id2 = requestIdleCallback(() => {
      setFilteredMenus(filterMenusByKeyword(translatedMenus, filterKeyword.toLowerCase()));
    });
    return () => {
      cancelIdleCallback(id2);
    };
  }, [translatedMenus, filterKeyword]);
  const handleMenuSelect = (menu) => {
    docQuickInsertPopupService.emitMenuSelected(menu);
    commandService.executeCommand(CloseQuickInsertPopupOperation.id);
  };
  const handleFocusedMenuChange = (0, import_react3.useCallback)((menu) => {
    focusedMenuRef.current = menu;
  }, []);
  (0, import_react3.useEffect)(() => {
    const disposableCollection = new DisposableCollection();
    const shortcutItems = shortcutService.getAllShortcuts();
    const interceptedShortcutItems = shortcutItems.filter((item) => item.binding && interceptKeys.includes(item.binding));
    interceptedShortcutItems.forEach((item) => {
      const rawPreconditions = item.preconditions;
      item.preconditions = () => false;
      disposableCollection.add(toDisposable(() => {
        item.preconditions = rawPreconditions;
      }));
    });
    const enterCommand = {
      id: `quick.insert.popup.enter.${id}`,
      type: 1 /* OPERATION */,
      handler: () => {
        const menu = focusedMenuRef.current;
        if (menu) {
          handleMenuSelect(menu);
        }
      }
    };
    const moveCursorUpCommand = {
      id: `quick.insert.popup.move.cursor.up.${id}`,
      type: 1 /* OPERATION */,
      handler: () => {
        setFocusedMenuIndex((index) => {
          if (filteredMenuCountRef.current <= 0) {
            return 0;
          }
          const nextIndex = index - 1;
          return nextIndex >= 0 ? nextIndex : filteredMenuCountRef.current - 1;
        });
      }
    };
    const moveCursorDownCommand = {
      id: `quick.insert.popup.move.cursor.down.${id}`,
      type: 1 /* OPERATION */,
      handler: () => {
        setFocusedMenuIndex((index) => {
          if (filteredMenuCountRef.current <= 0) {
            return 0;
          }
          const nextIndex = index + 1;
          return nextIndex <= filteredMenuCountRef.current - 1 ? nextIndex : 0;
        });
      }
    };
    disposableCollection.add(commandService.registerCommand(moveCursorUpCommand));
    disposableCollection.add(commandService.registerCommand(moveCursorDownCommand));
    disposableCollection.add(commandService.registerCommand(enterCommand));
    disposableCollection.add(shortcutService.registerShortcut({
      priority: 1e3,
      id: moveCursorUpCommand.id,
      binding: 38 /* ARROW_UP */,
      preconditions: () => true,
      staticParameters: {
        direction: 0 /* UP */
      }
    }));
    disposableCollection.add(shortcutService.registerShortcut({
      priority: 1e3,
      id: moveCursorDownCommand.id,
      binding: 40 /* ARROW_DOWN */,
      preconditions: () => true,
      staticParameters: {
        direction: 2 /* DOWN */
      }
    }));
    disposableCollection.add(shortcutService.registerShortcut({
      priority: 1e3,
      id: enterCommand.id,
      binding: 13 /* ENTER */,
      preconditions: () => true
    }));
    return () => {
      disposableCollection.dispose();
    };
  }, [commandService, id, shortcutService]);
  (0, import_react3.useEffect)(() => {
    setFocusedMenuIndex(0);
  }, [filteredMenus]);
  const hasMenus = filteredMenus.length > 0;
  const Placeholder = (currentPopup == null ? void 0 : currentPopup.popup.Placeholder) || componentManager.get(QuickInsertPlaceholder.componentKey);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "univer-mt-2", children: hasMenus ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    QuickInsertMenu,
    {
      menus: filteredMenus,
      focusedMenuIndex,
      onFocusedMenuIndexChange: setFocusedMenuIndex,
      onFocusedMenuChange: handleFocusedMenuChange,
      onSelect: handleMenuSelect
    }
  ) : Placeholder && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Placeholder, {}) });
};
QuickInsertPopup.componentKey = "docs.quick.insert.popup";

// ../packages/docs-quick-insert-ui/src/services/doc-quick-insert-popup.service.ts
var noopDisposable = {
  dispose: () => {
  }
};
var DocQuickInsertPopupService = class extends Disposable {
  constructor(_docCanvasPopupManagerService, _univerInstanceService, _commandService, _renderManagerService, _docSelectionManagerService) {
    super();
    __publicField(this, "_docCanvasPopupManagerService", _docCanvasPopupManagerService);
    __publicField(this, "_univerInstanceService", _univerInstanceService);
    __publicField(this, "_commandService", _commandService);
    __publicField(this, "_renderManagerService", _renderManagerService);
    __publicField(this, "_docSelectionManagerService", _docSelectionManagerService);
    __publicField(this, "_popups", /* @__PURE__ */ new Set());
    __publicField(this, "_editPopup$", new BehaviorSubject(void 0));
    __publicField(this, "editPopup$", this._editPopup$.asObservable());
    __publicField(this, "_isComposing$", new BehaviorSubject(false));
    __publicField(this, "isComposing$", this._isComposing$.asObservable());
    __publicField(this, "_inputOffset$", new BehaviorSubject({ start: 0, end: 0 }));
    __publicField(this, "inputOffset$", this._inputOffset$.asObservable());
    __publicField(this, "filterKeyword$");
    __publicField(this, "_menuSelectedCallbacks", /* @__PURE__ */ new Set());
    __publicField(this, "_inputPlaceholderRenderRoot", null);
    this.disposeWithMe(this._editPopup$);
    const getBodySlice = (start, end) => {
      var _a, _b;
      return (_b = (_a = this._univerInstanceService.getCurrentUnitOfType(1 /* UNIVER_DOC */)) == null ? void 0 : _a.getBody()) == null ? void 0 : _b.dataStream.slice(start, end);
    };
    let lastFilterKeyword = "";
    this.filterKeyword$ = this._inputOffset$.pipe(
      map((offset) => {
        var _a;
        const slice = getBodySlice(offset.start, offset.end);
        return (_a = slice == null ? void 0 : slice.slice(1)) != null ? _a : "";
      }),
      distinctUntilChanged(),
      tap((filterKeyword) => {
        lastFilterKeyword = filterKeyword;
      })
    );
    this.disposeWithMe(combineLatest([
      this.filterKeyword$.pipe(tap((filterKeyword) => {
        var _a, _b, _c;
        if (filterKeyword.length > 0) {
          (_b = (_a = this._inputPlaceholderRenderRoot) == null ? void 0 : _a.unmount) == null ? void 0 : _b.dispose();
        } else {
          (_c = this._inputPlaceholderRenderRoot) == null ? void 0 : _c.mount();
        }
      })),
      this.isComposing$.pipe(tap((isComposing) => {
        var _a, _b, _c;
        if (isComposing) {
          (_b = (_a = this._inputPlaceholderRenderRoot) == null ? void 0 : _a.unmount) == null ? void 0 : _b.dispose();
        } else {
          lastFilterKeyword.length <= 0 && ((_c = this._inputPlaceholderRenderRoot) == null ? void 0 : _c.mount());
        }
      })),
      this.editPopup$.pipe(tap((popup) => {
        var _a, _b;
        if (!popup) {
          (_b = (_a = this._inputPlaceholderRenderRoot) == null ? void 0 : _a.unmount) == null ? void 0 : _b.dispose();
          this._inputPlaceholderRenderRoot = null;
        }
      }))
    ]).subscribe());
  }
  get popups() {
    return Array.from(this._popups);
  }
  get editPopup() {
    return this._editPopup$.value;
  }
  get isComposing() {
    return this._isComposing$.value;
  }
  setIsComposing(isComposing) {
    this._isComposing$.next(isComposing);
  }
  get inputOffset() {
    return this._inputOffset$.value;
  }
  setInputOffset(offset) {
    this._inputOffset$.next(offset);
  }
  getDocEventManagerService(unitId) {
    var _a;
    return (_a = this._renderManagerService.getRenderById(unitId)) == null ? void 0 : _a.with(DocEventManagerService);
  }
  resolvePopup(keyword) {
    return Array.from(this._popups).find((popup) => popup.keyword === keyword);
  }
  registerPopup(popup) {
    this._popups.add(popup);
    return () => {
      this._popups.delete(popup);
    };
  }
  _createInputPlaceholderRenderRoot(mount) {
    const renderRoot = {
      isMounted: false,
      mount() {
        if (this.isMounted) {
          return;
        }
        this.isMounted = true;
        const unmount = mount();
        this.unmount = {
          dispose: () => {
            unmount.dispose();
            this.isMounted = false;
          }
        };
      }
    };
    return renderRoot;
  }
  _getParagraphBound(unitId, index) {
    var _a, _b, _c;
    const currentDoc = this._univerInstanceService.getUnit(unitId);
    const paragraph = (_b = (_a = currentDoc == null ? void 0 : currentDoc.getBody()) == null ? void 0 : _a.paragraphs) == null ? void 0 : _b.find((p) => p.startIndex > index);
    if (!paragraph) {
      return null;
    }
    const docEventManagerService = this.getDocEventManagerService(unitId);
    return (_c = docEventManagerService == null ? void 0 : docEventManagerService.findParagraphBoundByIndex(paragraph.startIndex)) != null ? _c : null;
  }
  _getKeywordPlaceholderAnchorRect(document2, skeleton, activeRange, fallbackRect) {
    const startPosition = skeleton.findNodePositionByCharIndex(activeRange.startOffset, true, activeRange.segmentId, activeRange.segmentPage);
    if (!startPosition) {
      return fallbackRect;
    }
    const documentOffsetConfig = document2.getOffsetConfig();
    const convertor = new NodePositionConvertToCursor(documentOffsetConfig, skeleton);
    const { contentBoxPointGroup } = convertor.getRangePointData(startPosition, startPosition);
    if (contentBoxPointGroup.length === 0) {
      return fallbackRect;
    }
    const anchor = getAnchorBounding(contentBoxPointGroup);
    const left = anchor.left + documentOffsetConfig.docsLeft;
    const top = anchor.top + documentOffsetConfig.docsTop;
    return {
      left,
      right: left,
      top,
      bottom: top + anchor.height
    };
  }
  _getKeywordPlaceholderExtraProps(curGlyph) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    return {
      fontSize: (_a = curGlyph.ts) == null ? void 0 : _a.fs,
      fontString: (_b = curGlyph.fontStyle) == null ? void 0 : _b.fontString,
      fontFamily: (_f = (_e = (_c = curGlyph.fontStyle) == null ? void 0 : _c.fontFamily) != null ? _e : (_d = curGlyph.ts) == null ? void 0 : _d.ff) != null ? _f : void 0,
      fontStyle: ((_g = curGlyph.ts) == null ? void 0 : _g.it) ? "italic" : "normal",
      fontWeight: ((_h = curGlyph.ts) == null ? void 0 : _h.bl) ? "bold" : "normal",
      ascent: (_i = curGlyph.bBox) == null ? void 0 : _i.ba,
      contentHeight: ((_k = (_j = curGlyph.bBox) == null ? void 0 : _j.ba) != null ? _k : 0) + ((_m = (_l = curGlyph.bBox) == null ? void 0 : _l.bd) != null ? _m : 0) || void 0
    };
  }
  _mountInputPlaceholder(unitId, fallbackRect) {
    const currentRender = this._renderManagerService.getRenderById(unitId);
    const docSkeletonManagerService = currentRender == null ? void 0 : currentRender.with(DocSkeletonManagerService);
    const activeRange = this._docSelectionManagerService.getActiveTextRange();
    if (!currentRender || !docSkeletonManagerService || !activeRange) {
      return noopDisposable;
    }
    const skeleton = docSkeletonManagerService.getSkeleton();
    const curGlyph = skeleton.findNodeByCharIndex(activeRange.startOffset, activeRange.segmentId, activeRange.segmentPage);
    const isEmptyLine = (curGlyph == null ? void 0 : curGlyph.content) === "\r";
    if (!isEmptyLine || !curGlyph) {
      return noopDisposable;
    }
    const document2 = currentRender.mainComponent;
    const placeholderAnchorRect = this._getKeywordPlaceholderAnchorRect(document2, skeleton, activeRange, fallbackRect);
    const extraProps = this._getKeywordPlaceholderExtraProps(curGlyph);
    const disposable = this._docCanvasPopupManagerService.attachPopupToRect(
      placeholderAnchorRect,
      {
        componentKey: KeywordInputPlaceholder.componentKey,
        extraProps,
        onClickOutside: () => {
          disposable.dispose();
        },
        direction: "horizontal"
      },
      unitId
    );
    return disposable;
  }
  showPopup(options) {
    const { popup, index, unitId } = options;
    this.closePopup();
    const paragraphBound = this._getParagraphBound(unitId, index);
    if (!paragraphBound) {
      return;
    }
    this._inputPlaceholderRenderRoot = this._createInputPlaceholderRenderRoot(() => this._mountInputPlaceholder(unitId, paragraphBound.firstLine));
    this._inputPlaceholderRenderRoot.mount();
    const disposable = this._docCanvasPopupManagerService.attachPopupToRect(
      paragraphBound.firstLine,
      {
        componentKey: QuickInsertPopup.componentKey,
        onClickOutside: () => {
          this.closePopup();
        },
        direction: "bottom"
      },
      unitId
    );
    this._editPopup$.next({ disposable, popup, anchor: index, unitId });
  }
  closePopup() {
    if (this.editPopup) {
      this.editPopup.disposable.dispose();
      this._editPopup$.next(null);
    }
  }
  onMenuSelected(callback) {
    this._menuSelectedCallbacks.add(callback);
    return () => {
      this._menuSelectedCallbacks.delete(callback);
    };
  }
  emitMenuSelected(menu) {
    const { start, end } = this.inputOffset;
    this._commandService.syncExecuteCommand(DeleteSearchKeyCommand.id, {
      start,
      end
    });
    setTimeout(() => {
      this._menuSelectedCallbacks.forEach((callback) => callback(menu));
    }, 0);
  }
};
DocQuickInsertPopupService = __decorateClass([
  __decorateParam(0, Inject(DocCanvasPopManagerService)),
  __decorateParam(1, Inject(IUniverInstanceService)),
  __decorateParam(2, Inject(ICommandService)),
  __decorateParam(3, Inject(IRenderManagerService)),
  __decorateParam(4, Inject(DocSelectionManagerService))
], DocQuickInsertPopupService);

// ../packages/docs-quick-insert-ui/src/commands/operations/quick-insert-popup.operation.ts
var ShowQuickInsertPopupOperation = {
  type: 1 /* OPERATION */,
  id: "doc.operation.show-quick-insert-popup",
  handler(accessor, params) {
    const docQuickInsertPopupService = accessor.get(DocQuickInsertPopupService);
    if (!params) {
      return false;
    }
    docQuickInsertPopupService.showPopup(params);
    return true;
  }
};
var CloseQuickInsertPopupOperation = {
  type: 1 /* OPERATION */,
  id: "doc.operation.close-quick-insert-popup",
  handler(accessor) {
    const docQuickInsertPopupService = accessor.get(DocQuickInsertPopupService);
    docQuickInsertPopupService.closePopup();
    return true;
  }
};

// ../packages/docs-quick-insert-ui/src/menu/menu.ts
var textMenu = {
  id: "quick-insert.text.menu",
  title: "docs-quick-insert-ui.menu.text",
  icon: "TextIcon",
  keywords: ["text"]
};
var numberedListMenu = {
  id: OrderListCommand.id,
  title: "docs-quick-insert-ui.menu.numberedList",
  icon: "OrderIcon",
  keywords: ["numbered", "list", "ordered"]
};
var bulletedListMenu = {
  id: BulletListCommand.id,
  title: "docs-quick-insert-ui.menu.bulletedList",
  icon: "UnorderIcon",
  keywords: ["bulleted", "list", "unordered"]
};
var dividerMenu = {
  id: HorizontalLineCommand.id,
  title: "docs-quick-insert-ui.menu.divider",
  icon: "DividerIcon",
  keywords: ["divider", "line", "separate"]
};
var tableMenu = {
  id: DocCreateTableOperation.id,
  title: "docs-quick-insert-ui.menu.table",
  icon: "GridIcon",
  keywords: ["table", "grid", "spreadsheet"]
};
var imageMenu = {
  id: InsertDocImageCommand.id,
  title: "docs-quick-insert-ui.menu.image",
  icon: "AdditionAndSubtractionIcon",
  keywords: ["image", "picture", "photo"]
};
var builtInMenus = [
  {
    title: "docs-quick-insert-ui.group.basics",
    id: "quick.insert.group.basic" /* Basic */,
    children: [
      textMenu,
      numberedListMenu,
      bulletedListMenu,
      dividerMenu,
      tableMenu,
      imageMenu
    ]
  }
];
var builtInMenuCommandIds = /* @__PURE__ */ new Set([
  numberedListMenu.id,
  bulletedListMenu.id,
  dividerMenu.id,
  tableMenu.id,
  imageMenu.id
]);

// ../packages/docs-quick-insert-ui/src/controllers/doc-quick-insert-trigger.controller.ts
var DocQuickInsertTriggerController = class extends Disposable {
  constructor(_commandService, _textSelectionManagerService, _docQuickInsertPopupService, _shortcutService, _univerInstanceService) {
    super();
    __publicField(this, "_commandService", _commandService);
    __publicField(this, "_textSelectionManagerService", _textSelectionManagerService);
    __publicField(this, "_docQuickInsertPopupService", _docQuickInsertPopupService);
    __publicField(this, "_shortcutService", _shortcutService);
    __publicField(this, "_univerInstanceService", _univerInstanceService);
    this.disposeWithMe(this._shortcutService.registerShortcut({
      id: CloseQuickInsertPopupOperation.id,
      binding: 27 /* ESC */,
      preconditions: () => Boolean(this._docQuickInsertPopupService.editPopup),
      priority: 1e3
    }));
    this._initTrigger();
    this._initMenuHandler();
  }
  // eslint-disable-next-line max-lines-per-function
  _initTrigger() {
    this.disposeWithMe(
      // eslint-disable-next-line complexity, max-lines-per-function
      this._commandService.onCommandExecuted((commandInfo) => {
        var _a, _b, _c;
        const { _docQuickInsertPopupService, _textSelectionManagerService, _commandService } = this;
        const documentDataModel = this._univerInstanceService.getCurrentUnitOfType(1 /* UNIVER_DOC */);
        if (documentDataModel == null ? void 0 : documentDataModel.getDisabled()) {
          return;
        }
        if (commandInfo.id === InsertTextCommand.id) {
          const params = commandInfo.params;
          if (_docQuickInsertPopupService.editPopup) {
            _docQuickInsertPopupService.setInputOffset({
              start: _docQuickInsertPopupService.inputOffset.start,
              end: params.range.endOffset + 1
            });
            return;
          }
          const activeRange = _textSelectionManagerService.getActiveTextRange();
          if (!activeRange) {
            return;
          }
          const popup = _docQuickInsertPopupService.resolvePopup(params.body.dataStream);
          if (!popup) {
            return;
          }
          const available = popup.preconditions ? popup.preconditions(params) : true;
          if (!available) {
            return;
          }
          _docQuickInsertPopupService.setInputOffset({ start: activeRange.startOffset - 1, end: activeRange.startOffset });
          setTimeout(() => {
            _commandService.executeCommand(ShowQuickInsertPopupOperation.id, {
              index: activeRange.startOffset - 1,
              unitId: params.unitId,
              popup
            });
          }, 100);
        }
        if (commandInfo.id === IMEInputCommand.id) {
          const params = commandInfo.params;
          if (!_docQuickInsertPopupService.isComposing && params.isCompositionStart) {
            _docQuickInsertPopupService.setIsComposing(true);
          }
          if (_docQuickInsertPopupService.isComposing && params.isCompositionEnd) {
            _docQuickInsertPopupService.setIsComposing(false);
          }
        }
        if (commandInfo.id === RichTextEditingMutation.id) {
          const params = commandInfo.params;
          if (params.isCompositionEnd) {
            const endOffset = (_b = (_a = params.textRanges) == null ? void 0 : _a[0]) == null ? void 0 : _b.endOffset;
            if (endOffset) {
              _docQuickInsertPopupService.setInputOffset({ start: _docQuickInsertPopupService.inputOffset.start, end: endOffset });
            }
          }
        }
        if (commandInfo.id === DeleteTextCommand.id) {
          const params = commandInfo.params;
          if (_docQuickInsertPopupService.editPopup && params.direction === 0 /* LEFT */) {
            const len = (_c = params.len) != null ? _c : 0;
            _docQuickInsertPopupService.setInputOffset({ start: _docQuickInsertPopupService.inputOffset.start, end: params.range.endOffset - len });
          }
        }
        if (commandInfo.id === MoveCursorOperation.id) {
          const params = commandInfo.params;
          if (params.direction === 3 /* LEFT */ || params.direction === 1 /* RIGHT */) {
            _docQuickInsertPopupService.editPopup && _commandService.executeCommand(CloseQuickInsertPopupOperation.id);
          }
        }
        if (commandInfo.id === DeleteLeftCommand.id) {
          const activeRange = _textSelectionManagerService.getActiveTextRange();
          if (!_docQuickInsertPopupService.editPopup || !activeRange) {
            return;
          }
          if (activeRange.endOffset <= _docQuickInsertPopupService.editPopup.anchor) {
            _commandService.executeCommand(CloseQuickInsertPopupOperation.id);
          }
        }
      })
    );
  }
  _initMenuHandler() {
    this.disposeWithMe(this._docQuickInsertPopupService.onMenuSelected((menu) => {
      if (menu.id === textMenu.id) {
        return;
      }
      if (builtInMenuCommandIds.has(menu.id)) {
        this._commandService.executeCommand(menu.id);
      }
    }));
  }
};
DocQuickInsertTriggerController = __decorateClass([
  __decorateParam(0, ICommandService),
  __decorateParam(1, Inject(DocSelectionManagerService)),
  __decorateParam(2, Inject(DocQuickInsertPopupService)),
  __decorateParam(3, Inject(IShortcutService)),
  __decorateParam(4, Inject(IUniverInstanceService))
], DocQuickInsertTriggerController);

// ../packages/docs-quick-insert-ui/src/controllers/ui.controller.ts
var DocQuickInsertUIController = class extends Disposable {
  constructor(_commandService, _docQuickInsertPopupService) {
    super();
    __publicField(this, "_commandService", _commandService);
    __publicField(this, "_docQuickInsertPopupService", _docQuickInsertPopupService);
    this._initCommands();
    this._initComponents();
    this._initMenus();
  }
  _initCommands() {
    [
      DeleteSearchKeyCommand,
      ShowQuickInsertPopupOperation,
      CloseQuickInsertPopupOperation
    ].forEach((operation) => {
      this.disposeWithMe(this._commandService.registerCommand(operation));
    });
  }
  _initComponents() {
    const popups = [
      {
        keyword: "/",
        menus$: of(builtInMenus),
        // only show when the cursor is at the beginning of a line
        preconditions: (params) => {
          var _a;
          return ((_a = params.range.startNodePosition) == null ? void 0 : _a.glyph) === 0;
        }
      }
    ];
    popups.forEach((popup) => {
      this.disposeWithMe(this._docQuickInsertPopupService.registerPopup(popup));
    });
  }
  _initMenus() {
  }
};
DocQuickInsertUIController = __decorateClass([
  __decorateParam(0, ICommandService),
  __decorateParam(1, Inject(DocQuickInsertPopupService))
], DocQuickInsertUIController);

// ../packages/docs-quick-insert-ui/package.json
var package_default = {
  name: "@univerjs/docs-quick-insert-ui",
  version: "0.25.0",
  private: false,
  description: "Quick insert UI integration for Univer Docs.",
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
    "quick-insert",
    "insert",
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
    "@univerjs/docs-drawing": "workspace:*",
    "@univerjs/docs-drawing-ui": "workspace:*",
    "@univerjs/docs-ui": "workspace:*",
    "@univerjs/drawing": "workspace:*",
    "@univerjs/drawing-ui": "workspace:*",
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

// ../packages/docs-quick-insert-ui/src/config/config.ts
var DOCS_QUICK_INSERT_UI_PLUGIN_CONFIG_KEY = "docs-quick-insert-ui.config";
var configSymbol = Symbol(DOCS_QUICK_INSERT_UI_PLUGIN_CONFIG_KEY);
var defaultPluginConfig = {};

// ../packages/docs-quick-insert-ui/src/views/QuickInsertButton.tsx
var import_react4 = __toESM(require_react());

// ../packages/docs-quick-insert-ui/src/menu/doc-quick-insert-menu.controller.ts
var DocQuickInsertMenuController = class extends Disposable {
  constructor(_context, _docEventManagerService, _docQuickInsertPopupService, _docCanvasPopManagerService) {
    super();
    __publicField(this, "_context", _context);
    __publicField(this, "_docEventManagerService", _docEventManagerService);
    __publicField(this, "_docQuickInsertPopupService", _docQuickInsertPopupService);
    __publicField(this, "_docCanvasPopManagerService", _docCanvasPopManagerService);
    __publicField(this, "_popup$", new BehaviorSubject(null));
    __publicField(this, "popup$", this._popup$.asObservable());
    this._init();
  }
  get popup() {
    return this._popup$.value;
  }
  _init() {
    this.disposeWithMe(combineLatest([this._docEventManagerService.hoverParagraphLeftRealTime$, this._docEventManagerService.hoverParagraphRealTime$]).subscribe(([left, paragraph]) => {
      var _a;
      const p = left != null ? left : paragraph;
      const isDisabled = this._context.unit.getDisabled();
      if (!p || isDisabled) {
        this._hideMenu(true);
        return;
      }
      if (p.paragraphStart === p.paragraphEnd) {
        if (this._docQuickInsertPopupService.editPopup || p.startIndex === ((_a = this.popup) == null ? void 0 : _a.startIndex)) return;
        this._hideMenu(true);
        const disposable = this._docCanvasPopManagerService.attachPopupToRect(p.firstLine, {
          componentKey: QuickInsertButtonComponentKey,
          direction: "left-center"
        }, this._context.unit.getUnitId());
        this._popup$.next({
          startIndex: p.startIndex,
          disposable
        });
      } else {
        this._hideMenu(true);
      }
    }));
  }
  _hideMenu(force) {
    if (this._docQuickInsertPopupService.editPopup) return;
    if (this.popup && (force || this.popup.disposable.canDispose())) {
      this.popup.disposable.dispose();
      this._popup$.next(null);
    }
  }
};
DocQuickInsertMenuController = __decorateClass([
  __decorateParam(1, Inject(DocEventManagerService)),
  __decorateParam(2, Inject(DocQuickInsertPopupService)),
  __decorateParam(3, Inject(DocCanvasPopManagerService))
], DocQuickInsertMenuController);

// ../packages/docs-quick-insert-ui/src/views/QuickInsertButton.tsx
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
var QuickInsertButtonComponentKey = "doc.quick-insert.button";
var QuickInsertButton = ({ className = "" }) => {
  const docQuickInsertPopupService = useDependency(DocQuickInsertPopupService);
  const univerInstanceService = useDependency(IUniverInstanceService);
  const renderManagerService = useDependency(IRenderManagerService);
  const currentDoc = useObservable((0, import_react4.useMemo)(() => univerInstanceService.getCurrentTypeOfUnit$(1 /* UNIVER_DOC */), [univerInstanceService]));
  const currentUnit = currentDoc && renderManagerService.getRenderById(currentDoc.getUnitId());
  const docQuickInsertMenuController = currentUnit == null ? void 0 : currentUnit.with(DocQuickInsertMenuController);
  const layoutService = useDependency(ILayoutService);
  const docSelectionManagerService = useDependency(DocSelectionManagerService);
  const editPopup = useObservable(docQuickInsertPopupService.editPopup$);
  const onClick = useEvent(() => {
    var _a;
    const p = docQuickInsertMenuController == null ? void 0 : docQuickInsertMenuController.popup;
    if (!p) {
      return;
    }
    const allPopups = docQuickInsertPopupService.popups;
    const popup = {
      keyword: "",
      menus$: combineLatest(allPopups.map((p2) => p2.menus$)).pipe(
        map((menusCollection) => menusCollection.flat())
      )
    };
    docSelectionManagerService.replaceDocRanges([{
      startOffset: p.startIndex,
      endOffset: p.startIndex
    }]);
    docQuickInsertPopupService.setInputOffset({ start: p.startIndex - 1, end: p.startIndex - 1 });
    docQuickInsertPopupService.showPopup({
      popup,
      index: p.startIndex - 1,
      unitId: (_a = currentDoc == null ? void 0 : currentDoc.getUnitId()) != null ? _a : ""
    });
    setTimeout(() => {
      layoutService.focus();
    });
  });
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    "div",
    {
      className: clsx(`univer-mr-1 univer-flex univer-cursor-pointer univer-items-center univer-gap-2.5 univer-rounded-full univer-p-1.5 univer-shadow-sm hover:univer-bg-gray-100 dark:!univer-text-gray-200 dark:hover:!univer-bg-gray-700`, borderClassName, {
        "univer-bg-gray-100 dark:!univer-bg-gray-700": editPopup,
        "univer-bg-white dark:!univer-bg-gray-900": !editPopup
      }, className),
      role: "button",
      tabIndex: 0,
      onClick,
      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        IncreaseIcon,
        {
          className: `univer-text-gray-800 dark:!univer-text-gray-200`
        }
      )
    }
  );
};
QuickInsertButton.componentKey = QuickInsertButtonComponentKey;

// ../packages/docs-quick-insert-ui/src/controllers/components.controller.ts
var ComponentsController = class extends Disposable {
  constructor(_componentManager, _iconManager) {
    super();
    __publicField(this, "_componentManager", _componentManager);
    __publicField(this, "_iconManager", _iconManager);
    this._registerIcons();
    this._registerComponents();
  }
  _registerIcons() {
    this.disposeWithMe(this._iconManager.register({
      DividerIcon,
      TextIcon
    }));
  }
  _registerComponents() {
    [
      [QuickInsertPopup.componentKey, QuickInsertPopup],
      [KeywordInputPlaceholder.componentKey, KeywordInputPlaceholder],
      [QuickInsertPlaceholder.componentKey, QuickInsertPlaceholder],
      [QuickInsertButton.componentKey, QuickInsertButton]
    ].forEach(([key, comp]) => {
      if (key) {
        this.disposeWithMe(this._componentManager.register(key, comp));
      }
    });
  }
};
ComponentsController = __decorateClass([
  __decorateParam(0, Inject(ComponentManager)),
  __decorateParam(1, Inject(IconManager))
], ComponentsController);

// ../packages/docs-quick-insert-ui/src/plugin.ts
var UniverDocsQuickInsertUIPlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig, _injector, _renderManagerSrv, _configService) {
    super();
    __publicField(this, "_config", _config);
    __publicField(this, "_injector", _injector);
    __publicField(this, "_renderManagerSrv", _renderManagerSrv);
    __publicField(this, "_configService", _configService);
    const { menu, ...rest } = merge_default(
      {},
      defaultPluginConfig,
      this._config
    );
    if (menu) {
      this._configService.setConfig("menu", menu, { merge: true });
    }
    this._configService.setConfig(DOCS_QUICK_INSERT_UI_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    this._injector.add([ComponentsController]);
    this._injector.get(ComponentsController);
    const dependencies = [
      [DocQuickInsertUIController],
      [DocQuickInsertTriggerController],
      [DocQuickInsertPopupService]
    ];
    dependencies.forEach((dependency) => this._injector.add(dependency));
    this._injector.get(DocQuickInsertUIController);
  }
  onRendered() {
    this._injector.get(DocQuickInsertTriggerController);
    this._injector.get(DocQuickInsertPopupService);
    [
      [DocQuickInsertMenuController]
    ].forEach((m) => {
      this._renderManagerSrv.registerRenderModule(1 /* UNIVER_DOC */, m);
    });
  }
};
__publicField(UniverDocsQuickInsertUIPlugin, "type", 1 /* UNIVER_DOC */);
__publicField(UniverDocsQuickInsertUIPlugin, "pluginName", "DOC_QUICK_INSERT_UI_PLUGIN");
__publicField(UniverDocsQuickInsertUIPlugin, "packageName", package_default.name);
__publicField(UniverDocsQuickInsertUIPlugin, "version", package_default.version);
UniverDocsQuickInsertUIPlugin = __decorateClass([
  DependentOn(UniverDrawingUIPlugin, UniverDrawingPlugin, UniverDocsDrawingUIPlugin, UniverDocsDrawingPlugin, UniverUIPlugin),
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, Inject(IRenderManagerService)),
  __decorateParam(3, IConfigService)
], UniverDocsQuickInsertUIPlugin);

// src/docs/main.ts
var IS_E2E = false;
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
  ribbonType: "classic"
});
univer.registerPlugin(UniverDocsPlugin);
univer.registerPlugin(UniverDocsUIPlugin, {
  container: "univerdoc"
});
univer.registerPlugin(UniverDocsDrawingUIPlugin);
univer.registerPlugin(UniverDocsThreadCommentUIPlugin);
univer.registerPlugin(UniverDocsHyperLinkUIPlugin);
univer.registerPlugin(UniverDocsMentionUIPlugin);
univer.registerPlugin(UniverDocsQuickInsertUIPlugin);
univer.registerPlugin(UniverWatermarkPlugin);
if (!IS_E2E) {
  univer.createUnit(1 /* UNIVER_DOC */, DEFAULT_DOCUMENT_DATA_SIMPLE);
  univer.registerPlugin(UniverDebuggerPlugin, {
    fabEntryUnitType: 1 /* UNIVER_DOC */,
    localeLoader: loadDebuggerLocale
  });
} else {
  univer.registerPlugin(UniverDebuggerPlugin, {
    fab: false,
    fabEntryUnitType: 1 /* UNIVER_DOC */,
    localeLoader: loadDebuggerLocale,
    performanceMonitor: {
      enabled: false
    }
  });
}
window.univer = univer;
var injector = univer.__getInjector();
var userManagerService = injector.get(UserManagerService);
var mockUser = {
  userID: "Owner_qxVnhPbQ",
  name: "Owner",
  avatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAInSURBVHgBtZU9TxtBEIbfWRzFSIdkikhBSqRQkJqkCKTCFkqVInSUSaT0wC8w/gXxD4gU2nRJkXQWhAZowDUUWKIwEgWWbEEB3mVmx3dn4DA2nB/ppNuPeWd29mMIPXDr+RxwtgRHeW6+guNPRxogqnL7Dwz9psJ27S4NShaeZTH3kwXy6I81dlRKcmRui88swdq9AcSFL7Buz1Vmlns64MiLsCjzwnIYHLH57tbfFbs7KRaXyEU8FVZofqccOfA5l7Q8LPIkGrwnb2RPNEXWFVMUF3L+kDCk0btDDAMzOm5YfAHDwp4tG74wnzAsiOYMnJ3GoDybA7IT98/jm5+JNnfiIzAS6LlqHQBN/i6b2t/cV1Hh6BfwYlHnHP4AXi5q/8kmMMpOs8+BixZw/Fd6xUEHEbnkgclvQP2fGp7uShRKnQ3G32rkjV1th8JhIGG7tR/JyjGteSOZELwGMmNqIIigRCLRh2OZIE6BjItdd7pCW6Uhm1zzkUtungSxwEUzNpQ+GQumtH1ej1MqgmNT6vwmhCq5yuwq56EYTbgeQUz3yvrpV1b4ok3nYJ+eYhgYmjRUqErx2EDq0Fr8FhG++iqVGqxlUJI/70Ar0UgJaWHj6hYVHJrfKssAHot1JfqwE9WVWzXZVd5z2Ws/4PnmtEjkXeKJDvxUecLbWOXH/DP6QQ4J72NS0adedp1aseBfXP8odlZFfPvBF7SN/8hky1TYuPOAXAEipMx15u5ToAAAAABJRU5ErkJggg==",
  anonymous: false,
  canBindAnonymous: false
};
userManagerService.setCurrentUser(mockUser);
window.univerAPI = FUniver.newAPI(univer);
