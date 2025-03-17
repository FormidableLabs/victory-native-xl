import * as React from "react";
import { type Color, type PathProps } from "@shopify/react-native-skia";
import type { PropsWithChildren } from "react";
import type { ChartBounds, PointsArray } from "../../types";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";
import { type RoundedCorners } from "../../utils/createRoundedRectPath";
type CustomizablePathProps = Partial<Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">>;
type CartesianStackedBarProps = {
    points: PointsArray[];
    chartBounds: ChartBounds;
    innerPadding?: number;
    animate?: PathAnimationConfig;
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
export declare const StackedBar: ({ points, chartBounds, animate, innerPadding, barWidth, barCount, barOptions, colors, }: PropsWithChildren<CartesianStackedBarProps>) => React.FunctionComponentElement<{
    path: import("@shopify/react-native-skia").SkPath;
} & Omit<import("@shopify/react-native-skia").AnimatedProps<PathProps, never>, "start" | "end"> & {
    start?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
    end?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
} & {
    animate?: PathAnimationConfig | undefined;
}>[];
export {};
