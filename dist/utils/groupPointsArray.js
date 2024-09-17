"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupPointsArray = void 0;
/**
 * Takes a PointsArray and chunks it into groups, breaking at non-numerical y-values
 */
const groupPointsArray = (points) => {
    const groups = [];
    let group = [];
    for (const point of points) {
        if (typeof point.y !== "number") {
            if (group.length > 0) {
                groups.push(group);
                group = [];
            }
        }
        else {
            group.push(point);
        }
    }
    if (group.length > 0) {
        groups.push(group);
    }
    return groups;
};
exports.groupPointsArray = groupPointsArray;
