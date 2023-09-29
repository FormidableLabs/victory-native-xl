import * as React from "react";
import { line } from "d3-shape";
import { Skia } from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { stitchDataArray } from "../../utils/stitchDataArray";
import { CURVES, type CurveType } from "../utils/curves";

export type LinePathOptions = {
  curveType?: CurveType;
};

export const useLinePath = (
  points: PointsArray,
  { curveType = "linear" }: LinePathOptions = {},
) => {
  const path = React.useMemo(() => {
    const svgPath = line().curve(CURVES[curveType])(stitchDataArray(points));
    if (!svgPath) return Skia.Path.Make();

    return Skia.Path.MakeFromSVGString(svgPath) ?? Skia.Path.Make();
  }, [points, curveType]);

  return { path };
};
