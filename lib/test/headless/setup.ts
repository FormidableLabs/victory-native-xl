import Module, { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stubsDir = path.join(__dirname, "stubs");
const require = createRequire(import.meta.url);

type ResolveFilename = (
  request: string,
  parent: NodeModule | undefined,
  isMain: boolean,
  options: unknown,
) => string;

const mod = Module as typeof Module & {
  _resolveFilename: ResolveFilename;
};

const originalResolveFilename = mod._resolveFilename;

mod._resolveFilename = function resolveFilename(
  request,
  parent,
  isMain,
  options,
) {
  if (request === "react-native") {
    return path.join(stubsDir, "react-native.cjs");
  }

  return originalResolveFilename(request, parent, isMain, options);
} as ResolveFilename;

const canvaskitRoot = path.dirname(
  require.resolve("canvaskit-wasm/package.json"),
);

const { LoadSkiaWeb } =
  require("@shopify/react-native-skia/lib/commonjs/web/LoadSkiaWeb.js") as {
    LoadSkiaWeb: (opts: {
      locateFile: (file: string) => string;
    }) => Promise<void>;
  };
const { JsiSkApi } =
  require("@shopify/react-native-skia/lib/commonjs/skia/web/JsiSkia.js") as {
    JsiSkApi: (
      canvasKit: import("canvaskit-wasm").CanvasKit,
    ) => typeof globalThis.SkiaApi;
  };

await LoadSkiaWeb({
  locateFile: (file) => path.join(canvaskitRoot, "bin", "full", file),
});

global.SkiaApi = JsiSkApi(global.CanvasKit);
