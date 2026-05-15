import { scaleLinear } from "d3-scale";
import { describe, expect, it } from "vitest";
import { getXAxisTicks } from "./getXAxisTicks";

describe("getXAxisTicks", () => {
  it("uses scale ticks for numerical data without explicit tick values", () => {
    const ticks = getXAxisTicks({
      isNumericalData: true,
      ix: [0, 1, 2],
      tickCount: 3,
      xScale: scaleLinear([0, 2], [0, 100]),
    });

    expect(ticks).toEqual([0, 0.5, 1, 1.5, 2]);
  });

  it("derives numerical ticks from the scale supplied by the axis caller", () => {
    const fixedViewportTicks = getXAxisTicks({
      isNumericalData: true,
      ix: Array.from({ length: 12 }, (_, index) => index),
      tickCount: 3,
      xScale: scaleLinear([5, 11], [0, 300]),
    });

    const rescaledViewportTicks = getXAxisTicks({
      isNumericalData: true,
      ix: Array.from({ length: 12 }, (_, index) => index),
      tickCount: 3,
      xScale: scaleLinear([0, 6], [0, 300]),
    });

    expect(fixedViewportTicks).toEqual([6, 8, 10]);
    expect(rescaledViewportTicks).toEqual([0, 2, 4, 6]);
  });

  it("downsamples explicit tick values", () => {
    const ticks = getXAxisTicks({
      isNumericalData: true,
      ix: [0, 1, 2],
      tickCount: 3,
      tickValues: [0, 1, 2, 3, 4],
      xScale: scaleLinear([0, 4], [0, 100]),
    });

    expect(ticks).toEqual([0, 2, 4]);
  });

  it("uses data indexes for ordinal data instead of scale ticks", () => {
    const ticks = getXAxisTicks({
      isNumericalData: false,
      ix: ["alpha", "beta", "gamma"],
      tickCount: 3,
      xScale: scaleLinear([0, 2], [0, 100]),
    });

    expect(ticks).toEqual([0, 1, 2]);
  });

  it("returns no ordinal ticks when tick count is zero", () => {
    const ticks = getXAxisTicks({
      isNumericalData: false,
      ix: ["alpha", "beta", "gamma"],
      tickCount: 0,
      xScale: scaleLinear([0, 2], [0, 100]),
    });

    expect(ticks).toEqual([]);
  });

  it("downsamples ordinal indexes to tick count", () => {
    const ticks = getXAxisTicks({
      isNumericalData: false,
      ix: ["alpha", "beta", "gamma", "delta", "epsilon"],
      tickCount: 3,
      xScale: scaleLinear([0, 4], [0, 100]),
    });

    expect(ticks).toEqual([0, 2, 4]);
  });
});
