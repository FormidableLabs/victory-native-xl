import * as React from "react";
import { line } from "d3-shape";
import { Skia } from "@shopify/react-native-skia";
import { stitchDataArray } from "../../utils/stitchDataArray";
import { CURVES } from "../utils/curves";
import { groupPointsArray } from "../../utils/groupPointsArray";
import { cleanPointsArray } from "../../utils/cleanPointsArray";
export const useLinePath = (points, { curveType = "linear", connectMissingData = false } = {}) => {
    const path = React.useMemo(() => {
        const groups = connectMissingData
            ? [cleanPointsArray(points)]
            : groupPointsArray(points);
        const p = Skia.Path.Make();
        groups.forEach((group) => {
            const svgPath = line().curve(CURVES[curveType])(stitchDataArray(group));
            if (!svgPath)
                return;
            p.addPath(Skia.Path.MakeFromSVGString(svgPath) ?? Skia.Path.Make());
        });
        return p;
    }, [connectMissingData, points, curveType]);
    return { path };
};
