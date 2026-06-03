import { describe, expect, it } from "vitest";
import { getCategoryYAxisLabelPosition } from "./getCategoryYAxisLabelPosition";

const chartBounds = {
  left: 50,
  right: 300,
  top: 20,
  bottom: 220,
};

describe("getCategoryYAxisLabelPosition", () => {
  it("places left outset category labels outside the chart bounds", () => {
    expect(
      getCategoryYAxisLabelPosition({
        axisSide: "left",
        labelPosition: "outset",
        labelOffset: 8,
        labelWidth: 72,
        lineCount: 1,
        lineHeight: 12,
        fontSize: 12,
        tickPosition: 100,
        chartBounds,
      }),
    ).toMatchObject({
      x: -30,
      y: 104,
      canFitContent: true,
    });
  });

  it("places right inset category labels inside the chart bounds", () => {
    expect(
      getCategoryYAxisLabelPosition({
        axisSide: "right",
        labelPosition: "inset",
        labelOffset: 10,
        labelWidth: 64,
        lineCount: 1,
        lineHeight: 12,
        fontSize: 12,
        tickPosition: 120,
        chartBounds,
      }),
    ).toMatchObject({
      x: 226,
      y: 124,
      canFitContent: true,
    });
  });

  it("centers multiline labels around the category tick", () => {
    expect(
      getCategoryYAxisLabelPosition({
        axisSide: "left",
        labelPosition: "inset",
        labelOffset: 6,
        labelWidth: 80,
        lineCount: 2,
        lineHeight: 12,
        fontSize: 12,
        tickPosition: 100,
        chartBounds,
      }),
    ).toMatchObject({
      x: 56,
      y: 98,
      canFitContent: true,
    });
  });

  it("marks labels that would clip above the chart bounds as not fitting", () => {
    expect(
      getCategoryYAxisLabelPosition({
        axisSide: "left",
        labelPosition: "outset",
        labelOffset: 8,
        labelWidth: 72,
        lineCount: 1,
        lineHeight: 12,
        fontSize: 12,
        tickPosition: 18,
        chartBounds,
      }),
    ).toMatchObject({
      canFitContent: false,
    });
  });
});
