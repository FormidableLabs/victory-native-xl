import { describe, expect, it } from "vitest";
import { getXAxisLabelPosition } from "./getXAxisLabelPosition";

const chartBounds = {
  left: 20,
  right: 220,
};

describe("getXAxisLabelPosition", () => {
  it("keeps middle labels centered on their tick", () => {
    expect(
      getXAxisLabelPosition({
        tickPosition: 120,
        labelWidth: 40,
        chartBounds,
      }),
    ).toEqual({
      canRenderLabel: true,
      labelX: 100,
      labelCenterX: 120,
    });
  });

  it("clamps the first visible tick label to the left chart bound", () => {
    expect(
      getXAxisLabelPosition({
        tickPosition: 20,
        labelWidth: 60,
        chartBounds,
      }),
    ).toEqual({
      canRenderLabel: true,
      labelX: 20,
      labelCenterX: 50,
    });
  });

  it("clamps the last visible tick label to the right chart bound", () => {
    expect(
      getXAxisLabelPosition({
        tickPosition: 220,
        labelWidth: 60,
        chartBounds,
      }),
    ).toEqual({
      canRenderLabel: true,
      labelX: 160,
      labelCenterX: 190,
    });
  });

  it("does not render labels for ticks left of the chart bounds", () => {
    expect(
      getXAxisLabelPosition({
        tickPosition: 19.99,
        labelWidth: 40,
        chartBounds,
      }).canRenderLabel,
    ).toBe(false);
  });

  it("does not render labels for ticks right of the chart bounds", () => {
    expect(
      getXAxisLabelPosition({
        tickPosition: 220.01,
        labelWidth: 40,
        chartBounds,
      }).canRenderLabel,
    ).toBe(false);
  });

  it("keeps oversized labels anchored to the left bound", () => {
    expect(
      getXAxisLabelPosition({
        tickPosition: 120,
        labelWidth: 240,
        chartBounds,
      }),
    ).toEqual({
      canRenderLabel: true,
      labelX: 20,
      labelCenterX: 140,
    });
  });
});
