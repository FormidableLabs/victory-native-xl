import type { PointsArray } from "../../types";

type Point = PointsArray[number];

export type VerticalBarRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const getVerticalBarRect = (
  point: Point,
  baselineY: number,
  barThickness: number,
): VerticalBarRect | null => {
  const { x, y } = point;

  if (typeof y !== "number" || !Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  return {
    x: x - barThickness / 2,
    y,
    width: barThickness,
    height: baselineY - y,
  };
};
