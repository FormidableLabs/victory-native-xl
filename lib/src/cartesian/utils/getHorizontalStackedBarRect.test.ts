import { describe, expect, it } from "vitest";
import { getStackedBarSegments } from "./getStackedBarSegments";
import { getHorizontalStackedBarRect } from "./getHorizontalStackedBarRect";

const xScale = (value: number) => 100 + value * 5;

describe("getHorizontalStackedBarRect", () => {
  it("converts positive stack segments into cumulative horizontal rects", () => {
    const segments = getStackedBarSegments([
      [{ x: 120, xValue: "A", y: 80, yValue: 4 }],
      [{ x: 130, xValue: "A", y: 80, yValue: 6 }],
    ]);

    expect(
      getHorizontalStackedBarRect({
        segment: segments[1]!,
        xScale,
        barWidth: 20,
      }),
    ).toEqual({
      x: 120,
      y: 70,
      width: 30,
      height: 20,
    });
  });

  it("normalizes negative stack segments to positive rect widths", () => {
    const segments = getStackedBarSegments([
      [{ x: 85, xValue: "A", y: 80, yValue: -3 }],
      [{ x: 90, xValue: "A", y: 80, yValue: -2 }],
    ]);

    expect(
      getHorizontalStackedBarRect({
        segment: segments[1]!,
        xScale,
        barWidth: 20,
      }),
    ).toEqual({
      x: 75,
      y: 70,
      width: 10,
      height: 20,
    });
  });

  it("returns null when scaled positions are non-finite", () => {
    const [segment] = getStackedBarSegments([
      [{ x: 110, xValue: "A", y: 80, yValue: 2 }],
    ]);

    expect(
      getHorizontalStackedBarRect({
        segment: segment!,
        xScale: () => Number.NaN,
        barWidth: 20,
      }),
    ).toBeNull();
  });
});
