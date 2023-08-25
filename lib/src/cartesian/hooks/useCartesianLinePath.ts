import * as React from "react";
import type { CurveType, PointsArray } from "victory-native";
import { line } from "d3-shape";
import { Skia } from "@shopify/react-native-skia";
import { stitchDataArray } from "../../utils/stitch";
import { CURVES } from "../utils/curves";

export type CartesianLineOptions = {
  curveType?: CurveType;
};

export const useCartesianLinePath = (
  points: PointsArray,
  { curveType = "linear" }: CartesianLineOptions,
) => {
  return React.useMemo(() => {
    const svgPath = line().curve(CURVES[curveType])(stitchDataArray(points));
    if (!svgPath) return Skia.Path.Make();

    return Skia.Path.MakeFromSVGString(svgPath) ?? Skia.Path.Make();
  }, [points, curveType]);
};
