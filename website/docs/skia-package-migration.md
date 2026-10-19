# Skia package migration

This major release moves Victory Native from `@shopify/react-native-skia` to **`react-native-skia` 2.x**. The chart components, hooks, and render arguments keep their existing APIs. Skia 3 and Gesture Handler 3 are a separate upgrade and are not supported by this release.

## Supported dependencies

| Dependency | Requirement |
| --- | --- |
| React | 19 or later |
| React Native | 0.78 or later, with the New Architecture |
| `react-native-skia` | 2.15.1 or later in the 2.x series |
| `react-native-reanimated` | 4.x |
| `react-native-worklets` | 0.7 or later, compatible with your Reanimated version |
| `react-native-gesture-handler` | 2.x |

These are minimum peer requirements, not a guarantee that every combination works. Use the [Reanimated compatibility table](https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/) to choose Reanimated and Worklets versions compatible with your React Native version. Reanimated 4 requires the New Architecture. If you need Reanimated 3 or the old architecture, stay on the previous Victory Native major and its scoped Skia dependency.

## 1. Replace the package

```sh
yarn remove @shopify/react-native-skia
yarn add react-native-skia@^2.15.1 react-native-reanimated@^4 react-native-worklets react-native-gesture-handler@^2
yarn add victory-native@latest
```

Use the explicit Skia 2.x range: an unversioned `react-native-skia` install selects the latest major, which this release does not support. Never install scoped and unscoped Skia together; both contain the same native module. Check that other libraries in your app have also migrated before removing scoped Skia.

## 2. Update imports and test configuration

```diff
-import { Circle, useFont, type SkFont } from "@shopify/react-native-skia";
+import { Circle, useFont, type SkFont } from "react-native-skia";
```

Update all references, including type imports, Jest/Vitest mocks, aliases, Jest environment/setup paths, and web or headless deep imports:

```diff
-import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
+import { LoadSkiaWeb } from "react-native-skia/lib/module/web";
```

Keep your existing CanvasKit initialization and use the CanvasKit version required by the installed Skia package. See the [Skia 2 web documentation](https://wcandillon.github.io/react-native-skia/v2/docs/getting-started/web/).

## 3. Configure Reanimated 4

For bare React Native, replace `react-native-reanimated/plugin` with `react-native-worklets/plugin` and keep it last:

```js
module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: ["react-native-worklets/plugin"],
};
```

Expo projects using `babel-preset-expo` have the Worklets plugin configured automatically. Remove any explicit old Reanimated plugin entry. Follow the [Reanimated 4 migration guide](https://docs.swmansion.com/react-native-reanimated/docs/guides/migration-from-3.x/) for other app-specific changes.

## 4. Rebuild and verify

Run `pod install` in your iOS project, then rebuild iOS and Android so the app includes the renamed native dependency. Restart Metro with its cache cleared. Expo projects should rebuild their native development build; Expo Go only works when its bundled native versions match your installed dependencies.

Check charts with fonts, gradients, animations, press/scrub state, pan/zoom, and chart snapshots. For web, verify CanvasKit loads before mounting charts. For headless rendering, update the package paths in your host setup and run your image-generation checks.

If you see duplicate native-module or autolinking errors, inspect your dependency tree for remaining `@shopify/react-native-skia` dependencies. Resolve those dependencies rather than installing both package names.
