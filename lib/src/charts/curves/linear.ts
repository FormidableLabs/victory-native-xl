// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Skia, type SkPath } from "@shopify/react-native-skia";

export const makeLinearPath: CurveInterpolator = (xValues, yValues, x, y) => {
  "worklet";

  const path = Skia.Path.Make();
  if (!xValues.length) return path;

  path.moveTo(x(xValues[0]), y(yValues[0]));
  xValues.forEach((val, i) => {
    path.lineTo(x(val), y(yValues[i]));
  });

  return path;
};

// export const makeCubicPath = (
//   data: Point[],
//   x: TransformNumber,
//   y: TransformNumber,
// ) => {
//   "worklet";
//
//   const path = Skia.Path.Make();
//   if (!data.length) return path;
//
//   path.moveTo(x(data[0].x), y(data[0].y));
//   for (let i = 1; i < data.length; i++) {
//     const p0 = data[i - 2] || data[i - 1];
//     const p1 = data[i - 1];
//     const p2 = data[i];
//
//     if (!p1) continue;
//
//     const cp1x = x((2 * p0.x + p1.x) / 3);
//     const cp1y = y((2 * p0.y + p1.y) / 3);
//     const cp2x = x((p0.x + 2 * p1.x) / 3);
//     const cp2y = y((p0.y + 2 * p1.y) / 3);
//     const cp3x = x((p0.x + 4 * p1.x + p2.x) / 6);
//     const cp3y = y((p0.y + 4 * p1.y + p2.y) / 6);
//
//     path.cubicTo(cp1x, cp1y, cp2x, cp2y, cp3x, cp3y);
//
//     if (i === data.length - 1) {
//       const endX = x(p2.x);
//       const endY = y(p2.y);
//       // path.cubicTo(endX, endY, x(p2.x + 1), endY, endX, endY);
//     }
//   }
//
//   return path;
// };

type TransformNumber = (x: number) => number;

type CurveInterpolator = (
  xValues: number[],
  yValues: number[],
  x: TransformNumber,
  y: TransformNumber,
) => SkPath;
