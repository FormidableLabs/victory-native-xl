import type { PointsArray } from "../types";
/**
 * Stitches together PointsArray into an array of tuples for d3 consumption
 */
export declare const stitchDataArray: (data: PointsArray) => [number, number][];
