import { type SkPath } from "@shopify/react-native-skia";

type TransformNumber = (x: number) => number;

export type CurveInterpolator = (
  xValues: number[],
  yValues: number[],
  x: TransformNumber,
  y: TransformNumber,
) => SkPath;
