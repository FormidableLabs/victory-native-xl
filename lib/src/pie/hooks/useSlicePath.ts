import { FillType, Skia, type SkPath } from "@shopify/react-native-skia";
import { useMemo } from "react";
import type { PieSliceData } from "../PieSlice";

type SlicePathArgs = {
  slice: PieSliceData;
};
export const useSlicePath = ({ slice }: SlicePathArgs): SkPath => {
  const path = useMemo(() => {
    const { radius, center, startAngle, endAngle, innerRadius } = slice;

    const path = Skia.Path.Make();

    // Draw the outer arc
    path.arcToOval(
      Skia.XYWHRect(
        center.x - radius,
        center.y - radius,
        radius * 2,
        radius * 2,
      ),
      startAngle,
      endAngle - startAngle,
      false,
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
    }

    if (innerRadius > 0) {
      if (slice.sliceIsEntireCircle) {
        path.addOval(
          Skia.XYWHRect(
            center.x - innerRadius,
            center.y - innerRadius,
            innerRadius * 2,
            innerRadius * 2,
          ),
        );
        path.setFillType(FillType.EvenOdd);
      } else {
        // Draw the inner arc in reverse
        path.arcToOval(
          Skia.XYWHRect(
            center.x - innerRadius,
            center.y - innerRadius,
            innerRadius * 2,
            innerRadius * 2,
          ),
          endAngle,
          startAngle - endAngle,
          false,
        );
      }
    } else {
      // If no inner radius, just draw a line back to the center (traditional pie slice)
      path.lineTo(center.x, center.y);
    }

    return path;
  }, [slice]);

  return path;
};
