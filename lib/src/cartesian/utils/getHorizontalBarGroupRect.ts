import type { PointsArray } from "../../types";
import { getBarGroupOffset } from "./getBarGroupOffset";
import type { HorizontalBarRect } from "./getHorizontalBarRect";

type Point = PointsArray[number];

export const getHorizontalBarGroupRect = ({
  point,
  baselineX,
  barWidth,
  groupWidth,
  gapWidth,
  barIndex,
}: {
  point: Point;
  baselineX: number;
  barWidth: number;
  groupWidth: number;
  gapWidth: number;
  barIndex: number;
}): HorizontalBarRect | null => {
  const { x, y } = point;

  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    !Number.isFinite(x) ||
    !Number.isFinite(y)
  ) {
    return null;
  }

  return {
    x: Math.min(baselineX, x),
    y: y + getBarGroupOffset({ groupWidth, barWidth, gapWidth, barIndex }),
    width: Math.abs(x - baselineX),
    height: barWidth,
  };
};
