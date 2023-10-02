import * as React from "react";
import { line } from "d3-shape";
import { Skia } from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { stitchDataArray } from "../../utils/stitchDataArray";
import { CURVES, type CurveType } from "../utils/curves";
import { groupPointsArray } from "../../utils/groupPointsArray";
import { cleanPointsArray } from "../../utils/cleanPointsArray";

export type LinePathOptions = {
  curveType?: CurveType;
  interpolateMissingData?: boolean;
};

export const useLinePath = (
  points: PointsArray,
  {
    curveType = "linear",
    interpolateMissingData = false,
  }: LinePathOptions = {},
) => {
  const path = React.useMemo(() => {
    const groups = interpolateMissingData
      ? [cleanPointsArray(points)]
      : groupPointsArray(points);
    const p = Skia.Path.Make();

    groups.forEach((group) => {
      const svgPath = line().curve(CURVES[curveType])(stitchDataArray(group));
      if (!svgPath) return;

      p.addPath(Skia.Path.MakeFromSVGString(svgPath) ?? Skia.Path.Make());
    });

    return p;
  }, [interpolateMissingData, points, curveType]);

  return { path };
};
