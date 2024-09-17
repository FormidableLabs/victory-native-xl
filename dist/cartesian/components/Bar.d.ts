import * as React from "react";
import { type PathProps } from "@shopify/react-native-skia";
import type { PropsWithChildren } from "react";
import type { ChartBounds, PointsArray } from "../../types";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";
import type { RoundedCorners } from "../../utils/createRoundedRectPath";
type CartesianBarProps = {
    points: PointsArray;
    chartBounds: ChartBounds;
    innerPadding?: number;
    animate?: PathAnimationConfig;
    roundedCorners?: RoundedCorners;
    barWidth?: number;
    barCount?: number;
} & Partial<Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">>;
export declare const Bar: ({ points, chartBounds, animate, innerPadding, roundedCorners, barWidth, barCount, ...ops }: PropsWithChildren<CartesianBarProps>) => React.FunctionComponentElement<{
    path: import("@shopify/react-native-skia").SkPath;
} & Omit<import("@shopify/react-native-skia").AnimatedProps<PathProps, never>, "start" | "end"> & {
    start?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
    end?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
} & {
    animate?: PathAnimationConfig | undefined;
}>;
export {};
