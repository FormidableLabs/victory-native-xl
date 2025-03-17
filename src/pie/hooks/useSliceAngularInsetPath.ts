import { Skia, PaintStyle } from "@shopify/react-native-skia";
import { useMemo } from "react";
import {
  calculatePointOnCircumference,
  degreesToRadians,
} from "../utils/radians";
import type { PieSliceData } from "../PieSlice";
import type { PieSliceAngularInsetData } from "../PieSliceAngularInset";

type SliceAngularInsetPathArgs = {
  slice: PieSliceData;
  angularInset: PieSliceAngularInsetData;
};
export const useSliceAngularInsetPath = ({
  angularInset,
  slice,
}: SliceAngularInsetPathArgs) => {
  const [path, paint] = useMemo(() => {
    const { radius, center, innerRadius } = slice;

    const path = Skia.Path.Make();

    // Convert angles to radians for calculations
    const startRadians = degreesToRadians(slice.startAngle);
    const endRadians = degreesToRadians(slice.endAngle);

    if (innerRadius > 0) {
      // Calculate start and end points on the inner circumference
      const startPointInnerRadius = calculatePointOnCircumference(
        center,
        innerRadius,
        startRadians,
      );
      const endPointInnerRadius = calculatePointOnCircumference(
        center,
        innerRadius,
        endRadians,
      );
      //  Calculate start and end points on the outer circumference
      const startPointOuterRadius = calculatePointOnCircumference(
        center,
        radius,
        startRadians,
      );
      const endPointOuterRadius = calculatePointOnCircumference(
        center,
        radius,
        endRadians,
      );

      // Move to center, draw line to start point, move to center, draw line to end point
      path.moveTo(startPointInnerRadius.x, startPointInnerRadius.y);
      path.lineTo(startPointOuterRadius.x, startPointOuterRadius.y);
      path.moveTo(endPointInnerRadius.x, endPointInnerRadius.y);
      path.lineTo(endPointOuterRadius.x, endPointOuterRadius.y);
    } else {
      // Calculate start and end points on the circumference
      const startPoint = calculatePointOnCircumference(
        center,
        radius,
        startRadians,
      );
      const endPoint = calculatePointOnCircumference(
        center,
        radius,
        endRadians,
      );

      // Move to center, draw line to start point, move to center, draw line to end point
      path.moveTo(center.x, center.y);
      path.lineTo(startPoint.x, startPoint.y);
      path.moveTo(center.x, center.y);
      path.lineTo(endPoint.x, endPoint.y);
    }

    // Create Paint for inset
    const insetPaint = Skia.Paint();
    insetPaint.setColor(Skia.Color(angularInset.angularStrokeColor));
    insetPaint.setStyle(PaintStyle.Stroke);
    insetPaint.setStrokeWidth(angularInset.angularStrokeWidth);
    return [path, insetPaint] as const;
  }, [slice, angularInset]);

  return [path, paint] as const;
};
