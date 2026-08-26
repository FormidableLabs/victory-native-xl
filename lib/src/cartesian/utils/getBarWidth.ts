import type { ChartBounds, PointsArray } from "../../types";
import { getBarThickness } from "./getBarThickness";

export type GetBarWidthArgs = {
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
  return getBarThickness({
    axisStart: chartBounds.left,
    axisEnd: chartBounds.right,
    points,
    innerPadding,
    customBarThickness: customBarWidth,
    barCount,
  });
};
