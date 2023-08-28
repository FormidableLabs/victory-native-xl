import * as React from "react";
import { area } from "d3-shape";
import { Skia } from "@shopify/react-native-skia";
import { stitchDataArray } from "../../utils/stitch";
import type { PointsArray } from "../../types";
import type { CurveType } from "../utils/curves";
import { CURVES } from "../utils/curves";

export type CartesianAreaOptions = {
  curveType?: CurveType;
};

export const useCartesianAreaPath = (
  points: PointsArray,
  y0: number,
  { curveType = "linear" }: CartesianAreaOptions = {},
) => {
  return React.useMemo(() => {
    const svgPath = area().y0(y0)?.curve(CURVES[curveType])(
      stitchDataArray(points),
    );
    if (!svgPath) return Skia.Path.Make();

    return Skia.Path.MakeFromSVGString(svgPath) ?? Skia.Path.Make();
  }, [points, curveType, y0]);
};
