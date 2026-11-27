import * as React from "react";
import { Skia } from "react-native-skia";
import type { PointsArray } from "../../types";
import type { CurveType } from "../utils/curves";
import { addAreaToPathBuilder, type DefinedPoint } from "../utils/chartPaths";
import { groupPointsArray } from "../../utils/groupPointsArray";
import { cleanPointsArray } from "../../utils/cleanPointsArray";

export type AreaPathOptions = {
  curveType?: CurveType;
  connectMissingData?: boolean;
};

export const useAreaPath = (
  points: PointsArray,
  y0: number,
  { curveType = "linear", connectMissingData = false }: AreaPathOptions = {},
) => {
  const path = React.useMemo(() => {
    // Both helpers only keep the points that have a y value.
    const groups = (
      connectMissingData ? [cleanPointsArray(points)] : groupPointsArray(points)
    ) as DefinedPoint[][];
    const builder = Skia.PathBuilder.Make();
    const baseline = () => y0;

    groups.forEach((group) => {
      addAreaToPathBuilder(builder, group, baseline, curveType);
    });

    return builder.detach();
  }, [connectMissingData, points, y0, curveType]);

  return { path };
};
