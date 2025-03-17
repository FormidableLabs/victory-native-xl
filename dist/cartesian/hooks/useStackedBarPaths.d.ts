import React from "react";
import { type Color, type PathProps, type SkPath } from "@shopify/react-native-skia";
import { type RoundedCorners } from "../../utils/createRoundedRectPath";
import type { ChartBounds, PointsArray } from "../../types";
type CustomizablePathProps = Partial<Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">>;
export type StackedBarPath = {
    path: SkPath;
    key: string;
    color?: Color;
} & CustomizablePathProps & {
    children?: React.ReactNode;
};
type Props = {
    points: PointsArray[];
    chartBounds: ChartBounds;
    innerPadding?: number;
    barWidth?: number;
    barCount?: number;
    colors?: Color[];
    barOptions?: ({ columnIndex, rowIndex, isBottom, isTop, }: {
        isBottom: boolean;
        isTop: boolean;
        columnIndex: number;
        rowIndex: number;
    }) => CustomizablePathProps & {
        roundedCorners?: RoundedCorners;
    };
};
export declare const useStackedBarPaths: ({ points, chartBounds, innerPadding, barWidth: customBarWidth, barCount, barOptions, colors, }: Props) => StackedBarPath[];
export {};
