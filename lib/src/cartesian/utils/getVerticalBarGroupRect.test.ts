import { describe, expect, it } from "vitest";
import { getVerticalBarGroupRect } from "./getVerticalBarGroupRect";

const baseArgs = {
  baselineY: 100,
  barWidth: 10,
  groupWidth: 40,
  gapWidth: 5,
};

describe("getVerticalBarGroupRect", () => {
  it("places the first bar from the leading edge of the group", () => {
    expect(
      getVerticalBarGroupRect({
        ...baseArgs,
        point: { x: 80, xValue: "A", y: 40, yValue: 8 },
        barIndex: 0,
      }),
    ).toEqual({
      x: 60,
      y: 40,
      width: 10,
      height: 60,
    });
  });

  it("offsets later bars within the same group", () => {
    expect(
      getVerticalBarGroupRect({
        ...baseArgs,
        point: { x: 80, xValue: "A", y: 40, yValue: 8 },
        barIndex: 2,
      }),
    ).toEqual({
      x: 90,
      y: 40,
      width: 10,
      height: 60,
    });
  });

  it("preserves negative bar height direction for downstream corner handling", () => {
    expect(
      getVerticalBarGroupRect({
        ...baseArgs,
        point: { x: 80, xValue: "A", y: 140, yValue: -4 },
        barIndex: 1,
      }),
    ).toEqual({
      x: 75,
      y: 140,
      width: 10,
      height: -40,
    });
  });

  it("skips missing or non-finite endpoints", () => {
    expect(
      getVerticalBarGroupRect({
        ...baseArgs,
        point: { x: 80, xValue: "A", y: null, yValue: null },
        barIndex: 0,
      }),
    ).toBeNull();
    expect(
      getVerticalBarGroupRect({
        ...baseArgs,
        point: { x: Number.NaN, xValue: "A", y: 40, yValue: undefined },
        barIndex: 0,
      }),
    ).toBeNull();
  });
});
