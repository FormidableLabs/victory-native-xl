import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const stubsDir = path.resolve(__dirname, "test/headless/stubs");
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@shopify/react-native-skia": path.join(
        stubsDir,
        "react-native-skia.cjs",
      ),
      "react-native": path.join(stubsDir, "react-native.ts"),
      "react-native-reanimated": path.join(
        stubsDir,
        "react-native-reanimated.ts",
      ),
      "react-native-gesture-handler": path.join(
        stubsDir,
        "react-native-gesture-handler.ts",
      ),
      "react-native-gesture-handler/lib/typescript/handlers/gestureHandlerCommon":
        path.join(stubsDir, "gestureHandlerCommon.ts"),
      "react-native-gesture-handler/lib/typescript/handlers/PanGestureHandler":
        path.join(stubsDir, "PanGestureHandler.ts"),
      "victory-native": path.resolve(__dirname, "src/index.ts"),
    },
  },
  test: {
    include: ["test/headless/**/*.test.ts"],
    environment: "node",
    setupFiles: ["test/headless/setup.ts"],
    fileParallelism: false,
    server: {
      deps: {
        external: ["@shopify/react-native-skia", "canvaskit-wasm"],
      },
    },
  },
});
