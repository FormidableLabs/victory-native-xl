import {} from "../types";
/**
 * Filters out points with missing y value, used for interpolating missing data.
 */
export const cleanPointsArray = (points) => points.filter((point) => typeof point.y === "number");
