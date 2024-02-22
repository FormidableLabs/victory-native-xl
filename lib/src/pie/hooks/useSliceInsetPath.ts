import { Skia, PaintStyle } from "@shopify/react-native-skia";
import { useMemo } from "react";
import {
  calculatePointOnCircumference,
  degreesToRadians,
} from "../utils/radians";
import type { PieSliceData } from "../PieSlice";
import type { PieSliceInsetData } from "../PieSliceInset";

type SliceInsetPathArgs = {
  slice: PieSliceData;
  inset: PieSliceInsetData;
};
export const useSliceInsetPath = ({ inset, slice }: SliceInsetPathArgs) => {
  const [path, paint] = useMemo(() => {
    const { radius, center } = slice;

    const path = Skia.Path.Make();

    // Convert angles to radians for calculation
    const startRadians = degreesToRadians(slice.startAngle);
    const endRadians = degreesToRadians(slice.endAngle);

    // Calculate start and end points on the circumference
    const startPoint = calculatePointOnCircumference(
      center,
      radius,
      startRadians,
    );
    const endPoint = calculatePointOnCircumference(center, radius, endRadians);

    // Move to center, draw line to start point, move to center, draw line to end point
    path.moveTo(center.x, center.y);
    path.lineTo(startPoint.x, startPoint.y);
    path.moveTo(center.x, center.y);
    path.lineTo(endPoint.x, endPoint.y);

    // Create Paint for inset
    const insetPaint = Skia.Paint();
    insetPaint.setColor(Skia.Color(inset.color));
    insetPaint.setStyle(PaintStyle.Stroke);
    insetPaint.setStrokeWidth(inset.width);

    return [path, insetPaint] as const;
  }, [slice, inset]);

  return [path, paint] as const;
};
