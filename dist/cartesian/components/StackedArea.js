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
exports.StackedArea = void 0;
const React = __importStar(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const AnimatedPath_1 = require("./AnimatedPath");
const useStackedAreaPaths_1 = require("../hooks/useStackedAreaPaths");
const DEFAULT_COLORS = ["red", "orange", "yellow", "green", "blue", "purple"];
function StackedArea({ points, y0, animate, curveType, colors = DEFAULT_COLORS, areaOptions, }) {
    const paths = (0, useStackedAreaPaths_1.useStackedAreaPaths)({
        pointsArray: points,
        colors,
        y0,
        curveType,
        areaOptions,
    });
    return paths.map((p) => {
        return React.createElement(animate ? AnimatedPath_1.AnimatedPath : react_native_skia_1.Path, Object.assign(Object.assign({}, p), (Boolean(animate) && { animate })));
    });
}
exports.StackedArea = StackedArea;
