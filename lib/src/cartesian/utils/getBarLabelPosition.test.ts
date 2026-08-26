import { describe, expect, it } from "vitest";
import { getBarLabelPosition } from "./getBarLabelPosition";

const chartBounds = {
  left: 0,
  right: 240,
  top: 0,
  bottom: 200,
};

describe("getBarLabelPosition", () => {
  it("places horizontal labels above and below positive bars", () => {
    expect(
      getBarLabelPosition({
        orientation: "horizontal",
        position: "top",
        x: 180,
        y: 60,
        baselineX: 100,
        labelWidth: 20,
        fontSize: 12,
        barWidth: 24,
        chartBounds,
      }),
    ).toEqual({ x: 130, y: 43 });

    expect(
      getBarLabelPosition({
        orientation: "horizontal",
        position: "bottom",
        x: 180,
        y: 60,
        baselineX: 100,
        labelWidth: 20,
        fontSize: 12,
        barWidth: 24,
        chartBounds,
      }),
    ).toEqual({ x: 130, y: 89 });
  });

  it("uses screen-relative left and right positions for negative horizontal bars", () => {
    expect(
      getBarLabelPosition({
        orientation: "horizontal",
        position: "left",
        x: 60,
        y: 80,
        baselineX: 100,
        labelWidth: 16,
        fontSize: 12,
        barWidth: 20,
        chartBounds,
      }),
    ).toEqual({ x: 39, y: 84 });

    expect(
      getBarLabelPosition({
        orientation: "horizontal",
        position: "right",
        x: 60,
        y: 80,
        baselineX: 100,
        labelWidth: 16,
        fontSize: 12,
        barWidth: 20,
        chartBounds,
      }),
    ).toEqual({ x: 105, y: 84 });
  });

  it("preserves vertical bar label positioning", () => {
    expect(
      getBarLabelPosition({
        orientation: "vertical",
        position: "bottom",
        x: 40,
        y: 120,
        labelWidth: 10,
        fontSize: 12,
        barWidth: 18,
        chartBounds,
      }),
    ).toEqual({ x: 35, y: 195 });
  });

  it("adds clearance for rotated labels above vertical bars", () => {
    const labelPosition = getBarLabelPosition({
      orientation: "vertical",
      position: "top",
      x: 80,
      y: 100,
      labelWidth: 48,
      fontSize: 12,
      labelRotate: -25,
      barWidth: 18,
      chartBounds,
    });

    const angle = (Math.PI / 180) * 25;
    const rotatedClearance =
      (48 * Math.sin(angle) + 12 * Math.cos(angle)) / 2 - 12 / 2;

    expect(labelPosition.x).toBe(56);
    expect(labelPosition.y).toBeCloseTo(100 - 5 - rotatedClearance);
  });
});
