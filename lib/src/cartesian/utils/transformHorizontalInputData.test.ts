import { describe, expect, it } from "vitest";
import type { SkFont } from "@shopify/react-native-skia";
import type {
  InputDatum,
  AxisLabelRenderer,
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
type Datum = (typeof DATA)[number];
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
    labelOffset: 0,
    axisSide: "bottom",
    yAxisSide: "left",
    labelPosition: "outset",
    formatXLabel: (label: ValueOf<InputDatum>) => String(label),
    labelColor: "#000000",
  } satisfies XAxisPropsWithDefaults<Datum, "category", number>,
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
    } satisfies YAxisPropsWithDefaults<Datum, "value", Datum["category"]>,
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

  it("renders no value-axis ticks when tickCount is zero with explicit tick values", () => {
    const { xTicksNormalized, yAxes } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        font,
        tickCount: 0,
        tickValues: [0, 10, 20],
      },
      yAxes: axes.yAxes,
    });

    expect(xTicksNormalized).toEqual([]);
    expect(yAxes[0].yScale.range()).toEqual([0, 300]);
  });

  it("reserves horizontal space by the widest line of multiline category labels", () => {
    const { xScale } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: [
        {
          ...axes.yAxes[0]!,
          font,
          labelOffset: 6,
          formatYLabel: (category) =>
            category === "Beta" ? "Short\nLongest" : "",
        },
      ],
    });

    expect(xScale.range()[0]).toBe(34);
  });

  it("does not reserve category label space for empty formatted category labels", () => {
    const { xScale } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: [
        {
          ...axes.yAxes[0]!,
          font,
          labelOffset: 10,
          tickValues: [0, 1, 2],
          formatYLabel: () => "",
        },
      ],
    });

    expect(xScale.range()).toEqual([0, 500]);
  });

  it("reserves vertical space for multiline value-axis labels", () => {
    const { yAxes } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        font,
        labelOffset: 3,
        tickValues: [0, 10],
        formatXLabel: () => "Value\nTick",
      },
      yAxes: axes.yAxes,
    });

    expect(yAxes[0].yScale.range()[1]).toBe(274);
  });

  it("uses x-axis labelOffset when reserving value-axis label space", () => {
    const { yAxes } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        font,
        labelOffset: 8,
        tickValues: [0, 10],
        formatXLabel: () => "Value",
      },
      yAxes: axes.yAxes,
    });

    expect(yAxes[0].yScale.range()[1]).toBe(274);
  });

  it("reserves rotated value-axis label space in horizontal mode", () => {
    const { ox, yAxes } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        font,
        tickValues: [0, 10],
        formatXLabel: () => "Rotated",
      },
      yAxes: axes.yAxes,
      labelRotate: 45,
    });

    expect(yAxes[0].yScale.range()[1]).toBeCloseTo(270.201);
    expect(ox.every(Number.isFinite)).toBe(true);
  });

  it("reserves value-axis label space using custom renderer measurement", () => {
    const measured: { value: number; text: string; index: number }[] = [];
    const labelRenderer = {
      measure: ({ value, text, index }) => {
        measured.push({ value, text, index });
        return { width: 14, height: 22 };
      },
      render: () => null,
    } satisfies AxisLabelRenderer<number>;

    const { yAxes } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        labelOffset: 3,
        tickValues: [0, 10],
        labelRenderer,
        formatXLabel: (value) => `${value}%`,
      },
      yAxes: axes.yAxes,
    });

    expect(yAxes[0].yScale.range()[1]).toBe(272);
    expect(measured).toEqual([
      { value: 0, text: "0%", index: 0 },
      { value: 10, text: "10%", index: 1 },
    ]);
  });

  it("reserves vertical space for a value-axis title", () => {
    const { yAxes } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        tickCount: 0,
        title: {
          text: "Value",
          font,
          offset: 4,
        },
      },
      yAxes: axes.yAxes,
    });

    expect(yAxes[0].yScale.range()[1]).toBe(286);
  });

  it("uses each category axis configuration for ticks and label reservation", () => {
    const { xScale, yAxes } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: [
        {
          ...axes.yAxes[0]!,
          font,
          labelOffset: 4,
          tickValues: [0],
          formatYLabel: () => "A",
        },
        {
          ...axes.yAxes[0]!,
          axisSide: "right",
          font,
          labelOffset: 8,
          tickValues: [2],
          formatYLabel: () => "VeryLongRight",
        },
      ],
    });

    expect(yAxes[0].yTicksNormalized).toEqual([0]);
    expect(yAxes[1]!.yTicksNormalized).toEqual([2]);
    expect(xScale.range()).toEqual([8, 440]);
  });

  it("reserves horizontal space for a category-axis title", () => {
    const { xScale } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: [
        {
          ...axes.yAxes[0]!,
          tickCount: 0,
          title: {
            text: "Category",
            font,
            offset: 6,
          },
        },
      ],
    });

    expect(xScale.range()[0]).toBe(16);
  });

  it("reserves category-axis label space using custom renderer measurement", () => {
    const measured: { value: string; text: string; index: number }[] = [];
    const labelRenderer = {
      measure: ({ value, text, index }) => {
        measured.push({ value, text, index });
        return { width: 44, height: 12 };
      },
      render: () => null,
    } satisfies AxisLabelRenderer<string>;

    const { xScale } = transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: axes.xAxis,
      yAxes: [
        {
          ...axes.yAxes[0]!,
          tickValues: [0, 1],
          labelOffset: 7,
          labelRenderer,
          formatYLabel: (category) => category.toUpperCase(),
        },
      ],
    });

    expect(xScale.range()[0]).toBe(51);
    expect(measured).toEqual([
      { value: "Alpha", text: "ALPHA", index: 0 },
      { value: "Beta", text: "BETA", index: 1 },
    ]);
  });

  it("formats value-axis ticks with numeric values and category-axis ticks with xKey values", () => {
    const formattedXValues: number[] = [];
    const formattedYValues: string[] = [];

    transformHorizontalInputData({
      data: DATA,
      xKey: "category",
      yKeys: ["value"],
      outputWindow: OUTPUT_WINDOW,
      xAxis: {
        ...axes.xAxis,
        tickValues: [0, 10],
        formatXLabel: (value) => {
          formattedXValues.push(value);
          return String(value);
        },
      },
      yAxes: [
        {
          ...axes.yAxes[0]!,
          tickValues: [0, 1],
          formatYLabel: (category) => {
            formattedYValues.push(category);
            return category;
          },
        },
      ],
    });

    expect(formattedXValues).toEqual([0, 10]);
    expect(formattedYValues).toEqual(["Alpha", "Beta"]);
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
