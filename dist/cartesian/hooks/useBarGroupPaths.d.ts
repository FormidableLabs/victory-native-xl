import type { ChartBounds, PointsArray } from "../../types";
import { type RoundedCorners } from "../../utils/createRoundedRectPath";
export declare const useBarGroupPaths: (points: PointsArray[], chartBounds: ChartBounds, betweenGroupPadding?: number, withinGroupPadding?: number, roundedCorners?: RoundedCorners, customBarWidth?: number, barCount?: number) => {
    barWidth: number;
    groupWidth: number;
    gapWidth: number;
    paths: import("@shopify/react-native-skia").SkPath[];
};
