import * as React from "react";
import { CartesianChart, type AxisTitle } from "victory-native";

const DATA = [
  { category: "Audio", value: 42 },
  { category: "Books", value: 18 },
];

const xAxisTitle: AxisTitle = {
  text: "Category",
  font: null,
  color: "#111111",
  position: "center",
  offset: 8,
};

const invalidAxisTitle: AxisTitle = {
  text: "Invalid",
  // @ts-expect-error Axis title position only accepts start, center, or end.
  position: "middle",
};

void invalidAxisTitle;

export function VerticalAxisTitleTypes() {
  return (
    <CartesianChart
      data={DATA}
      xKey="category"
      yKeys={["value"]}
      xAxis={{
        title: xAxisTitle,
      }}
      yAxis={[
        {
          title: {
            text: "Value",
            font: null,
            position: "start",
          },
        },
      ]}
    >
      {() => null}
    </CartesianChart>
  );
}

export function HorizontalAxisTitleTypes() {
  return (
    <CartesianChart
      orientation="horizontal"
      data={DATA}
      xKey="category"
      yKeys={["value"]}
      xAxis={{
        title: {
          text: "Value",
          font: null,
          position: "end",
        },
      }}
      yAxis={[
        {
          title: {
            text: "Category",
            font: null,
          },
        },
      ]}
    >
      {() => null}
    </CartesianChart>
  );
}
