import * as React from "react";
import type { CurveType, PointsArray } from "victory-native";
import { area } from "d3-shape";
import { CURVES } from "../utils/makeCartesianPath";
import { Skia } from "@shopify/react-native-skia";
import { stitchDataArray } from "../../utils/stitch";
import type { ScaleLinear } from "d3-scale";

export type CartesianAreaOptions = {
  curveType?: CurveType;
};

export const useCartesianAreaPath = (
  data: PointsArray,
  yScale: ScaleLinear<number, number>,
  { curveType = "linear" }: CartesianAreaOptions,
) => {
  return React.useMemo(() => {
    const svgPath = area()
      .y0(yScale.range()[1] || 0)
      ?.curve(CURVES[curveType])(stitchDataArray(data));
    if (!svgPath) return Skia.Path.Make();

    return Skia.Path.MakeFromSVGString(svgPath) ?? Skia.Path.Make();
  }, [data, curveType]);
};
