import type { PointsArray } from "../types";

/**
 * Takes a PointsArray and chunks it into groups, breaking at non-numerical y-values
 */
export const groupPointsArray = (points: PointsArray): PointsArray[] => {
  const groups: PointsArray[] = [];
  let group: PointsArray = [];

  for (const point of points) {
    if (typeof point.y !== "number") {
      if (group.length > 0) {
        groups.push(group);
        group = [];
      }
    } else {
      group.push(point);
    }
  }

  if (group.length > 0) {
    groups.push(group);
  }

  return groups;
};
