"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBarWidth = void 0;
const react_1 = __importDefault(require("react"));
const useBarWidth = ({ customBarWidth, chartBounds, innerPadding, barCount, points, }) => {
    // stacked bars pass a PointsArray[] type which requires us to get
    // the points length from the length of the first entry.
    const pointsLength = points.length > 0 && Array.isArray(points[0])
        ? points[0].length
        : points.length;
    const barWidth = react_1.default.useMemo(() => {
        if (customBarWidth)
            return customBarWidth;
        const domainWidth = chartBounds.right - chartBounds.left;
        const numerator = (1 - innerPadding) * domainWidth;
        const denominator = barCount
            ? barCount
            : pointsLength - 1 <= 0
                ? // don't divide by 0 if there's only one data point
                    pointsLength
                : pointsLength - 1;
        const barWidth = numerator / denominator;
        return barWidth;
    }, [
        customBarWidth,
        chartBounds.left,
        chartBounds.right,
        innerPadding,
        pointsLength,
        barCount,
    ]);
    return barWidth;
};
exports.useBarWidth = useBarWidth;
