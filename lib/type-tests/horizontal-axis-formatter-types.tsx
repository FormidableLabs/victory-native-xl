import * as React from "react";
import { CartesianChart, type CartesianChartOrientation } from "victory-native";

const DATA = [
  { category: "Audio", value: 42 },
  { category: "Books", value: 18 },
];

export function VerticalAxisFormatterTypes() {
  return (
    <CartesianChart data={DATA} xKey="category" yKeys={["value"]}>
      {() => null}
    </CartesianChart>
  );
}

export function VerticalAxisFormatterValueTypes() {
  return (
    <CartesianChart
      data={DATA}
      xKey="category"
      yKeys={["value"]}
      xAxis={{
        formatXLabel: (category) => category.toUpperCase(),
      }}
      yAxis={[
        {
          formatYLabel: (value) => value.toFixed(0),
        },
      ]}
    >
      {() => null}
    </CartesianChart>
  );
}

export function HorizontalAxisFormatterValueTypes() {
  return (
    <CartesianChart
      orientation="horizontal"
      data={DATA}
      xKey="category"
      yKeys={["value"]}
      xAxis={{
        formatXLabel: (value) => value.toFixed(0),
      }}
      yAxis={[
        {
          formatYLabel: (category) => category.toUpperCase(),
        },
      ]}
    >
      {() => null}
    </CartesianChart>
  );
}

export function HorizontalDeprecatedAxisOptionsFormatterValueTypes() {
  return (
    <CartesianChart
      orientation="horizontal"
      data={DATA}
      xKey="category"
      yKeys={["value"]}
      axisOptions={{
        formatXLabel: (value) => value.toFixed(0),
        formatYLabel: (category) => category.toUpperCase(),
      }}
    >
      {() => null}
    </CartesianChart>
  );
}

export function HorizontalRejectsCategoryXFormatter() {
  return (
    // @ts-expect-error Horizontal x-axis labels receive numeric value ticks.
    <CartesianChart
      orientation="horizontal"
      data={DATA}
      xKey="category"
      yKeys={["value"]}
      xAxis={{ formatXLabel: (category: string) => category.toUpperCase() }}
    >
      {() => null}
    </CartesianChart>
  );
}

export function HorizontalRejectsNumericYFormatter() {
  return (
    // @ts-expect-error Horizontal y-axis labels receive xKey category values.
    <CartesianChart
      orientation="horizontal"
      data={DATA}
      xKey="category"
      yKeys={["value"]}
      yAxis={[{ formatYLabel: (value: number) => value.toFixed(0) }]}
    >
      {() => null}
    </CartesianChart>
  );
}

export function VerticalRejectsNumericXFormatter() {
  return (
    // @ts-expect-error Vertical x-axis labels receive xKey category values.
    <CartesianChart
      data={DATA}
      xKey="category"
      yKeys={["value"]}
      xAxis={{ formatXLabel: (value: number) => value.toFixed(0) }}
    >
      {() => null}
    </CartesianChart>
  );
}

const dynamicOrientation: CartesianChartOrientation =
  Math.random() > 0.5 ? "vertical" : "horizontal";

export function DynamicOrientationFormatterTypes() {
  return (
    <CartesianChart
      orientation={dynamicOrientation}
      data={DATA}
      xKey="category"
      yKeys={["value"]}
      xAxis={{
        formatXLabel: (value) =>
          typeof value === "number" ? value.toFixed(0) : value.toUpperCase(),
      }}
      yAxis={[
        {
          formatYLabel: (value) =>
            typeof value === "number" ? value.toFixed(0) : value.toUpperCase(),
        },
      ]}
    >
      {() => null}
    </CartesianChart>
  );
}
