export const getStackedBarTouchSegmentIndex = ({
  values,
  touchValue,
}: {
  values: number[];
  touchValue: number;
}) => {
  "worklet";
  if (!Number.isFinite(touchValue) || touchValue === 0) return -1;

  let cumulativeValue = 0;
  const isPositiveTouch = touchValue > 0;

  for (let i = 0; i < values.length; i++) {
    const value = values[i] ?? NaN;
    if (!Number.isFinite(value) || value === 0) continue;
    if (value > 0 !== isPositiveTouch) continue;

    const startValue = cumulativeValue;
    const endValue = cumulativeValue + value;

    if (
      (isPositiveTouch && touchValue >= startValue && touchValue <= endValue) ||
      (!isPositiveTouch && touchValue <= startValue && touchValue >= endValue)
    ) {
      return i;
    }

    cumulativeValue = endValue;
  }

  return -1;
};
