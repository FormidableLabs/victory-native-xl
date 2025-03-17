import React from "react";
import { type Color, type SkFont } from "@shopify/react-native-skia";
import type { ChartBounds, PointsArray } from "../../types";
export type BarLabelConfig = {
    position: "top" | "bottom" | "left" | "right";
    font: SkFont | null;
    color?: Color;
};
type BarGraphLabelProps = {
    points: PointsArray;
    chartBounds: ChartBounds;
    barWidth?: number;
    options: BarLabelConfig;
};
export declare const BarGraphLabels: ({ points, chartBounds, barWidth, options, }: BarGraphLabelProps) => React.JSX.Element[];
export {};
