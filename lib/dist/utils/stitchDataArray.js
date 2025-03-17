"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stitchDataArray = void 0;
/**
 * Stitches together PointsArray into an array of tuples for d3 consumption
 */
const stitchDataArray = (data) => data.reduce((acc, { x, y }) => {
    if (typeof y === "number")
        acc.push([x, y]);
    return acc;
}, []);
exports.stitchDataArray = stitchDataArray;
