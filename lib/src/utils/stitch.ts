/**
 * Stitches two arrays together into an array of objects
 */
export const stitch = (xs: number[], ys: number[]): [number, number][] =>
  xs.map((x, i) => [x, ys[i]!]);
