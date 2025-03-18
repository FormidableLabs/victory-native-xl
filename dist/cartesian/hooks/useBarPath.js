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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBarPath = void 0;
const React = __importStar(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const createRoundedRectPath_1 = require("../../utils/createRoundedRectPath");
const CartesianChartContext_1 = require("../contexts/CartesianChartContext");
const useBarWidth_1 = require("./useBarWidth");
const useBarPath = (points, chartBounds, innerPadding = 0.2, roundedCorners, customBarWidth, barCount) => {
    const { yScale } = (0, CartesianChartContext_1.useCartesianChartContext)();
    const barWidth = (0, useBarWidth_1.useBarWidth)({
        points,
        chartBounds,
        innerPadding,
        customBarWidth,
        barCount,
    });
    const path = React.useMemo(() => {
        const path = react_native_skia_1.Skia.Path.Make();
        points.forEach(({ x, y, yValue }) => {
            if (typeof y !== "number")
                return;
            const barHeight = yScale(0) - y;
            if (roundedCorners) {
                const nonUniformRoundedRect = (0, createRoundedRectPath_1.createRoundedRectPath)(x - barWidth / 2, y, barWidth, barHeight, roundedCorners, Number(yValue));
                path.addRRect(nonUniformRoundedRect);
            }
            else {
                path.addRect(react_native_skia_1.Skia.XYWHRect(x - barWidth / 2, y, barWidth, barHeight));
            }
        });
        return path;
    }, [barWidth, points, roundedCorners, yScale]);
    return { path, barWidth };
};
exports.useBarPath = useBarPath;
