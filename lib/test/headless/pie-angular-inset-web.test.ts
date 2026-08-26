import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import { describe, expect, it } from "vitest";
import {
  PIE_ANGULAR_INSET_COLORS,
  pieAngularInsetWebRegression,
  pieAngularInsetWebRegressionSize,
} from "./fixtures/pieAngularInsetWebRegression";
import { compareGoldenPng } from "./utils/compareGoldenPng";
import { renderHeadlessToPng } from "./utils/renderHeadlessToPng";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const goldenPath = path.join(
  __dirname,
  "__golden__",
  "pie-angular-inset-web.png",
);

const MINIMUM_SLICE_COLOR_PIXELS = 100;

function countColorPixels(png: PNG, color: string): number {
  const [red, green, blue] = color
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => Number.parseInt(channel, 16));

  let count = 0;
  for (let index = 0; index < png.data.length; index += 4) {
    if (
      png.data[index] === red &&
      png.data[index + 1] === green &&
      png.data[index + 2] === blue &&
      png.data[index + 3] === 255
    ) {
      count += 1;
    }
  }

  return count;
}

describe("Pie.SliceAngularInset on CanvasKit", () => {
  it("keeps narrow sibling slices visible", async () => {
    const pngBuffer = await renderHeadlessToPng(
      pieAngularInsetWebRegression,
      pieAngularInsetWebRegressionSize.width,
      pieAngularInsetWebRegressionSize.height,
    );

    compareGoldenPng(pngBuffer, goldenPath);

    const png = PNG.sync.read(pngBuffer);
    for (const color of PIE_ANGULAR_INSET_COLORS) {
      expect(countColorPixels(png, color)).toBeGreaterThan(
        MINIMUM_SLICE_COLOR_PIXELS,
      );
    }
  });
});
