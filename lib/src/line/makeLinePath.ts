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

/**
 * TODO: add more from here https://d3js.org/d3-shape/curve
 *  Might stick to only curves that pass thru points.
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

export const makeLinePath = (
  curveType: CurveType,
  ox: number[],
  oy: number[],
  { type, y0 }: { type: "line" | "area"; y0: number },
) => {
  return (type === "line" ? line() : area().y0(y0)).curve(CURVES[curveType])(
    stitch(ox, oy),
  )!;
};
