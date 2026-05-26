import React from "react";
import { Bar, CartesianChart } from "victory-native";

const DATA = [
  { month: 1, value: 40 },
  { month: 2, value: 80 },
] as const;

const WIDTH = 400;
const HEIGHT = 250;

export const smokeCartesianChart = (
  <CartesianChart
    data={[...DATA]}
    xKey="month"
    yKeys={["value"]}
    domain={{ y: [0, 100] }}
    explicitSize={{ width: WIDTH, height: HEIGHT }}
    headless
    frame={{
      lineWidth: 1,
      lineColor: "#000000",
    }}
    xAxis={{
      tickCount: 2,
      lineWidth: 1,
      lineColor: "#333333",
    }}
    yAxis={[
      {
        yKeys: ["value"],
        tickCount: 2,
        lineWidth: 1,
        lineColor: "#333333",
      },
    ]}
  >
    {({ points, chartBounds }) => (
      <Bar
        points={points.value}
        chartBounds={chartBounds}
        color="#4C78A8"
        innerPadding={0.3}
      />
    )}
  </CartesianChart>
);

export const smokeCartesianSize = { width: WIDTH, height: HEIGHT };
