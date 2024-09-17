/// <reference types="react" />
import { type PieSliceData } from "./PieSlice";
declare const Pie: {
    Chart: (props: {
        children?: ((args: {
            slice: PieSliceData;
        }) => import("react").ReactNode) | undefined;
        innerRadius?: string | number | undefined;
        circleSweepDegrees?: number | undefined;
        startAngle?: number | undefined;
    }) => import("react").JSX.Element[];
    Slice: (props: Partial<Omit<import("@shopify/react-native-skia").PathProps, "path" | "color">>) => import("react").JSX.Element;
    SliceAngularInset: (props: {
        angularInset: import("./PieSliceAngularInset").PieSliceAngularInsetData;
    } & Partial<Omit<import("@shopify/react-native-skia").PathProps, "path" | "color">>) => import("react").JSX.Element | null;
};
export { Pie, type PieSliceData };
