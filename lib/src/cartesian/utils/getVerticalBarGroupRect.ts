import type { PointsArray } from "../../types";
import { getBarGroupOffset } from "./getBarGroupOffset";
import type { VerticalBarRect } from "./getVerticalBarRect";

type Point = PointsArray[number];

export const getVerticalBarGroupRect = ({
  point,
  baselineY,
  barWidth,
  groupWidth,
  gapWidth,
  barIndex,
}: {
  point: Point;
  baselineY: number;
  barWidth: number;
  groupWidth: number;
  gapWidth: number;
  barIndex: number;
}): VerticalBarRect | null => {
  const { x, y } = point;

  if (typeof y !== "number" || !Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  return {
    x: x + getBarGroupOffset({ groupWidth, barWidth, gapWidth, barIndex }),
    y,
    width: barWidth,
    height: baselineY - y,
  };
};
