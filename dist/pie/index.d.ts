import { type PieSliceData } from "./PieSlice";
declare const Pie: {
    Chart: (props: {
        children?: (args: {
            slice: PieSliceData;
        }) => React.ReactNode;
        innerRadius?: number | string;
        circleSweepDegrees?: number;
        startAngle?: number;
        size?: number;
    }) => import("react").JSX.Element[];
    Slice: ({ children, animate, ...rest }: Partial<Omit<import("@shopify/react-native-skia").PathProps, "path" | "color">> & {
        label?: import("./PieLabel").PieLabelProps;
        animate?: import("../hooks/useAnimatedPath").PathAnimationConfig;
    }) => import("react").JSX.Element;
    Label: ({ font, radiusOffset, color, text, children, }: import("./PieLabel").PieLabelProps) => string | number | boolean | Iterable<import("react").ReactNode> | import("react").JSX.Element | null | undefined;
    SliceAngularInset: (props: {
        angularInset: import("./PieSliceAngularInset").PieSliceAngularInsetData;
    } & Partial<Omit<import("@shopify/react-native-skia").PathProps, "path" | "color">> & {
        animate?: import("../hooks/useAnimatedPath").PathAnimationConfig;
    }) => import("react").JSX.Element | null;
};
export { Pie, type PieSliceData };
