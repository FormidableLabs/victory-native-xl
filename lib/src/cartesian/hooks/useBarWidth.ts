import React from "react";
import type { ChartBounds, PointsArray, RoundedCorners } from "lib/dist";

type Props = {
  points: PointsArray | PointsArray[];
  chartBounds: ChartBounds;
  innerPadding: number;
  roundedCorners?: RoundedCorners;
  customBarWidth?: number;
  barCount?: number;
};
export const useBarWidth = ({
  customBarWidth,
  chartBounds,
  innerPadding,
  barCount,
  points,
}: Props) => {
  const barWidth = React.useMemo(() => {
    if (customBarWidth) return customBarWidth;
    const domainWidth = chartBounds.right - chartBounds.left;

    const numerator = (1 - innerPadding) * domainWidth;

    const denominator = barCount
      ? barCount
      : points.length - 1 <= 0
        ? // don't divide by 0 if there's only one data point
          points.length
        : points.length - 1;

    const barWidth = numerator / denominator;

    return barWidth;
  }, [
    customBarWidth,
    chartBounds.left,
    chartBounds.right,
    innerPadding,
    points.length,
    barCount,
  ]);
  return barWidth;
};
