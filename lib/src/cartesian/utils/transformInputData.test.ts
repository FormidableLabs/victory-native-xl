import { describe, it, expect } from "vitest";
import type { SkFont } from "@shopify/react-native-skia";
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
const OUTPUT_WINDOW = {
  yMin: 0,
  yMax: 300,
  xMin: 0,
  xMax: 500,
};
const font = {
  getSize: () => 10,
  getGlyphIDs: (text: string) => Array.from(text).map((_, index) => index),
  getGlyphWidths: (glyphs: number[]) => glyphs.map(() => 4),
} as unknown as SkFont;

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

  it("preserves input order for ordinal x values", () => {
    const { ix, ox, xTicksNormalized, isNumericalData } = transformInputData({
      data: [
        { x: "beta", y: 3 },
        { x: "alpha", y: 7 },
        { x: "gamma", y: 5 },
      ],
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes.map((axis) => ({ ...axis, yKeys: ["y"] })),
    });

    expect(isNumericalData).toBe(false);
    expect(ix).toEqual(["beta", "alpha", "gamma"]);
    expect(ox).toEqual([0, 250, 500]);
    expect(xTicksNormalized).toEqual([0, 1, 2]);
  });

  it("downsamples ordinal x ticks to tickCount", () => {
    const { xTicksNormalized } = transformInputData({
      data: [
        { x: "alpha", y: 3 },
        { x: "beta", y: 7 },
        { x: "gamma", y: 5 },
        { x: "delta", y: 4 },
        { x: "epsilon", y: 9 },
      ],
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        tickCount: 3,
      },
      yAxes: axes.yAxes.map((axis) => ({ ...axis, yKeys: ["y"] })),
    });

    expect(xTicksNormalized).toEqual([0, 2, 4]);
  });

  it("centers a single datum by expanding equal x and y domains", () => {
    const { ox, y } = transformInputData({
      data: [{ x: 5, y: 10 }],
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes.map((axis) => ({ ...axis, yKeys: ["y"] })),
    });

    expect(ox).toEqual([250]);
    expect(y.y.o[0]).toBeCloseTo(150);
  });

  it("keeps missing y values in the transformed output without using them for scale bounds", () => {
    const { y, yAxes } = transformInputData({
      data: [
        { x: 0, y: 3 },
        { x: 1, y: null },
        { x: 2, y: 7 },
      ],
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes.map((axis) => ({ ...axis, yKeys: ["y"] })),
    });

    expect(y.y.i).toEqual([3, null, 7]);
    expect(y.y.o[1]).toBeNull();
    expect(yAxes[0].yScale.domain()).toEqual([7, 3]);
  });

  it("keeps y scales finite when every y value is missing", () => {
    const { ox, y, yAxes } = transformInputData({
      data: [
        { x: 0, y: null },
        { x: 1, y: null },
        { x: 2, y: null },
      ],
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes.map((axis) => ({ ...axis, yKeys: ["y"] })),
    });

    expect(y.y.i).toEqual([null, null, null]);
    expect(y.y.o).toEqual([null, null, null]);
    expect(ox.every(Number.isFinite)).toBe(true);
    expect(yAxes[0].yScale.domain()).toEqual([1, -1]);
    expect(yAxes[0].yScale.range().every(Number.isFinite)).toBe(true);
  });

  it("keeps log y scales finite when y values cannot define a positive domain", () => {
    const { yAxes } = transformInputData({
      data: [
        { x: 0, y: null },
        { x: 1, y: 0 },
        { x: 2, y: -2 },
      ],
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes.map((axis) => ({ ...axis, yKeys: ["y"] })),
      axisScales: { yAxisScale: "log" },
    });

    const yScale = yAxes[0].yScale;
    expect(yScale.domain()).toEqual([10, 1]);
    expect(yScale(10)).toBeCloseTo(0);
    expect(yScale(1)).toBeCloseTo(300);
  });

  it("keeps single-value log y scales positive and finite", () => {
    const { y, yAxes } = transformInputData({
      data: [{ x: 0, y: 1 }],
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes.map((axis) => ({ ...axis, yKeys: ["y"] })),
      axisScales: { yAxisScale: "log" },
    });

    const yScale = yAxes[0].yScale;
    expect(yScale.domain()).toEqual([10, 0.1]);
    expect(Number.isFinite(y.y.o[0])).toBe(true);
  });

  it("builds separate y scales for multiple y-axis configurations", () => {
    const baseYAxis = axes.yAxes[0]!;
    const { yAxes, y } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: [
        { ...baseYAxis, yKeys: ["y"], domain: [0, 10] },
        { ...baseYAxis, yKeys: ["z"], domain: [0, 100] },
      ],
    });

    expect(yAxes[0].yScale(10)).toBeCloseTo(0);
    expect(yAxes[1]!.yScale(100)).toBeCloseTo(0);
    expect(y.y.o).toEqual([210, 90.00000000000001, 150]);
    expect(y.z.o).toEqual([300, 288, 270]);
  });

  it("keeps rotated x label layout finite when no x ticks are rendered", () => {
    const { ox, y, yAxes } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        tickCount: 0,
        tickValues: [],
        labelRotate: 45,
      },
      yAxes: axes.yAxes.map((axis) => ({ ...axis, yKeys: ["y"] })),
      labelRotate: 45,
    });

    expect(ox.every(Number.isFinite)).toBe(true);
    expect(y.y.o.every((value) => Number.isFinite(value as number))).toBe(true);
    expect(yAxes[0].yScale.range().every(Number.isFinite)).toBe(true);
  });

  it("renders no x ticks when tickCount is zero with explicit tick values", () => {
    const { xTicksNormalized } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        tickCount: 0,
        tickValues: [0, 1, 2],
      },
      yAxes: axes.yAxes.map((axis) => ({ ...axis, yKeys: ["y"] })),
    });

    expect(xTicksNormalized).toEqual([]);
  });

  it("renders no y ticks when tickCount is zero with explicit tick values", () => {
    const { yAxes } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes.map((axis) => ({
        ...axis,
        yKeys: ["y"],
        tickCount: 0,
        tickValues: [3, 5, 7],
      })),
    });

    expect(yAxes[0].yTicksNormalized).toEqual([]);
  });

  it("downsamples explicit x tick values to tickCount", () => {
    const { xTicksNormalized } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        tickCount: 3,
        tickValues: [0, 1, 2, 3, 4],
      },
      yAxes: axes.yAxes.map((axis) => ({ ...axis, yKeys: ["y"] })),
    });

    expect(xTicksNormalized).toEqual([0, 2, 4]);
  });

  it("reserves vertical space for multiline x labels", () => {
    const { yAxes } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        font,
        formatXLabel: () => "Day\n1",
        tickValues: [0, 1, 2],
      },
      yAxes: axes.yAxes.map((axis) => ({ ...axis, yKeys: ["y"] })),
    });

    expect(yAxes[0].yScale.range()[1]).toBe(276);
  });

  it("measures ordinal x labels using their formatted x values", () => {
    const { yAxes } = transformInputData({
      data: [
        { x: "first", y: 3 },
        { x: "second", y: 7 },
        { x: "third", y: 5 },
      ],
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        font,
        formatXLabel: (label) => (label === "second" ? "Day\nTwo\nPeak" : ""),
      },
      yAxes: axes.yAxes.map((axis) => ({ ...axis, yKeys: ["y"] })),
    });

    expect(yAxes[0].yScale.range()[1]).toBe(266);
  });

  it("measures ordinal x label layout from rendered ticks only", () => {
    const { yAxes } = transformInputData({
      data: [
        { x: "first", y: 3 },
        { x: "middle", y: 7 },
        { x: "last", y: 5 },
      ],
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        font,
        tickCount: 2,
        formatXLabel: (label) =>
          label === "middle" ? "Long\nMiddle\nLabel" : String(label),
      },
      yAxes: axes.yAxes.map((axis) => ({ ...axis, yKeys: ["y"] })),
    });

    expect(yAxes[0].yScale.range()[1]).toBe(286);
  });

  it("uses x-axis labelOffset when reserving x label space", () => {
    const { yAxes } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        font,
        labelOffset: 6,
      },
      yAxes: axes.yAxes.map((axis) => ({
        ...axis,
        font,
        yKeys: ["y"],
        labelOffset: 20,
      })),
    });

    expect(yAxes[0].yScale.range()[1]).toBe(278);
  });

  it("does not reserve x label space when x ticks are disabled", () => {
    const { yAxes } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        font,
        tickCount: 0,
        tickValues: [],
      },
      yAxes: axes.yAxes.map((axis) => ({
        ...axis,
        font,
        yKeys: ["y"],
        tickCount: 3,
      })),
    });

    expect(yAxes[0].yScale.range()[1]).toBe(300);
  });

  it("does not reserve x label space for empty formatted labels", () => {
    const { yAxes } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        font,
        formatXLabel: () => "",
      },
      yAxes: axes.yAxes.map((axis) => ({
        ...axis,
        font,
        yKeys: ["y"],
        tickCount: 3,
      })),
    });

    expect(yAxes[0].yScale.range()[1]).toBe(300);
  });

  it("reserves horizontal space by the widest line of multiline y labels", () => {
    const { xScale } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes.map((axis) => ({
        ...axis,
        font,
        yKeys: ["y"],
        formatYLabel: () => "Long\nY",
      })),
    });

    expect(xScale(0)).toBe(16);
  });

  it("does not reserve y label space for empty formatted labels", () => {
    const { xScale } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes.map((axis) => ({
        ...axis,
        font,
        yKeys: ["y"],
        labelOffset: 10,
        tickCount: 3,
        tickValues: [3, 5, 7],
        formatYLabel: () => "",
      })),
    });

    expect(xScale(0)).toBe(0);
  });

  // TODO: Some day, test the gridOptions code.
});
