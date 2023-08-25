import { area, line } from "d3-shape";
import { stitch } from "../../utils/stitch";
import { Skia } from "@shopify/react-native-skia";
import type { ScatterOptions } from "../../types";
import type { CurveType } from "./curves";
import { CURVES } from "./curves";

/**
 * Path types supported by Cartesian chart.
 */
export const pathTypes = ["line", "area", "scatter"] as const;
export type PathType = (typeof pathTypes)[number];

/**
 * Generates a path from the given points.
 *  - Can be a line or area chart.
 *  - Can use one of the d3 curves defined above.
 */
export const makeCartesianPath = (
  ox: number[],
  oy: number[],
  {
    options,
    curveType,
    pathType,
    y0,
  }: {
    options: Record<string, unknown>;
    curveType: CurveType;
    pathType: PathType;
    y0: number;
  },
) => {
  let svgPath: string | null = null;

  if (pathType === "line")
    svgPath = line().curve?.(CURVES[curveType])(stitch(ox, oy));
  else if (pathType === "area")
    svgPath = area().y0(y0).curve?.(CURVES[curveType])(stitch(ox, oy));
  else if (pathType === "scatter") {
    const path = Skia.Path.Make();
    for (let i = 0; i < Math.min(ox.length, oy.length); i++) {
      const x = ox.at(i);
      const y = oy.at(i);
      y && x && path.addCircle(x, y, (<ScatterOptions>options).radius);
    }
    svgPath = path.toSVGString();
  }

  if (!svgPath) return Skia.Path.Make();

  return Skia.Path.MakeFromSVGString(svgPath) || Skia.Path.Make();
};
