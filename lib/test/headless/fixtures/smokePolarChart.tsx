import React from "react";
import { Pie, PolarChart } from "victory-native";

const DATA = [
  { label: "a", value: 30, color: "#E45756" },
  { label: "b", value: 50, color: "#4C78A8" },
  { label: "c", value: 20, color: "#F58518" },
] as const;

const WIDTH = 320;
const HEIGHT = 320;

export const smokePolarChart = (
  <PolarChart
    data={[...DATA]}
    labelKey="label"
    valueKey="value"
    colorKey="color"
    explicitSize={{ width: WIDTH, height: HEIGHT }}
    headless
  >
    <Pie.Chart />
  </PolarChart>
);

export const smokePolarSize = { width: WIDTH, height: HEIGHT };
