import {
  curveBumpX,
  curveBumpY,
  curveCardinal,
  curveCatmullRom,
  curveLinear,
  curveMonotoneX,
  curveNatural,
  curveStep,
} from "d3-shape";

/**
 * Exposed curves from d3-shape.
 */
export const CURVES = {
  linear: curveLinear,
  natural: curveNatural,
  bumpX: curveBumpX,
  bumpY: curveBumpY,
  cardinal: curveCardinal,
  cardinal50: curveCardinal.tension(0.5),
  catmullRom: curveCatmullRom,
  catmullRom0: curveCatmullRom.alpha(0),
  catmullRom100: curveCatmullRom.alpha(1),
  monotoneX: curveMonotoneX,
  step: curveStep,
} as const;
export type CurveType = keyof typeof CURVES;
