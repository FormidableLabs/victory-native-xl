import * as React from "react";
import { Skia } from "react-native-skia";
import type { PointsArray } from "../../types";
import { type CurveType } from "../utils/curves";
import { addLineToPathBuilder, type DefinedPoint } from "../utils/chartPaths";
import { groupPointsArray } from "../../utils/groupPointsArray";
import { cleanPointsArray } from "../../utils/cleanPointsArray";

export type LinePathOptions = {
  curveType?: CurveType;
  connectMissingData?: boolean;
};

export const useLinePath = (
  points: PointsArray,
  { curveType = "linear", connectMissingData = false }: LinePathOptions = {},
) => {
  const path = React.useMemo(() => {
    // Both helpers only keep the points that have a y value.
    const groups = (
      connectMissingData ? [cleanPointsArray(points)] : groupPointsArray(points)
    ) as DefinedPoint[][];
    const builder = Skia.PathBuilder.Make();

    groups.forEach((group) => {
      addLineToPathBuilder(builder, group, curveType);
    });

    return builder.detach();
  }, [connectMissingData, points, curveType]);

  return { path };
};
