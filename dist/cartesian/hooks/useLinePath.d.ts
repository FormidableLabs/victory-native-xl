import type { PointsArray } from "../../types";
import { type CurveType } from "../utils/curves";
export type LinePathOptions = {
    curveType?: CurveType;
    connectMissingData?: boolean;
};
export declare const useLinePath: (points: PointsArray, { curveType, connectMissingData }?: LinePathOptions) => {
    path: import("@shopify/react-native-skia").SkPath;
};
