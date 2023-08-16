import { curveLinear, curveNatural, line } from "d3-shape";
import { stitch } from "../utils/stitch";

/**
 * TODO: add more from here https://d3js.org/d3-shape/curve
 *  Might stick to only curves that pass thru points.
 */
const CURVES = {
  linear: curveLinear,
  natural: curveNatural,
} as const;

export type CurveType = keyof typeof CURVES;

export const makeLinePath = (
  curveType: CurveType,
  ox: number[],
  oy: number[],
) => {
  return line().curve(CURVES[curveType])(stitch(ox, oy))!;
};
