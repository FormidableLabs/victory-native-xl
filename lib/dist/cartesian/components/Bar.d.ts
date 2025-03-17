import * as React from "react";
import { type PathProps } from "@shopify/react-native-skia";
import type { PropsWithChildren } from "react";
import type { ChartBounds, PointsArray } from "../../types";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";
import type { RoundedCorners } from "../../utils/createRoundedRectPath";
import { type BarLabelConfig } from "./BarGraphLabels";
type CartesianBarProps = {
    points: PointsArray;
    chartBounds: ChartBounds;
    innerPadding?: number;
    animate?: PathAnimationConfig;
    roundedCorners?: RoundedCorners;
    barWidth?: number;
    barCount?: number;
    labels?: BarLabelConfig;
} & Partial<Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">>;
export declare const Bar: ({ points, chartBounds, animate, innerPadding, roundedCorners, barWidth, barCount, labels, ...ops }: PropsWithChildren<CartesianBarProps>) => React.JSX.Element;
export {};
