import { describe, expect, it } from "vitest";
import { getHorizontalBarGroupRect } from "./getHorizontalBarGroupRect";

const baseArgs = {
  baselineX: 100,
  barWidth: 10,
  groupWidth: 40,
  gapWidth: 5,
};

describe("getHorizontalBarGroupRect", () => {
  it("places positive grouped bars from the baseline to the value endpoint", () => {
    expect(
      getHorizontalBarGroupRect({
        ...baseArgs,
        point: { x: 180, xValue: "A", y: 80, yValue: 8 },
        barIndex: 0,
      }),
    ).toEqual({
      x: 100,
      y: 60,
      width: 80,
      height: 10,
    });
  });

  it("offsets later bars vertically within the same category group", () => {
    expect(
      getHorizontalBarGroupRect({
        ...baseArgs,
        point: { x: 180, xValue: "A", y: 80, yValue: 8 },
        barIndex: 2,
      }),
    ).toEqual({
      x: 100,
      y: 90,
      width: 80,
      height: 10,
    });
  });

  it("draws negative grouped bars left of the baseline", () => {
    expect(
      getHorizontalBarGroupRect({
        ...baseArgs,
        point: { x: 60, xValue: "A", y: 80, yValue: -4 },
        barIndex: 1,
      }),
    ).toEqual({
      x: 60,
      y: 75,
      width: 40,
      height: 10,
    });
  });

  it("skips missing or non-finite endpoints", () => {
    expect(
      getHorizontalBarGroupRect({
        ...baseArgs,
        point: { x: Number.NaN, xValue: "A", y: 80, yValue: undefined },
        barIndex: 0,
      }),
    ).toBeNull();
    expect(
      getHorizontalBarGroupRect({
        ...baseArgs,
        point: { x: 120, xValue: "A", y: undefined, yValue: undefined },
        barIndex: 0,
      }),
    ).toBeNull();
  });
});
