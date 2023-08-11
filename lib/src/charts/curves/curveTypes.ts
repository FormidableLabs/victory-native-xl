import { type Point } from "../../types";
import { type SkPath } from "@shopify/react-native-skia";

type TransformNumber = (x: number) => number;

export type CurveInterpolator = (
  data: Point[],
  x: TransformNumber,
  y: TransformNumber,
) => SkPath;
