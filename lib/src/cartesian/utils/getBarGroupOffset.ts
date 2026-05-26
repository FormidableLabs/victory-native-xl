export const getBarGroupOffset = ({
  groupWidth,
  barWidth,
  gapWidth,
  barIndex,
}: {
  groupWidth: number;
  barWidth: number;
  gapWidth: number;
  barIndex: number;
}) => {
  return -groupWidth / 2 + barIndex * (barWidth + gapWidth);
};
