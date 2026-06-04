import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { compareGoldenPng } from "./utils/compareGoldenPng";
import {
  candlestickCartesianChart,
  candlestickCartesianSize,
} from "./fixtures/candlestickCartesianChart";
import { renderHeadlessToPng } from "./utils/renderHeadlessToPng";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const goldenPath = path.join(
  __dirname,
  "__golden__",
  "candlestick-cartesian.png",
);

describe("headless Candlestick", () => {
  it("matches the golden PNG", async () => {
    const png = await renderHeadlessToPng(
      candlestickCartesianChart,
      candlestickCartesianSize.width,
      candlestickCartesianSize.height,
    );

    compareGoldenPng(png, goldenPath);
    expect(png.length).toBeGreaterThan(0);
  });
});
