import { type CurveInterpolator } from "./curveTypes";
import { Skia } from "@shopify/react-native-skia";

/**
 * TODO: There are a ton of ! here.
 * In the case where a y-value is undefined, I think this might throw. Need
 *   to come back to this and deal with that.
 */

/*computes control points given knots K, this is the brain of the operation*/
function computeControlPoints(K: number[]) {
  "worklet";

  const p1 = [];
  const p2 = [];
  const n = K.length - 1;

  /*rhs vector*/
  const a = [0],
    b = [2],
    c = [1],
    r = [K[0]! + 2 * K[1]!];

  /*internal segments*/
  for (let i = 1; i < n - 1; i++) {
    a[i] = 1;
    b[i] = 4;
    c[i] = 1;
    r[i] = 4 * K[i]! + 2 * K[i + 1]!;
  }

  /*right segment*/
  a[n - 1] = 2;
  b[n - 1] = 7;
  c[n - 1] = 0;
  r[n - 1] = 8 * K[n - 1]! + K[n]!;

  /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
  for (let i = 1; i < n; i++) {
    const m = a[i]! / b[i - 1]!;
    b[i] = b[i]! - m * c[i - 1]!;
    r[i] = r[i]! - m * r[i - 1]!;
  }

  p1[n - 1] = r[n - 1]! / b[n - 1]!;
  for (let i = n - 2; i >= 0; --i) p1[i] = (r[i]! - c[i]! * p1[i + 1]!) / b[i]!;

  /*we have p1, now compute p2*/
  for (let i = 0; i < n - 1; i++) p2[i] = 2 * K[i + 1]! - p1[i + 1]!;

  p2[n - 1] = 0.5 * (K[n]! + p1[n - 1]!);

  return [p1, p2];
}

export const makeNaturalCurve: CurveInterpolator = (xValues, yValues, x, y) => {
  "worklet";

  const path = Skia.Path.Make();
  if (!xValues.length) return path;

  path.moveTo(x(xValues[0]!), y(yValues[0]!));

  const px = computeControlPoints(xValues),
    py = computeControlPoints(yValues);

  for (let i0 = 0, i1 = 1; i1 < xValues.length; ++i0, ++i1) {
    path.cubicTo(
      x(px[0]![i0]!),
      y(py[0]![i0]!),
      x(px[1]![i0]!),
      y(py[1]![i0]!),
      x(xValues[i1]!),
      y(yValues[i1]!),
    );
  }

  return path;
};
