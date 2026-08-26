import { describe, expect, it } from "vitest";
import { getStackedBarSegments } from "./getStackedBarSegments";
import { getVerticalStackedBarRect } from "./getVerticalStackedBarRect";

const yScale = (value: number) => 100 - value * 5;

describe("getVerticalStackedBarRect", () => {
  it("converts positive stack segments into cumulative vertical rects", () => {
    const segments = getStackedBarSegments([
      [{ x: 80, xValue: "A", y: 80, yValue: 4 }],
      [{ x: 80, xValue: "A", y: 70, yValue: 6 }],
    ]);

    expect(
      getVerticalStackedBarRect({
        segment: segments[1]!,
        yScale,
        barWidth: 20,
      }),
    ).toEqual({
      x: 70,
      y: 50,
      width: 20,
      height: 30,
    });
  });

  it("preserves negative height direction for downstream corner handling", () => {
    const segments = getStackedBarSegments([
      [{ x: 80, xValue: "A", y: 115, yValue: -3 }],
      [{ x: 80, xValue: "A", y: 130, yValue: -2 }],
    ]);

    expect(
      getVerticalStackedBarRect({
        segment: segments[1]!,
        yScale,
        barWidth: 20,
      }),
    ).toEqual({
      x: 70,
      y: 125,
      width: 20,
      height: -10,
    });
  });

  it("returns null when scaled positions are non-finite", () => {
    const [segment] = getStackedBarSegments([
      [{ x: 80, xValue: "A", y: 90, yValue: 2 }],
    ]);

    expect(
      getVerticalStackedBarRect({
        segment: segment!,
        yScale: () => Number.NaN,
        barWidth: 20,
      }),
    ).toBeNull();
  });
});
