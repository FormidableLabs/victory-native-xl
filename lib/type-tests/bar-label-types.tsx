import * as React from "react";
import {
  Bar,
  HorizontalBar,
  type ChartBounds,
  type PointsArray,
} from "victory-native";

const POINTS: PointsArray = [];
const CHART_BOUNDS: ChartBounds = {
  left: 0,
  right: 100,
  top: 0,
  bottom: 100,
};

const invalidBarLabels = {
  position: "top",
  font: null,
  // @ts-expect-error Bar label formatters receive MaybeNumber values.
  formatLabel: (value: string) => value,
} satisfies React.ComponentProps<typeof Bar>["labels"];

void invalidBarLabels;

export function BarLabelConfigTypes() {
  return (
    <Bar
      points={POINTS}
      chartBounds={CHART_BOUNDS}
      labels={{
        position: "top",
        font: null,
        rotate: -45,
        formatLabel: (value) => (value == null ? "missing" : value.toFixed(0)),
      }}
    />
  );
}

export function HorizontalBarLabelConfigTypes() {
  return (
    <HorizontalBar
      points={POINTS}
      chartBounds={CHART_BOUNDS}
      labels={{
        position: "right",
        font: null,
        rotate: 90,
        formatLabel: (value) => (value == null ? "" : `${value}%`),
      }}
    />
  );
}
