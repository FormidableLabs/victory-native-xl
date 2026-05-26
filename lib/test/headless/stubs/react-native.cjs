module.exports = {
  StyleSheet: {
    create: (styles) => styles,
    hairlineWidth: 1,
    absoluteFillObject: {},
  },
  Platform: {
    OS: "web",
  },
  PixelRatio: {
    get: () => 1,
  },
  Image: {
    resolveAssetSource: () => ({ uri: "" }),
  },
  findNodeHandle: () => null,
  View: ({ children }) => children,
  TurboModuleRegistry: {
    getEnforcing: () => ({}),
  },
};
