import type { PointsArray } from "../types";

/**
 * Stitches together PointsArray into an array of tuples for d3 consumption
 */
export const stitchDataArray = (data: PointsArray): [number, number][] =>
  data.reduce(
    (acc, { x, y }) => {
      if (typeof y === "number") acc.push([x, y]);
      return acc;
    },
    [] as [number, number][],
  );
