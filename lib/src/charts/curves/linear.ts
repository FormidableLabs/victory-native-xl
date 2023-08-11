import { Skia } from "@shopify/react-native-skia";
import type { CurveInterpolator } from "./curveTypes";

/**
 * Create a linear path given x/y values.
 */
export const makeLinearPath: CurveInterpolator = (xValues, yValues, x, y) => {
  "worklet";

  const path = Skia.Path.Make();
  if (!xValues.length) return path;

  path.moveTo(x(xValues[0]!), y(yValues[0]!));
  let yVal = 0 as number | undefined;
  xValues.forEach((val, i) => {
    yVal = yValues[i];
    yVal !== undefined && path.lineTo(x(val), y(yVal));
  });

  return path;
};
