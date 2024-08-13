import '@expo/metro-runtime';
import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import { version } from 'canvaskit-wasm/package.json';

import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

// When used on the web, we need to load the CanvasKit WASM file before rendering content
// For simplicity, we are using a CDN to load the file, but it can be hosted on your own server as well
// See https://shopify.github.io/react-native-skia/docs/getting-started/web for more details
LoadSkiaWeb({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/canvaskit-wasm@${version}/bin/full/${file}`
}).then(async () => {
  renderRootComponent(App);
});
