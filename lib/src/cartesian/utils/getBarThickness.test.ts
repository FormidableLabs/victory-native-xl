import { describe, expect, it } from "vitest";
import type { PointsArray } from "../../types";
import { getBarThickness } from "./getBarThickness";

const points = Array.from({ length: 5 }, (_, i) => ({
  x: i * 50,
  xValue: i,
  y: i * 10,
  yValue: i,
})) satisfies PointsArray;

describe("getBarThickness", () => {
  it("uses a custom bar thickness when provided", () => {
    expect(
      getBarThickness({
        points,
        axisStart: 20,
        axisEnd: 220,
        innerPadding: 0.25,
        customBarThickness: 16,
      }),
    ).toBe(16);
  });

  it("uses an explicit zero custom bar thickness", () => {
    expect(
      getBarThickness({
        points,
        axisStart: 20,
        axisEnd: 220,
        innerPadding: 0.25,
        customBarThickness: 0,
      }),
    ).toBe(0);
  });

  it("uses the current multi-point denominator contract", () => {
    expect(
      getBarThickness({
        points,
        axisStart: 20,
        axisEnd: 220,
        innerPadding: 0.25,
      }),
    ).toBe(37.5);
  });

  it("uses barCount to keep dynamic subset thickness stable", () => {
    const largeDataSet = Array.from({ length: 32 }, (_, i) => ({
      x: i * 10,
      xValue: i,
      y: i,
      yValue: i,
    })) satisfies PointsArray;

    const thicknessForTwoBars = getBarThickness({
      points: largeDataSet.slice(0, 2),
      axisStart: 20,
      axisEnd: 220,
      innerPadding: 0.25,
      barCount: largeDataSet.length,
    });
    const thicknessForAllBars = getBarThickness({
      points: largeDataSet,
      axisStart: 20,
      axisEnd: 220,
      innerPadding: 0.25,
      barCount: largeDataSet.length,
    });

    expect(thicknessForTwoBars).toBe(thicknessForAllBars);
  });

  it("uses the first series length for stacked bars", () => {
    expect(
      getBarThickness({
        points: [points, points.slice(0, 3)],
        axisStart: 20,
        axisEnd: 220,
        innerPadding: 0.25,
      }),
    ).toBe(37.5);
  });

  it("returns zero when there are no points", () => {
    expect(
      getBarThickness({
        points: [],
        axisStart: 20,
        axisEnd: 220,
        innerPadding: 0.25,
      }),
    ).toBe(0);
  });

  it("returns zero when the first stacked series is empty", () => {
    expect(
      getBarThickness({
        points: [[], points],
        axisStart: 20,
        axisEnd: 220,
        innerPadding: 0.25,
      }),
    ).toBe(0);
  });

  it("ignores non-positive barCount values", () => {
    expect(
      getBarThickness({
        points,
        axisStart: 20,
        axisEnd: 220,
        innerPadding: 0.25,
        barCount: 0,
      }),
    ).toBe(37.5);
  });
});
