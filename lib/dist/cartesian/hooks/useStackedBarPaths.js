"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStackedBarPaths = void 0;
const react_1 = __importDefault(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const createRoundedRectPath_1 = require("../../utils/createRoundedRectPath");
const CartesianChartContext_1 = require("../contexts/CartesianChartContext");
const useBarWidth_1 = require("./useBarWidth");
const DEFAULT_COLORS = ["red", "orange", "blue", "green", "blue", "purple"];
const useStackedBarPaths = ({ points, chartBounds, innerPadding = 0.25, barWidth: customBarWidth, barCount, barOptions = () => ({}), colors = DEFAULT_COLORS, }) => {
    const { yScale } = (0, CartesianChartContext_1.useCartesianChartContext)();
    const barWidth = (0, useBarWidth_1.useBarWidth)({
        points,
        chartBounds,
        innerPadding,
        customBarWidth,
        barCount,
    });
    // initialize an object that will offset the bars' height's for each x value
    // so that we know where to start drawing the next bar for each x value
    const barYPositionOffsetTracker = points.reduce((acc, points) => {
        points.map((point) => (acc[point.xValue] = [0, 0]));
        return acc;
    }, {});
    const paths = react_1.default.useMemo(() => {
        const bars = [];
        const xToBottomTopIndexMap = getXToPointIndexMap(points);
        points.forEach((pointsArray, i) => {
            pointsArray.forEach((point, j) => {
                var _a, _b, _c, _d;
                const isBottom = ((_a = xToBottomTopIndexMap.get(point.x)) === null || _a === void 0 ? void 0 : _a[0]) === i;
                const isTop = ((_b = xToBottomTopIndexMap.get(point.x)) === null || _b === void 0 ? void 0 : _b[1]) === i;
                const { yValue, x, y } = point;
                if (typeof y !== "number")
                    return;
                const isPositive = (yValue !== null && yValue !== void 0 ? yValue : 0) > 0;
                // call for any additional bar options per bar
                const options = barOptions({
                    columnIndex: i,
                    rowIndex: j,
                    isBottom: isPositive ? isBottom : isTop,
                    isTop: isPositive ? isTop : isBottom,
                });
                const { roundedCorners, color } = options, ops = __rest(options, ["roundedCorners", "color"]);
                const path = react_native_skia_1.Skia.Path.Make();
                const barHeight = yScale(0) - y;
                const offset = isPositive
                    ? (_c = barYPositionOffsetTracker === null || barYPositionOffsetTracker === void 0 ? void 0 : barYPositionOffsetTracker[point.xValue]) === null || _c === void 0 ? void 0 : _c[0]
                    : (_d = barYPositionOffsetTracker === null || barYPositionOffsetTracker === void 0 ? void 0 : barYPositionOffsetTracker[point.xValue]) === null || _d === void 0 ? void 0 : _d[1];
                if (roundedCorners) {
                    const nonUniformRoundedRect = (0, createRoundedRectPath_1.createRoundedRectPath)(x - barWidth / 2, y - (offset !== null && offset !== void 0 ? offset : 0), barWidth, barHeight, roundedCorners, Number(yValue));
                    path.addRRect(nonUniformRoundedRect);
                }
                else {
                    path.addRect(react_native_skia_1.Skia.XYWHRect(point.x - barWidth / 2, y - (offset !== null && offset !== void 0 ? offset : 0), barWidth, barHeight));
                }
                if (notNullAndUndefined(offset)) {
                    if (isPositive) {
                        barYPositionOffsetTracker[point.xValue][0] = barHeight + offset; // accumulate the positive heights as we loop
                    }
                    else {
                        barYPositionOffsetTracker[point.xValue][1] = barHeight + offset; // accumulate the negative heights as we loop
                    }
                }
                const bar = Object.assign({ path, key: `${i}-${j}`, color: color !== null && color !== void 0 ? color : colors[i] }, ops);
                bars.push(bar);
            });
        });
        return bars;
    }, [barOptions, barWidth, barYPositionOffsetTracker, colors, points, yScale]);
    return paths;
};
exports.useStackedBarPaths = useStackedBarPaths;
/**
 * Returns a map of x values to a two value array where the first number is the index of
 * the bottom bar and the second is the index of the top bar.
 */
const getXToPointIndexMap = (points) => {
    const xToIndexMap = new Map();
    points.forEach((pointsArray, i) => {
        pointsArray.forEach(({ x, y, yValue }) => {
            if (notNullAndUndefined(y) &&
                notNullAndUndefined(yValue) &&
                yValue !== 0) {
                const current = xToIndexMap.get(x);
                if (!current) {
                    xToIndexMap.set(x, [i, i]);
                }
                else {
                    yValue > 0 ? (current[1] = i) : (current[0] = i);
                }
            }
        });
    });
    return xToIndexMap;
};
const notNullAndUndefined = (value) => value !== null && value !== undefined;
