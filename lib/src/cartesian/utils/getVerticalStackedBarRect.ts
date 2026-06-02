import type { VerticalBarRect } from "./getVerticalBarRect";
import type { StackedBarSegment } from "./getStackedBarSegments";

export const getVerticalStackedBarRect = ({
  segment,
  yScale,
  barWidth,
}: {
  segment: StackedBarSegment;
  yScale: (value: number) => number;
  barWidth: number;
}): VerticalBarRect | null => {
  const { x } = segment.point;
  const startY = yScale(segment.startValue);
  const endY = yScale(segment.endValue);

  if (
    !Number.isFinite(x) ||
    !Number.isFinite(startY) ||
    !Number.isFinite(endY)
  ) {
    return null;
  }

  return {
    x: x - barWidth / 2,
    y: endY,
    width: barWidth,
    height: startY - endY,
  };
};
