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

Requires React 19+, React Native 0.79+ with the New Architecture, Skia 2.x (2.15.1+), Reanimated 4.x (4.1.7+), Worklets 0.7+, and Gesture Handler 2 or 3. Choose compatible Reanimated and Worklets versions for your React Native version using the [Reanimated compatibility table](https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/).

```shell
yarn add react-native-reanimated@^4.1.7 react-native-worklets "react-native-gesture-handler@^2 || ^3" react-native-skia@^2.15.1
```

For a bare React Native app, add `"react-native-worklets/plugin"` last in the `plugins` list in `babel.config.js`. Expo's `babel-preset-expo` configures it automatically. Rebuild your native app after installing the dependencies.

Then install `victory-native`:

```shell
yarn add victory-native
```

To get started and read more about the API, view the [docs here](https://formidable.com/open-source/victory-native).

### Upgrading from the scoped Skia package

Remove `@shopify/react-native-skia`, install `react-native-skia@^2.15.1`, and update all Skia imports (including web/headless deep imports and test mocks) to `react-native-skia`. Do not install both packages: they contain the same native module. Reanimated 3 users must also migrate to Reanimated 4 and Worklets. Chart APIs are unchanged; Skia 3 is not supported by this release.

See the [migration guide](https://commerce.nearform.com/open-source/victory-native/docs/skia-package-migration) for the full upgrade steps, Babel configuration, and platform notes.

## LICENSE

MIT

## Maintenance Status

**Active:** Nearform is actively working on this project, and we expect to continue for work for the foreseeable future. Bug reports, feature requests and pull requests are welcome.

[maintenance-image]: https://img.shields.io/badge/maintenance-active-green.svg
