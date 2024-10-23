import React from "react";
import type { ChartBounds, PointsArray } from "../../types";
import type { RoundedCorners } from "../../utils/createRoundedRectPath";

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
  // stacked bars pass a PointsArray[] type which requires us to get
  // the points length from the length of the first entry.
  const pointsLength =
    points.length > 0 && Array.isArray(points[0])
      ? points[0].length
      : points.length;

  const barWidth = React.useMemo(() => {
    if (customBarWidth) return customBarWidth;
    const domainWidth = chartBounds.right - chartBounds.left;

    const numerator = (1 - innerPadding) * domainWidth;

    const denominator = barCount
      ? barCount
      : pointsLength - 1 <= 0
        ? // don't divide by 0 if there's only one data point
          pointsLength
        : pointsLength - 1;

    const barWidth = numerator / denominator;

    return barWidth;
  }, [
    customBarWidth,
    chartBounds.left,
    chartBounds.right,
    innerPadding,
    pointsLength,
    barCount,
  ]);
  return barWidth;
};
