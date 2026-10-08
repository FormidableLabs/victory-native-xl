# Skia 3 / Gesture Handler 3 fork

This fork upgrades the upstream example and library to `react-native-skia` **3.3.0** and `react-native-gesture-handler` **3.3.0**. Upstream baseline: `de84ff1f3098a2072f8c52ac801ce08141fdb46a` (Victory Native 42.0.1). Fork package version: `42.0.1-skia3.0`.

The example uses Expo 57.0.27, React Native 0.86.3, Reanimated 4.5.1 and Worklets 0.10.1. Use a native development build; Expo Go does not contain Skia 3. Do not install scoped and unscoped Skia together. iOS minimum is 16.4 for this Expo example (Skia alone requires 15.1); Android configuration sets minimum API 26, with no Android verification claimed.

Legacy RNGH builder behavior is preserved using RNGH 3's exported `Legacy*` types. New hook gestures are not substituted into the existing public gesture contract. The chart-ref example uses Skia 3's synchronous snapshot API and releases the temporary image after encoding.

A Yarn patch backports the runtime-only changes from [Expo PR #51040](https://github.com/expo/expo/pull/51040) to `expo-modules-jsi@57.1.1` for Xcode 26.2 / Swift 6.2. It adapts the scheduler factories and pointer capture wrappers; upstream test changes are intentionally excluded. Yarn install applies the patch reproducibly.

```sh
corepack yarn install --immutable
corepack yarn typecheck
corepack yarn build
cd example
npx expo run:ios
```

Do not use `check:code` for this workflow: it includes unit tests. Existing test files are retained unchanged and excluded from the source-only type check under the task's no-unit-test policy. Their scoped-Skia imports were not migrated, so the upstream suites require a separately authorized test migration before future execution. Build and manual simulator evidence do not substitute for exhaustive library coverage.

See [upgrade verification](UPGRADE-VERIFICATION.md) for the observed example routes and limits.

---

[![Victory Native](https://oss.nearform.com/api/banner?badge=victory&text=victory+native&bg=9c2f1e)](https://commerce.nearform.com/open-source/victory-native/)

<div align="center">
  <strong>
    high-performance charts powered by D3, Skia, and Reanimated for React Native.
  </strong>

  <br />
  <br />

  <a href="https://npmjs.com/package/victory-native">
    <img alt="weekly downloads" src="https://img.shields.io/npm/dw/victory-native.svg">
  </a>
  <a href="https://npmjs.com/package/victory-native">
    <img alt="current version" src="https://img.shields.io/npm/v/victory-native.svg">
  </a>
  <a href="https://github.com/FormidableLabs/victory-native/actions">
    <img alt="build status" src="https://github.com/FormidableLabs/victory/actions/workflows/ci.yml/badge.svg">
  </a>

  <a href="https://github.com/FormidableLabs/victory-native-xl#maintenance-status">
    <img alt="Maintenance Status" src="https://img.shields.io/badge/maintenance-active-green.svg" />
  </a>
</div>

<p>&nbsp;</p>

<div align="center">

https://github.com/FormidableLabs/victory-native-xl/assets/12721310/20bada2d-9903-4fe1-9b5f-3b516c0d7428

</div>

## Installation

Start by installing the peer dependencies of `victory-native` – React Native Reanimated, Gesture Handler, and Skia:

```shell
yarn add react-native-reanimated react-native-gesture-handler react-native-skia
```

For Reanimated, you'll need to add `"react-native-worklets/plugin"` to your `plugins` list in your `babel.config.js` config file.

Then install `victory-native`:

```shell
yarn add victory-native
```

To get started and read more about the API, view the [docs here](https://formidable.com/open-source/victory-native).

## LICENSE

MIT

## Maintenance Status

**Active:** Nearform is actively working on this project, and we expect to continue for work for the foreseeable future. Bug reports, feature requests and pull requests are welcome.

[maintenance-image]: https://img.shields.io/badge/maintenance-active-green.svg
