"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSliceAngularInsetPath = void 0;
const react_native_skia_1 = require("@shopify/react-native-skia");
const react_1 = require("react");
const radians_1 = require("../utils/radians");
const useSliceAngularInsetPath = ({ angularInset, slice, }) => {
    const [path, paint] = (0, react_1.useMemo)(() => {
        const { radius, center, innerRadius } = slice;
        const path = react_native_skia_1.Skia.Path.Make();
        // Convert angles to radians for calculations
        const startRadians = (0, radians_1.degreesToRadians)(slice.startAngle);
        const endRadians = (0, radians_1.degreesToRadians)(slice.endAngle);
        if (innerRadius > 0) {
            // Calculate start and end points on the inner circumference
            const startPointInnerRadius = (0, radians_1.calculatePointOnCircumference)(center, innerRadius, startRadians);
            const endPointInnerRadius = (0, radians_1.calculatePointOnCircumference)(center, innerRadius, endRadians);
            //  Calculate start and end points on the outer circumference
            const startPointOuterRadius = (0, radians_1.calculatePointOnCircumference)(center, radius, startRadians);
            const endPointOuterRadius = (0, radians_1.calculatePointOnCircumference)(center, radius, endRadians);
            // Move to center, draw line to start point, move to center, draw line to end point
            path.moveTo(startPointInnerRadius.x, startPointInnerRadius.y);
            path.lineTo(startPointOuterRadius.x, startPointOuterRadius.y);
            path.moveTo(endPointInnerRadius.x, endPointInnerRadius.y);
            path.lineTo(endPointOuterRadius.x, endPointOuterRadius.y);
        }
        else {
            // Calculate start and end points on the circumference
            const startPoint = (0, radians_1.calculatePointOnCircumference)(center, radius, startRadians);
            const endPoint = (0, radians_1.calculatePointOnCircumference)(center, radius, endRadians);
            // Move to center, draw line to start point, move to center, draw line to end point
            path.moveTo(center.x, center.y);
            path.lineTo(startPoint.x, startPoint.y);
            path.moveTo(center.x, center.y);
            path.lineTo(endPoint.x, endPoint.y);
        }
        // Create Paint for inset
        const insetPaint = react_native_skia_1.Skia.Paint();
        insetPaint.setColor(react_native_skia_1.Skia.Color(angularInset.angularStrokeColor));
        insetPaint.setStyle(react_native_skia_1.PaintStyle.Stroke);
        insetPaint.setStrokeWidth(angularInset.angularStrokeWidth);
        return [path, insetPaint];
    }, [slice, angularInset]);
    return [path, paint];
};
exports.useSliceAngularInsetPath = useSliceAngularInsetPath;
