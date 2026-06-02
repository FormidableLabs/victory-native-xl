import * as React from "react";
import { CartesianChart, type AxisLabelRenderer } from "victory-native";

const DATA = [
  { category: "Audio", value: 42 },
  { category: "Books", value: 18 },
];

const stringRenderer = {
  measure: ({ value, text }) => {
    value.toUpperCase();
    text.toUpperCase();
    return { width: 24, height: 12 };
  },
  render: ({ value, text, x, y, width, height, color, canFitContent }) => {
    value.toUpperCase();
    text.toUpperCase();
    x.toFixed(0);
    y.toFixed(0);
    width.toFixed(0);
    height.toFixed(0);
    color.toUpperCase();
    canFitContent.valueOf();
    return null;
  },
} satisfies AxisLabelRenderer<string>;

const numberRenderer = {
  measure: ({ value, text }) => {
    value.toFixed(0);
    text.toUpperCase();
    return { width: 24, height: 12 };
  },
  render: ({ value, text, fontSize, lineHeight, chartBounds }) => {
    value.toFixed(0);
    text.toUpperCase();
    fontSize.toFixed(0);
    lineHeight.toFixed(0);
    chartBounds.left.toFixed(0);
    return null;
  },
} satisfies AxisLabelRenderer<number>;

export function VerticalAxisLabelRendererTypes() {
  return (
    <CartesianChart
      data={DATA}
      xKey="category"
      yKeys={["value"]}
      xAxis={{
        labelRenderer: stringRenderer,
      }}
      yAxis={[
        {
          labelRenderer: numberRenderer,
        },
      ]}
    >
      {() => null}
    </CartesianChart>
  );
}

export function HorizontalAxisLabelRendererTypes() {
  return (
    <CartesianChart
      orientation="horizontal"
      data={DATA}
      xKey="category"
      yKeys={["value"]}
      xAxis={{
        labelRenderer: numberRenderer,
      }}
      yAxis={[
        {
          labelRenderer: stringRenderer,
        },
      ]}
    >
      {() => null}
    </CartesianChart>
  );
}

export function HorizontalRejectsCategoryXRenderer() {
  return (
    // @ts-expect-error Horizontal x-axis renderers receive numeric value ticks.
    <CartesianChart
      orientation="horizontal"
      data={DATA}
      xKey="category"
      yKeys={["value"]}
      xAxis={{ labelRenderer: stringRenderer }}
    >
      {() => null}
    </CartesianChart>
  );
}

export function HorizontalRejectsNumericYRenderer() {
  return (
    // @ts-expect-error Horizontal y-axis renderers receive xKey category values.
    <CartesianChart
      orientation="horizontal"
      data={DATA}
      xKey="category"
      yKeys={["value"]}
      yAxis={[{ labelRenderer: numberRenderer }]}
    >
      {() => null}
    </CartesianChart>
  );
}
