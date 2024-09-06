import * as React from "react";
import { Path, Text, type PathProps } from "@shopify/react-native-skia";
import type { PropsWithChildren } from "react";

import type { ChartBounds, PointsArray } from "../../types";
import { AnimatedPath } from "./AnimatedPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";
import { useBarPath } from "../hooks/useBarPath";
import type { RoundedCorners } from "../../utils/createRoundedRectPath";
import useBarLabels, { type DataLabelConfig } from "../hooks/useBarLabels";

type CartesianBarProps = {
  points: PointsArray;
  chartBounds: ChartBounds;
  innerPadding?: number;
  animate?: PathAnimationConfig;
  roundedCorners?: RoundedCorners;
  barWidth?: number;
  barCount?: number;
  dataLabel?: DataLabelConfig;
} & Partial<Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">>;

type DataLabelProps = {
  points: PointsArray;
  chartBounds: ChartBounds;
  barWidth?: number;
  options: DataLabelConfig;
};

export const Bar = ({
  points,
  chartBounds,
  animate,
  innerPadding = 0.25,
  roundedCorners,
  barWidth,
  barCount,
  dataLabel,
  ...ops
}: PropsWithChildren<CartesianBarProps>) => {
  const { path, barWidth: bw } = useBarPath(
    points,
    chartBounds,
    innerPadding,
    roundedCorners,
    barWidth,
    barCount,
  );

  const BarGraph = () =>
    React.createElement(animate ? AnimatedPath : Path, {
      path,
      style: "fill",
      ...(Boolean(animate) && { animate }),
      ...ops,
    });

  return (
    <>
      {dataLabel?.enabled && (
        <BarGraphLabels
          points={points}
          chartBounds={chartBounds}
          barWidth={barWidth ?? bw}
          options={dataLabel}
        />
      )}
      <BarGraph />
    </>
  );
};

const BarGraphLabels = ({
  points,
  chartBounds,
  barWidth,
  options,
}: DataLabelProps) => {
  const labelPositions = useBarLabels(
    points,
    chartBounds,
    barWidth ?? 0,
    options,
  );

  return labelPositions.map(({ x, y, value }) => {
    return (
      <Text
        key={`${x}-${y}-${value}`}
        x={x}
        y={y}
        text={value}
        font={options.font}
        color={options.color}
      />
    );
  });
};
