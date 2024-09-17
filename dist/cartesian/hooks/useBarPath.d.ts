import { type RoundedCorners } from "../../utils/createRoundedRectPath";
import type { ChartBounds, PointsArray } from "../../types";
export declare const useBarPath: (points: PointsArray, chartBounds: ChartBounds, innerPadding?: number, roundedCorners?: RoundedCorners, customBarWidth?: number, barCount?: number) => {
    path: import("@shopify/react-native-skia").SkPath;
    barWidth: number;
};
