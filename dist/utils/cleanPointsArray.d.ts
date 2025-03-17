import { type PointsArray } from "../types";
/**
 * Filters out points with missing y value, used for interpolating missing data.
 */
export declare const cleanPointsArray: (points: PointsArray) => PointsArray;
