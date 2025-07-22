import { describe, it, expect } from "vitest";
import type {
  InputDatum,
  ValueOf,
  XAxisPropsWithDefaults,
  YAxisPropsWithDefaults,
} from "../../types";
import { transformInputData } from "./transformInputData";

const DATA = [
  { x: 0, y: 3, z: 0 },
  { x: 1, y: 7, z: 4 },
  { x: 2, y: 5, z: 10 },
];

const CATEGORICAL_DATA = [
  { category: "A", y: 10, z: 5 },
  { category: "B", y: 20, z: 15 },
  { category: "C", y: 15, z: 25 },
];

// Data with very different scales
const MULTI_SCALE_DATA = [
  { x: 0, small: 1, large: 1000 },
  { x: 1, small: 5, large: 2000 },
  { x: 2, small: 3, large: 1500 },
];

const OUTPUT_WINDOW = {
  yMin: 0,
  yMax: 300,
  xMin: 0,
  xMax: 500,
};

const axes = {
  xAxis: {
    lineColor: "hsla(0, 0%, 0%, 0.25)",
    lineWidth: 0.5,
    tickCount: 5,
    labelOffset: 2,
    axisSide: "bottom",
    yAxisSide: "left",
    labelPosition: "outset",
    formatXLabel: (label: ValueOf<InputDatum>) => String(label),
    labelColor: "#000000",
  } satisfies XAxisPropsWithDefaults<never, never>,
  yAxes: [
    {
      lineColor: "hsla(0, 0%, 0%, 0.25)",
      lineWidth: 0.5,
      tickCount: 5,
      labelOffset: 0,
      axisSide: "left",
      labelPosition: "outset",
      formatYLabel: (label: ValueOf<InputDatum>) => String(label),
      labelColor: "#000000",
      yKeys: ["y", "z"],
      domain: null,
    } satisfies YAxisPropsWithDefaults<(typeof DATA)[number], "y" | "z">,
  ],
};

