import type { PointsArray } from "../types";

/**
 * Stitches two arrays together into an array of tuples.
 */
export const stitch = (xs: number[], ys: number[]): [number, number][] =>
  xs.map((x, i) => [x, ys[i] || NaN]);

export const stitchDataArray = (data: PointsArray): [number, number][] =>
  data.map(({ x, y }) => [x, y]);
