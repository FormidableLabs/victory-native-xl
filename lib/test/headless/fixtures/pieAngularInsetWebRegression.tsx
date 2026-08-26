import React from "react";
import { Pie, PolarChart } from "victory-native";

export const PIE_ANGULAR_INSET_COLORS = [
  "#b54be6",
  "#575759",
  "#39d353",
] as const;

const DATA = [
  {
    label: "Pet-project",
    value: 505_000,
    color: PIE_ANGULAR_INSET_COLORS[0],
  },
  { label: "No tag", value: 286_000, color: PIE_ANGULAR_INSET_COLORS[1] },
  { label: "Learning", value: 28_000, color: PIE_ANGULAR_INSET_COLORS[2] },
] as const;

const WIDTH = 240;
const HEIGHT = 240;

export const pieAngularInsetWebRegression = (
  <PolarChart
    data={[...DATA]}
    labelKey="label"
    valueKey="value"
    colorKey="color"
    explicitSize={{ width: WIDTH, height: HEIGHT }}
    headless
  >
    <Pie.Chart innerRadius="62%" size={188}>
      {() => (
        <>
          <Pie.Slice />
          <Pie.SliceAngularInset
            angularInset={{
              angularStrokeColor: "#141416",
              angularStrokeWidth: 3,
            }}
          />
        </>
      )}
    </Pie.Chart>
  </PolarChart>
);

export const pieAngularInsetWebRegressionSize = {
  width: WIDTH,
  height: HEIGHT,
};
