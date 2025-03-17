"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBarGroupPaths = void 0;
const React = __importStar(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const createRoundedRectPath_1 = require("../../utils/createRoundedRectPath");
const CartesianChartContext_1 = require("../contexts/CartesianChartContext");
const useBarGroupPaths = (points, chartBounds, betweenGroupPadding = 0, withinGroupPadding = 0, roundedCorners, customBarWidth, barCount) => {
    var _a;
    const numGroups = ((_a = points[0]) === null || _a === void 0 ? void 0 : _a.length) || 0;
    const { yScale } = (0, CartesianChartContext_1.useCartesianChartContext)();
    const groupWidth = React.useMemo(() => {
        return (((1 - betweenGroupPadding) * (chartBounds.right - chartBounds.left)) /
            Math.max(1, numGroups));
    }, [betweenGroupPadding, chartBounds.left, chartBounds.right, numGroups]);
    const barWidth = React.useMemo(() => {
        if (customBarWidth)
            return customBarWidth;
        const numerator = (1 - withinGroupPadding) * groupWidth;
        const denominator = barCount ? barCount : Math.max(1, points.length);
        return numerator / denominator;
    }, [customBarWidth, groupWidth, points.length, withinGroupPadding, barCount]);
    const gapWidth = React.useMemo(() => {
        return ((groupWidth - barWidth * points.length) / Math.max(1, points.length - 1));
    }, [barWidth, groupWidth, points.length]);
    const paths = React.useMemo(() => {
        return points.map((pointSet, i) => {
            const p = react_native_skia_1.Skia.Path.Make();
            const offset = -groupWidth / 2 + i * (barWidth + gapWidth);
            pointSet.forEach(({ x, y, yValue }) => {
                if (typeof y !== "number")
                    return;
                const barHeight = yScale(0) - y;
                if (roundedCorners) {
                    const nonUniformRoundedRect = (0, createRoundedRectPath_1.createRoundedRectPath)(x + offset, y, barWidth, barHeight, roundedCorners, Number(yValue));
                    p.addRRect(nonUniformRoundedRect);
                }
                else {
                    p.addRect(react_native_skia_1.Skia.XYWHRect(x + offset, y, barWidth, barHeight));
                }
            });
            return p;
        });
    }, [barWidth, gapWidth, groupWidth, points, roundedCorners, yScale]);
    return { barWidth, groupWidth, gapWidth, paths };
};
exports.useBarGroupPaths = useBarGroupPaths;
