import { describe, expect, it } from "vitest";
import type { PointsArray } from "../../types";
import { getBarWidth } from "./getBarWidth";

const chartBounds = {
  left: 20,
  right: 220,
};

const points = Array.from({ length: 5 }, (_, i) => ({
  x: i * 50,
  xValue: i,
  y: i * 10,
  yValue: i,
})) satisfies PointsArray;

describe("getBarWidth", () => {
  it("uses a custom bar width when provided", () => {
    expect(
      getBarWidth({
        points,
        chartBounds,
        innerPadding: 0.25,
        customBarWidth: 16,
      }),
    ).toBe(16);
  });

  it("uses an explicit zero custom bar width", () => {
    expect(
      getBarWidth({
        points,
        chartBounds,
        innerPadding: 0.25,
        customBarWidth: 0,
      }),
    ).toBe(0);
  });

  it("uses the current multi-point denominator contract", () => {
    expect(
      getBarWidth({
        points,
        chartBounds,
        innerPadding: 0.25,
      }),
    ).toBe(37.5);
  });

  it("avoids dividing by zero for a single point", () => {
    expect(
      getBarWidth({
        points: points.slice(0, 1),
        chartBounds,
        innerPadding: 0.25,
      }),
    ).toBe(150);
  });

  it("returns zero for empty points", () => {
    expect(
      getBarWidth({
        points: [],
        chartBounds,
        innerPadding: 0.25,
      }),
    ).toBe(0);
  });

  it("returns zero for empty stacked bar points", () => {
    expect(
      getBarWidth({
        points: [[]],
        chartBounds,
        innerPadding: 0.25,
      }),
    ).toBe(0);
  });

  it("uses barCount when provided", () => {
    expect(
      getBarWidth({
        points,
        chartBounds,
        innerPadding: 0.25,
        barCount: 10,
      }),
    ).toBe(15);
  });

  it("ignores non-positive barCount values", () => {
    expect(
      getBarWidth({
        points,
        chartBounds,
        innerPadding: 0.25,
        barCount: 0,
      }),
    ).toBe(37.5);

    expect(
      getBarWidth({
        points,
        chartBounds,
        innerPadding: 0.25,
        barCount: -1,
      }),
    ).toBe(37.5);
  });

  it("uses barCount to keep dynamic subset widths stable", () => {
    const largeDataSet = Array.from({ length: 32 }, (_, i) => ({
      x: i * 10,
      xValue: i,
      y: i,
      yValue: i,
    })) satisfies PointsArray;

    const widthForTwoBars = getBarWidth({
      points: largeDataSet.slice(0, 2),
      chartBounds,
      innerPadding: 0.25,
      barCount: largeDataSet.length,
    });
    const widthForAllBars = getBarWidth({
      points: largeDataSet,
      chartBounds,
      innerPadding: 0.25,
      barCount: largeDataSet.length,
    });

    expect(widthForTwoBars).toBe(widthForAllBars);
  });

  it("uses the first series length for stacked bars", () => {
    expect(
      getBarWidth({
        points: [points, points.slice(0, 3)],
        chartBounds,
        innerPadding: 0.25,
      }),
    ).toBe(37.5);
  });
});
