import { Point } from "../types";
import { SkPath } from "@shopify/react-native-skia";

type TransformNumber = (x: number) => number;

export type CurveInterpolator = (
  data: Point[],
  x: TransformNumber,
  y: TransformNumber,
) => SkPath;
