import React from "react";
import { Group } from "react-native-skia";
import {
  Area,
  AreaRange,
  CartesianChart,
  Line,
  StackedArea,
  type CurveType,
} from "victory-native";

type Datum = {
  x: number;
  // Has gaps: a multi point run, an isolated point, then another run.
  gaps: number | null;
  full: number;
  low: number;
  mid: number;
  high: number;
};

const GAPS = [42, 68, 35, 80, null, 55, null, 20, 62, 48, 90, 30];
const FULL = [20, 34, 28, 45, 38, 60, 52, 72, 40, 58, 66, 50];

const DATA: Datum[] = GAPS.map((gaps, i) => ({
  x: i,
  gaps,
  full: FULL[i]!,
  low: 8 + ((i * 7) % 11),
  mid: 12 + ((i * 5) % 9),
  high: 10 + ((i * 3) % 13),
}));

const WIDTH = 400;
const HEIGHT = 250;

export const CURVE_TYPES: CurveType[] = [
  "linear",
  "natural",
  "bumpX",
  "bumpY",
  "cardinal",
  "cardinal50",
  "catmullRom",
  "catmullRom0",
  "catmullRom100",
  "monotoneX",
  "step",
  "stepAfter",
  "stepBefore",
  "basis",
];

/**
 * Lines and areas for a single curve type, with and without gaps in the data.
 * Round stroke caps make the isolated point visible, so a regression in how
 * single point runs are closed shows up in the golden image.
 */
const lineAndAreaChart = (curveType: CurveType) => (
  <CartesianChart
    data={DATA}
    xKey="x"
    yKeys={["gaps", "full"]}
    domain={{ y: [0, 100] }}
    padding={12}
    explicitSize={{ width: WIDTH, height: HEIGHT }}
    headless
  >
    {({ points, chartBounds }) => (
      <>
        <Area
          points={points.full}
          y0={chartBounds.bottom}
          curveType={curveType}
          color="#F58518"
          opacity={0.35}
        />
        <Area
          points={points.gaps}
          y0={chartBounds.bottom}
          curveType={curveType}
          color="#4C78A8"
          opacity={0.35}
        />
        <Area
          points={points.gaps}
          y0={chartBounds.bottom}
          curveType={curveType}
          connectMissingData
          color="#54A24B"
          opacity={0.2}
        />
        <Line
          points={points.full}
          curveType={curveType}
          color="#F58518"
          strokeWidth={2}
        />
        <Line
          points={points.gaps}
          curveType={curveType}
          color="#4C78A8"
          strokeWidth={6}
          strokeCap="round"
          strokeJoin="round"
        />
        <Line
          points={points.gaps}
          curveType={curveType}
          connectMissingData
          color="#54A24B"
          strokeWidth={1}
        />
      </>
    )}
  </CartesianChart>
);

/**
 * Stacked areas and an area range for a single curve type.
 */
const stackedAreaChart = (curveType: CurveType) => (
  <CartesianChart
    data={DATA}
    xKey="x"
    yKeys={["low", "mid", "high", "full"]}
    domain={{ y: [0, 100] }}
    padding={12}
    explicitSize={{ width: WIDTH, height: HEIGHT }}
    headless
  >
    {({ points, chartBounds }) => (
      <>
        <StackedArea
          points={[points.low, points.mid, points.high]}
          y0={chartBounds.bottom}
          curveType={curveType}
          colors={["#4C78A8", "#F58518", "#E45756"]}
        />
        <AreaRange
          upperPoints={points.full}
          lowerPoints={points.high}
          curveType={curveType}
          color="#72B7B2"
          opacity={0.5}
        />
      </>
    )}
  </CartesianChart>
);

/**
 * Both charts for a single curve type, one above the other.
 */
export const curveChart = (curveType: CurveType) => (
  <>
    {lineAndAreaChart(curveType)}
    <Group transform={[{ translateY: HEIGHT }]}>
      {stackedAreaChart(curveType)}
    </Group>
  </>
);

export const curveChartSize = { width: WIDTH, height: HEIGHT * 2 };
