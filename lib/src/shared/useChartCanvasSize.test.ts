import { describe, expect, it } from "vitest";
import {
  applyChartLayoutChange,
  getInitialChartCanvasSizeState,
  isChartHeadless,
  resolveChartCanvasSizeState,
  shouldWarnMissingHeadlessExplicitSize,
} from "./chartCanvasSizeUtils";

describe("getInitialChartCanvasSizeState", () => {
  it("returns zero size and unmeasured layout without explicitSize", () => {
    expect(getInitialChartCanvasSizeState()).toEqual({
      size: { width: 0, height: 0 },
      hasMeasuredLayoutSize: false,
    });
  });

  it("seeds size and marks layout measured with explicitSize", () => {
    expect(getInitialChartCanvasSizeState({ width: 320, height: 240 })).toEqual(
      {
        size: { width: 320, height: 240 },
        hasMeasuredLayoutSize: true,
      },
    );
  });
});

describe("isChartHeadless", () => {
  it("is false without both headless and explicitSize", () => {
    expect(isChartHeadless()).toBe(false);
    expect(isChartHeadless(true)).toBe(false);
    expect(isChartHeadless(false, { width: 100, height: 100 })).toBe(false);
    expect(isChartHeadless(true, { width: 100, height: 100 })).toBe(true);
  });
});

describe("resolveChartCanvasSizeState", () => {
  it("returns the measured layout state without explicitSize", () => {
    expect(
      resolveChartCanvasSizeState({
        size: { width: 120, height: 80 },
        hasMeasuredLayoutSize: true,
      }),
    ).toEqual({
      size: { width: 120, height: 80 },
      hasMeasuredLayoutSize: true,
    });
  });

  it("uses explicitSize over the measured layout state", () => {
    expect(
      resolveChartCanvasSizeState(
        {
          size: { width: 120, height: 80 },
          hasMeasuredLayoutSize: true,
        },
        { width: 320, height: 240 },
      ),
    ).toEqual({
      size: { width: 320, height: 240 },
      hasMeasuredLayoutSize: true,
    });
  });
});

describe("shouldWarnMissingHeadlessExplicitSize", () => {
  it("warns only when headless is requested without explicitSize", () => {
    expect(shouldWarnMissingHeadlessExplicitSize()).toBe(false);
    expect(shouldWarnMissingHeadlessExplicitSize(false)).toBe(false);
    expect(
      shouldWarnMissingHeadlessExplicitSize(false, {
        width: 100,
        height: 100,
      }),
    ).toBe(false);
    expect(
      shouldWarnMissingHeadlessExplicitSize(true, {
        width: 100,
        height: 100,
      }),
    ).toBe(false);
    expect(shouldWarnMissingHeadlessExplicitSize(true)).toBe(true);
  });
});

describe("applyChartLayoutChange", () => {
  it("no-ops when explicitSize is set", () => {
    expect(
      applyChartLayoutChange(
        { width: 320, height: 240 },
        {
          width: 999,
          height: 999,
        },
      ),
    ).toBeNull();
  });

  it("updates size and marks layout measured without explicitSize", () => {
    expect(
      applyChartLayoutChange(undefined, { width: 400, height: 300 }),
    ).toEqual({
      size: { width: 400, height: 300 },
      hasMeasuredLayoutSize: true,
    });
  });
});
