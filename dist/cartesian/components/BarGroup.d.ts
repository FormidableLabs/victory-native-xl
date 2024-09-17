import * as React from "react";
import { type PathProps, type SkPath } from "@shopify/react-native-skia";
import type { ChartBounds, PointsArray } from "../../types";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";
import type { RoundedCorners } from "../../utils/createRoundedRectPath";
type BarGroupProps = {
    chartBounds: ChartBounds;
    betweenGroupPadding?: number;
    withinGroupPadding?: number;
    roundedCorners?: RoundedCorners;
    children: React.ReactElement[];
    barWidth?: number;
    barCount?: number;
    onBarSizeChange?: (values: {
        barWidth: number;
        groupWidth: number;
        gapWidth: number;
    }) => void;
};
export declare function BarGroup({ betweenGroupPadding, withinGroupPadding, chartBounds, roundedCorners, children, onBarSizeChange, barWidth: customBarWidth, barCount, }: BarGroupProps): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>[] | null;
export declare namespace BarGroup {
    var Bar: typeof BarGroupBar;
}
/**
 * Bar
 */
type BarGroupBarProps = {
    points: PointsArray;
    animate?: PathAnimationConfig;
} & Partial<Pick<PathProps, "color">>;
declare function BarGroupBar(props: React.PropsWithChildren<BarGroupBarProps>): React.FunctionComponentElement<{
    path: SkPath;
} & Omit<import("@shopify/react-native-skia").AnimatedProps<PathProps, never>, "start" | "end"> & {
    start?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
    end?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
} & {
    animate?: PathAnimationConfig | undefined;
}>;
export {};
