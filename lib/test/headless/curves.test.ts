import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { compareGoldenPng } from "./utils/compareGoldenPng";
import {
  CURVE_TYPES,
  curveChart,
  curveChartSize,
} from "./fixtures/curveCartesianChart";
import { renderHeadlessToPng } from "./utils/renderHeadlessToPng";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const goldenPath = (name: string) =>
  path.join(__dirname, "__golden__", "curves", `${name}.png`);

describe("headless Line, Area, StackedArea and AreaRange", () => {
  it.each(CURVE_TYPES)(
    "matches the golden PNG for the %s curve",
    async (curveType) => {
      const png = await renderHeadlessToPng(
        curveChart(curveType),
        curveChartSize.width,
        curveChartSize.height,
      );

      compareGoldenPng(png, goldenPath(curveType));
      expect(png.length).toBeGreaterThan(0);
    },
  );
});
