import {
  area,
  curveBumpX,
  curveBumpY,
  curveCardinal,
  curveCatmullRom,
  curveLinear,
  curveNatural,
  curveStep,
  line,
} from "d3-shape";
import { stitch } from "../utils/stitch";
import { Skia } from "@shopify/react-native-skia";

/**
 * Exposed curves from d3-shape.
 */
const CURVES = {
  linear: curveLinear,
  natural: curveNatural,
  bumpX: curveBumpX,
  bumpY: curveBumpY,
  cardinal: curveCardinal,
  cardinal50: curveCardinal.tension(0.5),
  catmullRom: curveCatmullRom,
  catmullRom0: curveCatmullRom.alpha(0),
  catmullRom100: curveCatmullRom.alpha(1),
  step: curveStep,
} as const;

export type CurveType = keyof typeof CURVES;

/**
 * Generates a path from the given points.
 *  - Can be a line or area chart.
 *  - Can use one of the d3 curves defined above.
 */
export const makeCartesianPath = (
  ox: number[],
  oy: number[],
  {
    curveType,
    pathType,
    y0,
  }: { curveType: CurveType; pathType: "line" | "area"; y0: number },
) => {
  const svgPath = (pathType === "line" ? line() : area().y0(y0)).curve(
    CURVES[curveType],
  )(stitch(ox, oy));
  if (!svgPath) return Skia.Path.Make();

  return Skia.Path.MakeFromSVGString(svgPath) || Skia.Path.Make();
};
