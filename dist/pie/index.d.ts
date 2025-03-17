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
        size?: number | undefined;
    }) => import("react").JSX.Element[];
    Slice: ({ children, animate, ...rest }: Partial<Omit<import("@shopify/react-native-skia").PathProps, "path" | "color">> & {
        label?: import("./PieLabel").PieLabelProps | undefined;
        animate?: import("../hooks/useAnimatedPath").PathAnimationConfig | undefined;
    }) => import("react").JSX.Element;
    Label: ({ font, radiusOffset, color, text, children, }: import("./PieLabel").PieLabelProps) => string | number | boolean | import("react").JSX.Element | Iterable<import("react").ReactNode> | null | undefined;
    SliceAngularInset: (props: {
        angularInset: import("./PieSliceAngularInset").PieSliceAngularInsetData;
    } & Partial<Omit<import("@shopify/react-native-skia").PathProps, "path" | "color">> & {
        animate?: import("../hooks/useAnimatedPath").PathAnimationConfig | undefined;
    }) => import("react").JSX.Element | null;
};
export { Pie, type PieSliceData };
