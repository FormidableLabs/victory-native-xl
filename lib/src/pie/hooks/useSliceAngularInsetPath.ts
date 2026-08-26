import { Skia } from "@shopify/react-native-skia";
import { useMemo } from "react";
import {
  calculatePointOnCircumference,
  degreesToRadians,
} from "../utils/radians";
import type { PieSliceData } from "../PieSlice";

type SliceAngularInsetPathArgs = {
  slice: PieSliceData;
};
export const useSliceAngularInsetPath = ({
  slice,
}: SliceAngularInsetPathArgs) => {
  const path = useMemo(() => {
    const { radius, center, innerRadius } = slice;

    const builder = Skia.PathBuilder.Make();

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
      builder.moveTo(startPointInnerRadius.x, startPointInnerRadius.y);
      builder.lineTo(startPointOuterRadius.x, startPointOuterRadius.y);
      builder.moveTo(endPointInnerRadius.x, endPointInnerRadius.y);
      builder.lineTo(endPointOuterRadius.x, endPointOuterRadius.y);
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
      builder.moveTo(center.x, center.y);
      builder.lineTo(startPoint.x, startPoint.y);
      builder.moveTo(center.x, center.y);
      builder.lineTo(endPoint.x, endPoint.y);
    }

    return path;
  }, [slice]);

  return path;
};
