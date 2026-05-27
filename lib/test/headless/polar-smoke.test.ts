import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { compareGoldenPng } from "./utils/compareGoldenPng";
import { smokePolarChart, smokePolarSize } from "./fixtures/smokePolarChart";
import { renderHeadlessToPng } from "./utils/renderHeadlessToPng";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const goldenPath = path.join(__dirname, "__golden__", "polar-smoke.png");

describe("headless PolarChart", () => {
  it("matches the golden PNG", async () => {
    const png = await renderHeadlessToPng(
      smokePolarChart,
      smokePolarSize.width,
      smokePolarSize.height,
    );

    compareGoldenPng(png, goldenPath);
    expect(png.length).toBeGreaterThan(0);
  });
});
