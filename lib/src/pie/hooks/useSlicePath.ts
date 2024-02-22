import { Skia, type SkPath } from "@shopify/react-native-skia";
import { useMemo } from "react";
import {
  calculatePointOnCircumference,
  degreesToRadians,
} from "../utils/radians";
import type { PieSliceData } from "../PieSlice";

type SlicePathArgs = {
  inset?: number;
  slice: PieSliceData;
};
export const useSlicePath = ({ slice }: SlicePathArgs): SkPath => {
  const path = useMemo(() => {
    const { radius, center } = slice;

    const path = Skia.Path.Make();

    // Convert angles to radians
    const startRadians = degreesToRadians(slice.startAngle);

    // Calculate the points on the circumference for the start and end angles
    const startPoint = calculatePointOnCircumference(
      center,
      radius,
      startRadians,
    );

    if (slice.sliceIsEntireCircle) {
      // If there's only one data point, draw the entire circle
      path.addOval(
        Skia.XYWHRect(
          center.x - radius,
          center.y - radius,
          radius * 2,
          radius * 2,
        ),
      );
    } else {
      // Move to the center of the pie
      path.moveTo(center.x, center.y);

      // Line to the start point
      path.lineTo(startPoint.x, startPoint.y);

      // Draw the arc
      path.arcToOval(
        Skia.XYWHRect(
          center.x - radius,
          center.y - radius,
          radius * 2,
          radius * 2,
        ),
        slice.startAngle,
        slice.endAngle - slice.startAngle,
        false,
      );

      // Line back to the center
      path.lineTo(center.x, center.y);
    }

    // Close the path
    path.close();
    return path;
  }, [slice]);

  return path;
};
