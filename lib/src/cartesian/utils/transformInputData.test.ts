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

  it("should not change the y-axis mapping when labelRotate is applied", () => {
    const withoutRotation = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
    });

    const withPosRotation = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: { ...axes.xAxis, labelRotate: 45 },
      yAxes: axes.yAxes,
    });

    const withNegRotation = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: { ...axes.xAxis, labelRotate: -45 },
      yAxes: axes.yAxes,
    });

    expect([
      withNegRotation.y.y.o,
      withPosRotation.y.y.o,
      withoutRotation.y.y.o,
    ]).toEqual([
      withoutRotation.y.y.o,
      withoutRotation.y.y.o,
      withoutRotation.y.y.o,
    ]);
    expect([
      withNegRotation.y.z.o,
      withPosRotation.y.z.o,
      withoutRotation.y.z.o,
    ]).toEqual([
      withoutRotation.y.z.o,
      withoutRotation.y.z.o,
      withoutRotation.y.z.o,
    ]);
  });

  // TODO: Some day, test the gridOptions code.
});
