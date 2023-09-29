import * as React from "react";
import { line } from "d3-shape";
import { Skia } from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { stitchDataArray } from "../../utils/stitchDataArray";
import { CURVES, type CurveType } from "../utils/curves";
import { groupPointsArray } from "../../utils/groupPointsArray";

export type LinePathOptions = {
  curveType?: CurveType;
};

export const useLinePath = (
  points: PointsArray,
  { curveType = "linear" }: LinePathOptions = {},
) => {
  const path = React.useMemo(() => {
    const groups = groupPointsArray(points);
    const p = Skia.Path.Make();

    groups.forEach((group) => {
      const svgPath = line().curve(CURVES[curveType])(stitchDataArray(group));
      if (!svgPath) return;

      p.addPath(Skia.Path.MakeFromSVGString(svgPath) ?? Skia.Path.Make());
    });

    return p;
  }, [points, curveType]);

  return { path };
};
