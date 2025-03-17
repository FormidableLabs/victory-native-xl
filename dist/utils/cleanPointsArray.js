"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanPointsArray = void 0;
/**
 * Filters out points with missing y value, used for interpolating missing data.
 */
const cleanPointsArray = (points) => points.filter((point) => typeof point.y === "number");
exports.cleanPointsArray = cleanPointsArray;
