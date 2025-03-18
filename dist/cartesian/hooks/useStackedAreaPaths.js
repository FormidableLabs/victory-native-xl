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
exports.useStackedAreaPaths = void 0;
const React = __importStar(require("react"));
const d3_shape_1 = require("d3-shape");
const react_native_skia_1 = require("@shopify/react-native-skia");
const stitchDataArray_1 = require("../../utils/stitchDataArray");
const curves_1 = require("../utils/curves");
const groupPointsArray_1 = require("../../utils/groupPointsArray");
// Utility to calculate cumulative offsets, subtracting each layer from the previous one
const calculateOffsets = (pointsArray, y0) => {
    const offsets = pointsArray.map(() => []);
    if (!pointsArray[0])
        return offsets;
    // Start by initializing the first layer with y0 as the baseline
    if (pointsArray.length === 0 || !pointsArray[0])
        return offsets;
    offsets[0] = pointsArray[0].map(() => 0);
    // For each subsequent layer, subtract from the previous layer's y0 to stack upwards (towards 0, aka the "top of the screen")
    for (let layerIndex = 1; layerIndex < pointsArray.length; layerIndex++) {
        const currentPoints = pointsArray[layerIndex];
        const previousPoints = pointsArray[layerIndex - 1];
        if (!currentPoints || !previousPoints)
            continue;
        offsets[layerIndex] = currentPoints.map((_, i) => {
            var _a, _b, _c, _d;
            const accumulatedOffset = (_b = (_a = offsets[layerIndex - 1]) === null || _a === void 0 ? void 0 : _a[i]) !== null && _b !== void 0 ? _b : 0;
            const previousHeightOfPoint = (_d = (_c = previousPoints[i]) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0;
            // The offset is calculated by starting at the y0 (the bottom-most line of the chart) and then subtract the preceding point's height combined with the accumlation of these values
            // For example:
            // If we had something like { x: 0, high: 5, med: 4, low: 3 } as a data point and passed this in like points={[points.low, points.med, points.high]}
            // "low" is not offset by anything other than y0, since it is the first area drawn
            // "med" needs to be offset by the height of y0 and "low"'s height
            // "high" needs to be offset by the height of y0, and "low"'s and "med"'s heights combined.
            const offsetBy = y0 - previousHeightOfPoint + accumulatedOffset;
            return offsetBy;
        });
    }
    return offsets;
};
// Main hook to generate the stacked area paths for an inverted coordinate system
const useStackedAreaPaths = ({ pointsArray, colors, y0, curveType = "linear", areaOptions = () => ({}), }) => {
    const paths = React.useMemo(() => {
        const offsets = calculateOffsets(pointsArray, y0);
        return pointsArray.map((points, layerIndex) => {
            const path = react_native_skia_1.Skia.Path.Make();
            const groups = (0, groupPointsArray_1.groupPointsArray)(points);
            let lowestPointOfLayer = y0;
            let highestPointOfLayer = 0;
            groups.forEach((group) => {
                var _a, _b;
                // Stitch the data into [x, y] tuples and adjust for stacking
                const stitchedData = (0, stitchDataArray_1.stitchDataArray)(group).map(([x, y], i) => {
                    var _a, _b;
                    const offset = (_b = (_a = offsets[layerIndex]) === null || _a === void 0 ? void 0 : _a[i]) !== null && _b !== void 0 ? _b : 0;
                    const newY = y - offset;
                    return [x, newY];
                });
                lowestPointOfLayer = Math.max(...((_a = offsets[layerIndex]) !== null && _a !== void 0 ? _a : []).map((num) => y0 - num));
                highestPointOfLayer = Math.max(...stitchedData.map((tuple) => tuple[1]));
                // Generate the area path using d3-shape
                const svgPath = (0, d3_shape_1.area)()
                    .y0((_, i) => {
                    var _a, _b;
                    const offset = (_b = (_a = offsets[layerIndex]) === null || _a === void 0 ? void 0 : _a[i]) !== null && _b !== void 0 ? _b : 0;
                    return y0 - offset; // The bottom of the current area
                })
                    .curve(curves_1.CURVES[curveType])(stitchedData);
                if (svgPath) {
                    path.addPath((_b = react_native_skia_1.Skia.Path.MakeFromSVGString(svgPath)) !== null && _b !== void 0 ? _b : react_native_skia_1.Skia.Path.Make());
                }
            });
            const options = areaOptions({
                rowIndex: layerIndex,
                lowestY: lowestPointOfLayer,
                highestY: highestPointOfLayer,
            });
            return Object.assign({ path, key: `area-${layerIndex}`, color: colors[layerIndex] }, options);
        });
    }, [pointsArray, y0, curveType, colors, areaOptions]);
    return paths;
};
exports.useStackedAreaPaths = useStackedAreaPaths;
