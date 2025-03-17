import type { ChartBounds, PointsArray } from "../../types";
import type { RoundedCorners } from "../../utils/createRoundedRectPath";
type Props = {
    points: PointsArray | PointsArray[];
    chartBounds: ChartBounds;
    innerPadding: number;
    roundedCorners?: RoundedCorners;
    customBarWidth?: number;
    barCount?: number;
};
export declare const useBarWidth: ({ customBarWidth, chartBounds, innerPadding, barCount, points, }: Props) => number;
export {};
