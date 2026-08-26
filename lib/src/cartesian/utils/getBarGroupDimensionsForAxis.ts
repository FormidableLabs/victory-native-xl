export type GetBarGroupDimensionsForAxisArgs = {
  axisStart: number;
  axisEnd: number;
  betweenGroupPadding: number;
  withinGroupPadding: number;
  groupCount: number;
  barsPerGroup: number;
  customBarWidth?: number;
  barCount?: number;
};

export const getBarGroupDimensionsForAxis = ({
  axisStart,
  axisEnd,
  betweenGroupPadding,
  withinGroupPadding,
  groupCount,
  barsPerGroup,
  customBarWidth,
  barCount,
}: GetBarGroupDimensionsForAxisArgs) => {
  const groupWidth =
    ((1 - betweenGroupPadding) * (axisEnd - axisStart)) /
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
