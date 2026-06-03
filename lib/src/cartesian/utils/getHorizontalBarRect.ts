import type { PointsArray } from "../../types";

type Point = PointsArray[number];

export type HorizontalBarRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const getHorizontalBarRect = (
  point: Point,
  baselineX: number,
  barThickness: number,
): HorizontalBarRect | null => {
  const { x, y } = point;

  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    !Number.isFinite(x) ||
    !Number.isFinite(y)
  ) {
    return null;
  }

  const xStart = Math.min(baselineX, x);
  const width = Math.abs(x - baselineX);

  return {
    x: xStart,
    y: y - barThickness / 2,
    width,
    height: barThickness,
  };
};
