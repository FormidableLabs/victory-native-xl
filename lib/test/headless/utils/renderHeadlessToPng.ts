import { createRequire } from "node:module";
import type { ReactElement } from "react";

const require = createRequire(import.meta.url);
const { drawOffscreen, makeOffscreenSurface } =
  require("@shopify/react-native-skia/lib/commonjs/headless/index.js") as {
    drawOffscreen: (
      surface: { dispose: () => void },
      element: ReactElement,
    ) => Promise<{ encodeToBytes: () => Uint8Array; dispose: () => void }>;
    makeOffscreenSurface: (
      width: number,
      height: number,
    ) => { dispose: () => void };
  };

export async function renderHeadlessToPng(
  element: ReactElement,
  width: number,
  height: number,
): Promise<Buffer> {
  const surface = makeOffscreenSurface(width, height);

  try {
    const image = await drawOffscreen(surface, element);

    try {
      return Buffer.from(image.encodeToBytes());
    } finally {
      image.dispose();
    }
  } finally {
    surface.dispose();
  }
}
