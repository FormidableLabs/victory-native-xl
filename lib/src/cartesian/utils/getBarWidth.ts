import type { ChartBounds, PointsArray } from "../../types";

type GetBarWidthArgs = {
  points: PointsArray | PointsArray[];
  chartBounds: Pick<ChartBounds, "left" | "right">;
  innerPadding: number;
  customBarWidth?: number;
  barCount?: number;
};

export const getBarWidth = ({
  customBarWidth,
  chartBounds,
  innerPadding,
  barCount,
  points,
}: GetBarWidthArgs) => {
  if (customBarWidth !== undefined) return customBarWidth;

  const pointsLength =
    points.length > 0 && Array.isArray(points[0])
      ? points[0].length
      : points.length;
  const domainWidth = chartBounds.right - chartBounds.left;
  const numerator = (1 - innerPadding) * domainWidth;
  const denominator = barCount
    ? barCount
    : pointsLength - 1 <= 0
      ? pointsLength
      : pointsLength - 1;

  return numerator / denominator;
};
