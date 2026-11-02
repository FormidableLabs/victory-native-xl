const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Prefer the `react-native` export condition (e.g. resolve `victory-native` to
// its TypeScript source on web) so the example dev app bundles the library like
// it does on native, instead of the pre-built `dist` output.
config.resolver.unstable_conditionNames = [
  "react-native",
  "node",
  "require",
  "import",
  "default",
];

module.exports = config;
