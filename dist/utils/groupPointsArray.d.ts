import { type PointsArray } from "../types";
/**
 * Takes a PointsArray and chunks it into groups, breaking at non-numerical y-values
 */
export declare const groupPointsArray: (points: PointsArray) => PointsArray[];
