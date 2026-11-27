import { area, line } from "d3-shape";
import { Platform } from "react-native";
import type { SkPathBuilder } from "react-native-skia";
import { CURVES, type CurveType } from "./curves";
import {
  asD3Context,
  createPathBuilderContext,
  roundCoordinate,
} from "./pathBuilderContext";

/**
 * A point whose coordinates are both known, as opposed to the entries of a
 * `PointsArray`, where `y` is missing for gaps in the data.
 */
export type DefinedPoint = { x: number; y: number };

/**
 * On native, `addPoly` hands a whole polyline to Skia in a single JSI call.
 * On web, react-native-skia converts every point through temporary arrays
 * first, which is about twice as slow as issuing the commands one by one (see
 * `test/bench`), so that is what is done there.
 */
const USE_ADD_POLY = Platform.OS !== "web";

const getX = (point: DefinedPoint) => point.x;
const getY = (point: DefinedPoint) => point.y;

const roundPoint = (x: number, y: number): DefinedPoint => ({
  x: roundCoordinate(x),
  y: roundCoordinate(y),
});

const isFiniteNumber = (value: number) => Number.isFinite(value);

/**
 * Non-finite coordinates poison the whole Skia path, so a run that contains
 * any is skipped. This matches the SVG parser the paths used to go through,
 * which rejected such a run.
 */
const hasOnlyFinitePoints = (points: DefinedPoint[]) => {
  for (let i = 0; i < points.length; i++) {
    const point = points[i]!;
    if (!isFiniteNumber(point.x) || !isFiniteNumber(point.y)) return false;
  }
  return true;
};

/**
 * Appends a line through `points` to `builder` as a new contour.
 */
export const addLineToPathBuilder = (
  builder: SkPathBuilder,
  points: DefinedPoint[],
  curveType: CurveType,
  useAddPoly = USE_ADD_POLY,
) => {
  const count = points.length;
  if (count === 0 || !hasOnlyFinitePoints(points)) return;

  const context = createPathBuilderContext(builder);

  if (curveType === "linear") {
    if (count > 1 && useAddPoly) {
      builder.addPoly(
        points.map((point) => roundPoint(point.x, point.y)),
        false,
      );
    } else {
      const first = points[0]!;
      context.moveTo(first.x, first.y);
      for (let i = 1; i < count; i++) {
        const point = points[i]!;
        context.lineTo(point.x, point.y);
      }
      // A lone point is a closed zero length contour (as d3-shape emits it),
      // so that round and square stroke caps still draw it.
      if (count === 1) context.closePath();
    }
    return;
  }

  line<DefinedPoint>()
    .x(getX)
    .y(getY)
    .curve(CURVES[curveType])
    .context(asD3Context(context))(points);
};

/**
 * Appends the area between `points` and the baseline to `builder` as a new
 * closed contour. The baseline is `y0(i)` for the point at index `i`.
 */
export const addAreaToPathBuilder = (
  builder: SkPathBuilder,
  points: DefinedPoint[],
  y0: (index: number) => number,
  curveType: CurveType,
  useAddPoly = USE_ADD_POLY,
) => {
  const count = points.length;
  if (count === 0 || !hasOnlyFinitePoints(points)) return;

  const baseline: number[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const y = y0(i);
    if (!isFiniteNumber(y)) return;
    baseline[i] = y;
  }

  const context = createPathBuilderContext(builder);

  if (curveType === "linear") {
    // The points, then the baseline walked back from the last point to the
    // first.
    if (useAddPoly) {
      const outline = points.map((point) => roundPoint(point.x, point.y));
      for (let i = count - 1; i >= 0; i--) {
        outline.push(roundPoint(points[i]!.x, baseline[i]!));
      }
      builder.addPoly(outline, true);
    } else {
      const first = points[0]!;
      context.moveTo(first.x, first.y);
      for (let i = 1; i < count; i++) {
        const point = points[i]!;
        context.lineTo(point.x, point.y);
      }
      for (let i = count - 1; i >= 0; i--) {
        context.lineTo(points[i]!.x, baseline[i]!);
      }
      context.closePath();
    }
    return;
  }

  area<DefinedPoint>()
    .x(getX)
    .y1(getY)
    .y0((_, i) => baseline[i]!)
    .curve(CURVES[curveType])
    .context(asD3Context(context))(points);
};
