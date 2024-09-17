import React from "react";
import { type Color, type PathProps } from "@shopify/react-native-skia";
export type PieSliceAngularInsetData = {
    angularStrokeWidth: number;
    angularStrokeColor: Color;
};
type AdditionalPathProps = Partial<Omit<PathProps, "color" | "path">>;
type PieSliceAngularInsetProps = {
    angularInset: PieSliceAngularInsetData;
} & AdditionalPathProps;
export declare const PieSliceAngularInset: (props: PieSliceAngularInsetProps) => React.JSX.Element | null;
export {};
