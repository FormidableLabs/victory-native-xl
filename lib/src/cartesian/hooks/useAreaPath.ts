import * as React from "react";
import { area } from "d3-shape";
import { Skia } from "@shopify/react-native-skia";
import { stitchDataArray } from "../../utils/stitchDataArray";
import type { PointsArray } from "../../types";
import type { CurveType } from "../utils/curves";
import { CURVES } from "../utils/curves";
import { groupPointsArray } from "../../utils/groupPointsArray";

export type AreaPathOptions = {
  curveType?: CurveType;
};

export const useAreaPath = (
  points: PointsArray,
  y0: number,
  { curveType = "linear" }: AreaPathOptions = {},
) => {
  const path = React.useMemo(() => {
    const groups = groupPointsArray(points);
    const p = Skia.Path.Make();

    groups.forEach((group) => {
      const svgPath = area().y0(y0)?.curve(CURVES[curveType])(
        stitchDataArray(group),
      );
      if (!svgPath) return;

      p.addPath(Skia.Path.MakeFromSVGString(svgPath) ?? Skia.Path.Make());
    });

    return p;
  }, [points, curveType, y0]);

  return { path };
};
