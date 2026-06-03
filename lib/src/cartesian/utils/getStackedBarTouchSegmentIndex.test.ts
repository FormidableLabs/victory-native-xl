import { describe, expect, it } from "vitest";
import { getCartesianChartBounds } from "./getCartesianChartBounds";
import { getStackedBarTouchSegmentIndex } from "./getStackedBarTouchSegmentIndex";
import { makeScale } from "./makeScale";

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

  it("selects horizontal segments from viewport-adjusted chart coordinates", () => {
    const xScale = makeScale({
      inputBounds: [0, 100],
      outputBounds: [0, 200],
      viewport: [20, 60],
      padStart: 10,
      padEnd: 10,
    });
    const yScale = makeScale({
      inputBounds: [0, 1],
      outputBounds: [0, 100],
    });
    const chartBounds = getCartesianChartBounds({
      xScale,
      yScale,
      viewport: { x: [20, 60] },
      domainPadding: { left: 10, right: 10 },
      orientation: "horizontal",
    });
    const touchX = 150;
    const visibleDomainLeft = xScale.invert(chartBounds.left);
    const visibleDomainRight = xScale.invert(chartBounds.right);
    const touchValue =
      ((touchX - chartBounds.left) / (chartBounds.right - chartBounds.left)) *
        (visibleDomainRight - visibleDomainLeft) +
      visibleDomainLeft;

    expect(xScale.domain()).toEqual([0, 100]);
    expect(touchValue).toBeCloseTo(51.111);
    expect(
      getStackedBarTouchSegmentIndex({
        values: [30, 30],
        touchValue,
      }),
    ).toBe(1);

    const fullDomainTouchValue =
      ((touchX - chartBounds.left) / (chartBounds.right - chartBounds.left)) *
      100;
    expect(
      getStackedBarTouchSegmentIndex({
        values: [30, 30],
        touchValue: fullDomainTouchValue,
      }),
    ).toBe(-1);
  });
});
