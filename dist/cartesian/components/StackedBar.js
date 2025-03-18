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
exports.StackedBar = void 0;
const React = __importStar(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const AnimatedPath_1 = require("./AnimatedPath");
const useStackedBarPaths_1 = require("../hooks/useStackedBarPaths");
const DEFAULT_COLORS = ["red", "orange", "blue", "green", "blue", "purple"];
const StackedBar = ({ points, chartBounds, animate, innerPadding = 0.25, barWidth, barCount, barOptions = () => ({}), colors = DEFAULT_COLORS, }) => {
    const paths = (0, useStackedBarPaths_1.useStackedBarPaths)({
        points,
        chartBounds,
        innerPadding,
        barWidth,
        barCount,
        barOptions,
        colors,
    });
    return paths.map((p) => {
        return React.createElement(animate ? AnimatedPath_1.AnimatedPath : react_native_skia_1.Path, Object.assign(Object.assign(Object.assign({}, p), { style: "fill" }), (Boolean(animate) && { animate })));
    });
};
exports.StackedBar = StackedBar;
