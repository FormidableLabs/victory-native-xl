"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSlicePath = void 0;
const react_native_skia_1 = require("@shopify/react-native-skia");
const react_1 = require("react");
const useSlicePath = ({ slice }) => {
    const path = (0, react_1.useMemo)(() => {
        const { radius, center, startAngle, endAngle, innerRadius } = slice;
        const path = react_native_skia_1.Skia.Path.Make();
        // Draw the outer arc
        path.arcToOval(react_native_skia_1.Skia.XYWHRect(center.x - radius, center.y - radius, radius * 2, radius * 2), startAngle, endAngle - startAngle, false);
        if (slice.sliceIsEntireCircle) {
            // If there's only one data point, draw the entire circle
            path.addOval(react_native_skia_1.Skia.XYWHRect(center.x - radius, center.y - radius, radius * 2, radius * 2));
        }
        if (innerRadius > 0) {
            if (slice.sliceIsEntireCircle) {
                path.addOval(react_native_skia_1.Skia.XYWHRect(center.x - innerRadius, center.y - innerRadius, innerRadius * 2, innerRadius * 2));
                path.setFillType(react_native_skia_1.FillType.EvenOdd);
            }
            else {
                // Draw the inner arc in reverse
                path.arcToOval(react_native_skia_1.Skia.XYWHRect(center.x - innerRadius, center.y - innerRadius, innerRadius * 2, innerRadius * 2), endAngle, startAngle - endAngle, false);
            }
        }
        else {
            // If no inner radius, just draw a line back to the center (traditional pie slice)
            path.lineTo(center.x, center.y);
        }
        return path;
    }, [slice]);
    return path;
};
exports.useSlicePath = useSlicePath;
