import { describe, expect, it } from "vitest";
import { getStackedBarTouchSegmentIndex } from "./getStackedBarTouchSegmentIndex";

describe("getStackedBarTouchSegmentIndex", () => {
  it("finds the touched positive segment from cumulative values", () => {
    expect(
      getStackedBarTouchSegmentIndex({
        values: [10, 20, 30],
        touchValue: 25,
      }),
    ).toBe(1);
  });

  it("finds the touched negative segment from cumulative values", () => {
    expect(
      getStackedBarTouchSegmentIndex({
        values: [-10, -20, -30],
        touchValue: -25,
      }),
    ).toBe(1);
  });

  it("keeps positive and negative stacks independent", () => {
    expect(
      getStackedBarTouchSegmentIndex({
        values: [10, -20, 30],
        touchValue: 25,
      }),
    ).toBe(2);
    expect(
      getStackedBarTouchSegmentIndex({
        values: [10, -20, 30],
        touchValue: -12,
      }),
    ).toBe(1);
  });

  it("skips zero and non-finite values", () => {
    expect(
      getStackedBarTouchSegmentIndex({
        values: [0, Number.NaN, 10],
        touchValue: 4,
      }),
    ).toBe(2);
  });

  it("returns -1 when the touch is outside the stack", () => {
    expect(
      getStackedBarTouchSegmentIndex({
        values: [10, 20],
        touchValue: 40,
      }),
    ).toBe(-1);
    expect(
      getStackedBarTouchSegmentIndex({
        values: [-10, -20],
        touchValue: -40,
      }),
    ).toBe(-1);
  });
});
