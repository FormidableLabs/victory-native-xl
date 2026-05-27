import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { compareGoldenPng } from "./utils/compareGoldenPng";
import {
  smokeCartesianChart,
  smokeCartesianSize,
} from "./fixtures/smokeCartesianChart";
import { renderHeadlessToPng } from "./utils/renderHeadlessToPng";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const goldenPath = path.join(__dirname, "__golden__", "cartesian-smoke.png");

describe("headless CartesianChart", () => {
  it("matches the golden PNG", async () => {
    const png = await renderHeadlessToPng(
      smokeCartesianChart,
      smokeCartesianSize.width,
      smokeCartesianSize.height,
    );

    compareGoldenPng(png, goldenPath);
    expect(png.length).toBeGreaterThan(0);
  });
});