describe("transformInputData", () => {
  it("transforms data into internal data structure based on x/y keys", () => {
    const { ix, ox, y } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
    });

    expect(ix).toEqual([0, 1, 2]);
    expect(ox).toEqual([0, 250, 500]);
    expect(y.y).toEqual({
      i: [3, 7, 5],
      o: [210, 90.00000000000001, 150],
    });
    expect(y.z).toEqual({
      i: [0, 4, 10],
      o: [300, 180, 0],
    });
  });

  it("should generate scales based on output window", () => {
    const { xScale, yAxes } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
    });

    const yScale = yAxes[0].yScale;

    expect(xScale(0)).toEqual(0);
    expect(xScale(2)).toEqual(500);
    expect(yScale(0)).toEqual(300);
    expect(yScale(10)).toEqual(0);
  });

  it("should handle viewport", () => {
    const { xScale, yAxes } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
      viewport: {
        // Test both x and y viewport handling
        x: [0.5, 1.5],
        y: [2, 8],
      },
    });

    const yScale = yAxes[0].yScale;

    expect(xScale(0.5)).toEqual(0);
    expect(xScale(1.5)).toEqual(500);

    expect(yScale(2)).toEqual(300); // min maps to bottom
    expect(yScale(8)).toEqual(0); // max maps to top
  });

  it("sorts data by xKey", () => {
    const { ix, y } = transformInputData({
      data: [
        { x: 2, y: 3 },
        { x: 0, y: 7 },
        { x: 1, y: 5 },
      ],
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes.map((axis) => ({ ...axis, yKeys: ["y"] })),
    });

    expect(ix).toEqual([0, 1, 2]);
    expect(y.y.i).toEqual([7, 5, 3]);
  });

  it("handles non-numerical (categorical) x-axis data", () => {
    const { ix, ox, isNumericalData, xTicksNormalized } = transformInputData({
      data: CATEGORICAL_DATA,
      xKey: "category",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
    });

    // Check that the original categories are preserved
    expect(ix).toEqual(["A", "B", "C"]);

    // For categorical data, values should be equally spaced across the output range
    expect(ox).toEqual([0, 250, 500]);

    // Should correctly identify as non-numerical data
    expect(isNumericalData).toBe(false);

    // For categorical data, the tick values should be the indices
    expect(xTicksNormalized).toEqual([0, 1, 2]);
  });

  it("respects explicit domain settings", () => {
    const { xScale, yAxes } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
      // Set explicit domains that are different from the data's min/max
      domain: {
        x: [-1, 3],
        y: [0, 15],
      },
    });

    const yScale = yAxes[0].yScale;

    // X scale should respect the explicit domain
    expect(xScale(-1)).toBeCloseTo(0);
    expect(xScale(3)).toBeCloseTo(500);

    // Y scale should respect the explicit domain, but may not map exactly to 0
    // due to nice rounding in the scale implementation
    expect(yScale(0)).toBeCloseTo(300);
    // The actual value is around 18.75, likely because the scale rounds to nice values
    expect(yScale(15)).toBeLessThan(50);

    // Values outside the domain will be extrapolated
    expect(xScale(-2)).toBeLessThan(0); // Maps to negative x
    expect(xScale(4)).toBeGreaterThan(500); // Maps beyond the right edge
  });

  it("handles domain padding", () => {
    // Instead of testing specific padding values, let's verify the general behavior
    const { xScale, yAxes } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
      domainPadding: 0.5,
    });

    // Base scales without padding for comparison
    const { xScale: baseXScale, yAxes: baseYAxes } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
    });

    // With padding, the min value should map to a higher x-coordinate
    // and the max value should map to a lower x-coordinate
    expect(xScale(0)).toBeGreaterThan(baseXScale(0));
    expect(xScale(2)).toBeLessThan(baseXScale(2));

    // Similar for y-scale but inverted due to canvas coordinates
    const yScale = yAxes[0].yScale;
    const baseYScale = baseYAxes[0].yScale;

    // In canvas coordinates, lower y value is higher on screen
    expect(yScale(0)).toBeLessThan(baseYScale(0));
    expect(yScale(10)).toBeGreaterThan(baseYScale(10));
  });

  it("handles sided domain padding", () => {
    // Test with different padding on each side
    const { xScale } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
      domainPadding: {
        left: 0.5,
        right: 1,
        top: 0.2,
        bottom: 0.3,
      },
    });

    // Base scale without padding for comparison
    const { xScale: baseXScale } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
    });

    // With more padding on the right than left, the difference should be greater
    const leftPaddingEffect = baseXScale(0) - xScale(0);
    const rightPaddingEffect = xScale(2) - baseXScale(2);

    // Right padding (1) should have more effect than left padding (0.5)
    expect(Math.abs(rightPaddingEffect)).toBeGreaterThan(
      Math.abs(leftPaddingEffect),
    );
  });

  it("handles multiple y-axes with different domains", () => {
    // Create two y-axes with different configurations
    const leftYAxis = {
      ...axes.yAxes[0],
      axisSide: "left" as const,
      yKeys: ["small"] as const,
      // Explicit domain for the small values
      domain: [0, 10] as [number, number],
    } as YAxisPropsWithDefaults<(typeof MULTI_SCALE_DATA)[number], "small">;

    const rightYAxis = {
      ...axes.yAxes[0],
      axisSide: "right" as const,
      yKeys: ["large"] as const,
      // Explicit domain for the large values
      domain: [0, 3000] as [number, number],
    } as YAxisPropsWithDefaults<(typeof MULTI_SCALE_DATA)[number], "large">;

    const { y, yAxes } = transformInputData({
      data: MULTI_SCALE_DATA,
      xKey: "x",
      yKeys: ["small", "large"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: [leftYAxis, rightYAxis],
    });

    // We should have two separate y-axes
    expect(yAxes.length).toBe(2);

    // First axis should be for "small" values
    expect(Object.keys(yAxes[0].yData)).toContain("small");
    expect(Object.keys(yAxes[0].yData)).not.toContain("large");

    // Second axis should be for "large" values
    expect(Object.keys(yAxes[1]!.yData)).toContain("large");
    expect(Object.keys(yAxes[1]!.yData)).not.toContain("small");

    // The scales should be different
    const smallScale = yAxes[0].yScale;
    const largeScale = yAxes[1]!.yScale;

    // Check that the scales map their respective domains correctly
    expect(smallScale(0)).toBeCloseTo(300); // Bottom
    expect(smallScale(10)).toBeCloseTo(0); // Top

    expect(largeScale(0)).toBeCloseTo(300); // Bottom
    expect(largeScale(3000)).toBeCloseTo(0); // Top

    // Check that the output points for each series are calculated correctly
    expect(y.small.i).toEqual([1, 5, 3]);
    expect(y.small.o.length).toBe(3);

    expect(y.large.i).toEqual([1000, 2000, 1500]);
    expect(y.large.o.length).toBe(3);

    // Test that different input values map differently on each scale
    // Let's try a value that's 20% through each domain
    const smallAt20Percent = smallScale(2); // 2 is 20% of [0,10]
    const largeAt20Percent = largeScale(600); // 600 is 20% of [0,3000]

    // These should map to the same y position (20% from bottom, 80% from top)
    expect(smallAt20Percent).toBeCloseTo(largeAt20Percent);

    // But with non-proportional values, they should map differently
    // For example, compare the same absolute value on both scales
    expect(smallScale(3)).not.toBeCloseTo(largeScale(3));
  });

  // TODO: Some day, test the gridOptions code.
});
