import React from "react";
import { type Color, type PathProps, type SkPoint } from "@shopify/react-native-skia";
import type { PieLabelProps } from "./PieLabel";
import type { PathAnimationConfig } from "../hooks/useAnimatedPath";
export type PieSliceData = {
    center: SkPoint;
    color: Color;
    endAngle: number;
    innerRadius: number;
    label: string;
    radius: number;
    sliceIsEntireCircle: boolean;
    startAngle: number;
    sweepAngle: number;
    value: number;
};
type AdditionalPathProps = Partial<Omit<PathProps, "color" | "path">>;
type PieSliceProps = AdditionalPathProps & {
    label?: PieLabelProps;
    animate?: PathAnimationConfig;
};
export declare const PieSlice: ({ children, animate, ...rest }: PieSliceProps) => React.JSX.Element;
export {};
