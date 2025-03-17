import { type PointsArray } from "../types";

/**
 * Filters out points with missing y value, used for interpolating missing data.
 */
export const cleanPointsArray = (points: PointsArray): PointsArray =>
  points.filter((point) => typeof point.y === "number");
