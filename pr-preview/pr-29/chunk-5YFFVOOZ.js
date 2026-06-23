import {
  FUniver
} from "./chunk-JRQIBFK2.js";
import {
  IAuthzIoService,
  IMentionIOService,
  IUndoRedoService,
  Univer
} from "./chunk-M6CFAGRR.js";

// ../presets/src/umd.ts
function createUniver(options) {
  const { presets, plugins, collaboration, override = [], ...univerOptions } = options;
  if (collaboration) {
    override.push([IUndoRedoService, null]);
    override.push([IAuthzIoService, null]);
    override.push([IMentionIOService, null]);
  }
  const univer = new Univer({
    logLevel: 2 /* WARN */,
    ...univerOptions,
    override
  });
  const pluginsMap = /* @__PURE__ */ new Map();
  presets == null ? void 0 : presets.forEach((preset) => {
    const realPreset = Array.isArray(preset) ? preset[0] : preset;
    const { plugins: plugins2 } = realPreset;
    plugins2.forEach((p) => {
      const [realPlugin, pluginConfig] = Array.isArray(p) ? [p[0], p[1]] : [p];
      if (pluginsMap.has(realPlugin.pluginName)) {
        pluginsMap.delete(realPlugin.pluginName);
      }
      pluginsMap.set(realPlugin.pluginName, { plugin: realPlugin, options: pluginConfig });
    });
  });
  plugins == null ? void 0 : plugins.forEach((plugin) => {
    const [realPlugin, pluginConfig] = Array.isArray(plugin) ? [plugin[0], plugin[1]] : [plugin];
    if (pluginsMap.has(realPlugin.pluginName)) {
      throw new Error(`Plugin ${realPlugin.pluginName} already registered by presets or other ways! Repeated registration may cause potential problems, please check your code.`);
    }
    pluginsMap.set(realPlugin.pluginName, { plugin: realPlugin, options: pluginConfig });
  });
  pluginsMap.forEach(({ plugin, options: options2 }) => {
    univer.registerPlugin(plugin, options2);
  });
  const univerAPI = FUniver.newAPI(univer);
  return {
    univer,
    univerAPI
  };
}

export {
  createUniver
};
