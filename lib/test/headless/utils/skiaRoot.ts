import { createRequire } from "node:module";
import type { ReactNode } from "react";
import type { Skia } from "react-native-skia";

const require = createRequire(import.meta.url);

type SkiaRoot = {
  render: (element: ReactNode) => Promise<void>;
  unmount: () => Promise<unknown>;
};

/**
 * A root of Skia's own React renderer: what a `Canvas` renders its children
 * with.
 */
export const { SkiaSGRoot } =
  require("react-native-skia/lib/commonjs/sksg/Reconciler.js") as {
    SkiaSGRoot: new (skia: typeof Skia) => SkiaRoot;
  };
