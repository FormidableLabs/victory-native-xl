import type { ChartBounds } from "../../types";
import { getBarGroupDimensionsForAxis } from "./getBarGroupDimensionsForAxis";

export type GetBarGroupDimensionsArgs = {
  chartBounds: Pick<ChartBounds, "left" | "right">;
  betweenGroupPadding: number;
  withinGroupPadding: number;
  groupCount: number;
  barsPerGroup: number;
  customBarWidth?: number;
  barCount?: number;
};

export const getBarGroupDimensions = ({
  chartBounds,
  betweenGroupPadding,
  withinGroupPadding,
  groupCount,
  barsPerGroup,
  customBarWidth,
  barCount,
}: GetBarGroupDimensionsArgs) => {
  return getBarGroupDimensionsForAxis({
    axisStart: chartBounds.left,
    axisEnd: chartBounds.right,
    betweenGroupPadding,
    withinGroupPadding,
    groupCount,
    barsPerGroup,
    customBarWidth,
    barCount,
  });
};
