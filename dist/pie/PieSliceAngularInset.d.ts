import React from "react";
import { type Color, type PathProps } from "@shopify/react-native-skia";
import type { PathAnimationConfig } from "../hooks/useAnimatedPath";
export type PieSliceAngularInsetData = {
    angularStrokeWidth: number;
    angularStrokeColor: Color;
};
type AdditionalPathProps = Partial<Omit<PathProps, "color" | "path">> & {
    animate?: PathAnimationConfig;
};
type PieSliceAngularInsetProps = {
    angularInset: PieSliceAngularInsetData;
} & AdditionalPathProps;
export declare const PieSliceAngularInset: (props: PieSliceAngularInsetProps) => React.JSX.Element | null;
export {};
