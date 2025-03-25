/**
 * Stitches together PointsArray into an array of tuples for d3 consumption
 */
export const stitchDataArray = (data) => data.reduce((acc, { x, y }) => {
    if (typeof y === "number")
        acc.push([x, y]);
    return acc;
}, []);
