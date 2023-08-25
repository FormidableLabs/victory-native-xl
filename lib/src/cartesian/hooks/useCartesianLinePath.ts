import * as React from "react";
import type { CurveType, PointsArray } from "victory-native";
import { line } from "d3-shape";
import { CURVES } from "../utils/makeCartesianPath";
import { Skia } from "@shopify/react-native-skia";
import { stitchDataArray } from "../../utils/stitch";

export type CartesianLineOptions = {
  curveType?: CurveType;
};

export const useCartesianLinePath = (
  data: PointsArray,
  { curveType = "linear" }: CartesianLineOptions,
) => {
  return React.useMemo(() => {
    const svgPath = line().curve(CURVES[curveType])(stitchDataArray(data));
    if (!svgPath) return Skia.Path.Make();

    return Skia.Path.MakeFromSVGString(svgPath) ?? Skia.Path.Make();
  }, [data, curveType]);
};
