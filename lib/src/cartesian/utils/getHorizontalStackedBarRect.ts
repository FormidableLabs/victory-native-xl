import type { HorizontalBarRect } from "./getHorizontalBarRect";
import type { StackedBarSegment } from "./getStackedBarSegments";

export const getHorizontalStackedBarRect = ({
  segment,
  xScale,
  barWidth,
}: {
  segment: StackedBarSegment;
  xScale: (value: number) => number;
  barWidth: number;
}): HorizontalBarRect | null => {
  const { y } = segment.point;
  const startX = xScale(segment.startValue);
  const endX = xScale(segment.endValue);

  if (
    typeof y !== "number" ||
    !Number.isFinite(y) ||
    !Number.isFinite(startX) ||
    !Number.isFinite(endX)
  ) {
    return null;
  }

  return {
    x: Math.min(startX, endX),
    y: y - barWidth / 2,
    width: Math.abs(endX - startX),
    height: barWidth,
  };
};
