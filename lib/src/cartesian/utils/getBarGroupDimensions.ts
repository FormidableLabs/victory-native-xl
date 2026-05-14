import type { ChartBounds } from "../../types";

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
  const groupWidth =
    ((1 - betweenGroupPadding) * (chartBounds.right - chartBounds.left)) /
    Math.max(1, groupCount);
  const denominator =
    barCount && barCount > 0 ? barCount : Math.max(1, barsPerGroup);
  const barWidth =
    customBarWidth !== undefined
      ? customBarWidth
      : ((1 - withinGroupPadding) * groupWidth) / denominator;
  const gapWidth =
    (groupWidth - barWidth * barsPerGroup) / Math.max(1, barsPerGroup - 1);

  return { barWidth, groupWidth, gapWidth };
};
