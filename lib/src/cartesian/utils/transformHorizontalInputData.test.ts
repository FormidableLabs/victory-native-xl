import { describe, expect, it } from "vitest";
import type {
  InputDatum,
  ValueOf,
  XAxisPropsWithDefaults,
  YAxisPropsWithDefaults,
} from "../../types";
import { transformHorizontalInputData } from "./transformHorizontalInputData";

const DATA = [
  { category: "Alpha", value: 10 },
  { category: "Beta", value: -5 },
  { category: "Gamma", value: 20 },
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
    labelOffset: 0,
    axisSide: "bottom",
    yAxisSide: "left",
    labelPosition: "outset",
    formatXLabel: (label: ValueOf<InputDatum>) => String(label),
    labelColor: "#000000",
  } satisfies XAxisPropsWithDefaults<(typeof DATA)[number], "category">,
  yAxes: [
    {
      lineColor: "hsla(0, 0%, 0%, 0.25)",
      lineWidth: 0.5,
      tickCount: 3,
      labelOffset: 0,
      axisSide: "left",
      labelPosition: "outset",
      formatYLabel: (label: ValueOf<InputDatum>) => String(label),
      labelColor: "#000000",
      yKeys: ["value"],
      domain: null,
    } satisfies YAxisPropsWithDefaults<(typeof DATA)[number], "value">,
  ],
};

describe("transformHorizontalInputData", () => {
  it("maps categories to vertical positions and values to horizontal positions", () => {
    const { ix, ox, y, xScale, yAxes } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
    });

    const yScale = yAxes[0].yScale;

    expect(ix).toEqual(["Alpha", "Beta", "Gamma"]);
    expect(ox).toEqual([0, 150, 300]);
    expect(y.value.i).toEqual([10, -5, 20]);
    expect(y.value.o).toEqual([300, 0, 500]);
    expect(xScale.domain()).toEqual([-5, 20]);
    expect(yScale.domain()).toEqual([0, 2]);
  });

  it("includes zero in the value domain by default for positive values", () => {
    const { xScale } = transformHorizontalInputData({
      data: [
        { category: "A", value: 10 },
        { category: "B", value: 20 },
      ],
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
    });

    expect(xScale.domain()).toEqual([0, 20]);
  });

  it("includes zero in the value domain by default for negative values", () => {
    const { xScale } = transformHorizontalInputData({
      data: [
        { category: "A", value: -10 },
        { category: "B", value: -20 },
      ],
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
    });

    expect(xScale.domain()).toEqual([-20, 0]);
  });

  it("expands an all-zero value domain", () => {
    const { xScale, y } = transformHorizontalInputData({
      data: [
        { category: "A", value: 0 },
        { category: "B", value: 0 },
      ],
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
    });

    expect(xScale.domain()).toEqual([-1, 1]);
    expect(y.value.o).toEqual([250, 250]);
  });

  it("centers a single category in the vertical category range", () => {
    const { ox, yAxes } = transformHorizontalInputData({
      data: [{ category: "Only", value: 10 }],
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
    });

    expect(yAxes[0].yScale.domain()).toEqual([-1, 1]);
    expect(ox).toEqual([150]);
  });

  it("preserves missing values without producing finite endpoints", () => {
    const { y, xScale } = transformHorizontalInputData({
      data: [
        { category: "A", value: 10 },
        { category: "B", value: null },
        { category: "C", value: undefined },
      ],
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
    });

    expect(xScale.domain()).toEqual([0, 10]);
    expect(y.value.i).toEqual([10, null, undefined]);
    expect(y.value.o[0]).toBe(500);
    expect(y.value.o[1]).toBeNull();
    expect(y.value.o[2]).toBeUndefined();
  });

  it("uses explicit x domain for the value axis", () => {
    const { xScale } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      domain: { x: [-10, 30] },
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
    });

    expect(xScale.domain()).toEqual([-10, 30]);
  });

  it("does not force zero into an explicit value domain", () => {
    const { xScale } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      domain: { x: [10, 20] },
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
    });

    expect(xScale.domain()).toEqual([10, 20]);
    expect(xScale(0)).toBe(-500);
  });

  it("applies sided domain padding to value and category axes", () => {
    const { xScale, yAxes } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: axes.yAxes,
      domainPadding: { left: 25, right: 50, top: 20, bottom: 40 },
    });

    expect(xScale.domain()[0]).toBeCloseTo(-6.25);
    expect(xScale.domain()[1]).toBeCloseTo(22.5);
    expect(yAxes[0].yScale.domain()[0]).toBeCloseTo(-0.1333);
    expect(yAxes[0].yScale.domain()[1]).toBeCloseTo(2.2667);
  });

  it("supports hidden category-axis ticks", () => {
    const { yAxes } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: [{ ...axes.yAxes[0]!, tickCount: 0 }],
    });

    expect(yAxes[0].yTicksNormalized).toEqual([]);
  });

  it("preserves sorted numeric categories while spacing them as categories", () => {
    const { ix, ox } = transformHorizontalInputData({
      data: [
        { category: 2025, value: 10 },
        { category: 2023, value: 20 },
        { category: 2024, value: 15 },
      ],
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        formatXLabel: (value) => String(value),
      },
      yAxes: [
        {
          lineColor: "hsla(0, 0%, 0%, 0.25)",
          lineWidth: 0.5,
          tickCount: 3,
          labelOffset: 0,
          axisSide: "left",
          labelPosition: "outset",
          formatYLabel: (value) => String(value),
          labelColor: "#000000",
          yKeys: ["value"],
          domain: null,
        },
      ],
    });

    expect(ix).toEqual([2023, 2024, 2025]);
    expect(ox).toEqual([0, 150, 300]);
  });
});
