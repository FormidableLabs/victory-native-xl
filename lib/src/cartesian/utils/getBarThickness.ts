import type { PointsArray } from "../../types";

export type GetBarThicknessArgs = {
  axisStart: number;
  axisEnd: number;
  points: PointsArray | PointsArray[];
  innerPadding: number;
  customBarThickness?: number;
  barCount?: number;
};

export const getBarThickness = ({
  axisStart,
  axisEnd,
  points,
  innerPadding,
  customBarThickness,
  barCount,
}: GetBarThicknessArgs) => {
  if (customBarThickness !== undefined) return customBarThickness;

  const pointsLength =
    points.length > 0 && Array.isArray(points[0])
      ? points[0].length
      : points.length;
  const axisLength = axisEnd - axisStart;
  const numerator = (1 - innerPadding) * axisLength;
  const denominator =
    barCount && barCount > 0
      ? barCount
      : pointsLength - 1 <= 0
        ? pointsLength
        : pointsLength - 1;

  if (denominator <= 0) return 0;

  return numerator / denominator;
};
