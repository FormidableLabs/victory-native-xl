import * as React from "react";
import { type PathProps, type SkiaDefaultProps } from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";
export type ScatterShape = "circle" | "square" | "star";
type ScatterProps = {
    points: PointsArray;
    animate?: PathAnimationConfig;
    radius?: number | ((pt: PointsArray[number]) => number);
    shape?: ScatterShape;
} & SkiaDefaultProps<Pick<PathProps, "style" | "color" | "blendMode" | "opacity" | "antiAlias" | "start" | "end" | "strokeWidth" | "stroke" | "strokeJoin" | "strokeCap">, "start" | "end">;
export declare function Scatter({ points, animate, radius, shape, ...rest }: React.PropsWithChildren<ScatterProps>): React.FunctionComponentElement<{
    path: import("@shopify/react-native-skia").SkPath;
} & Omit<import("@shopify/react-native-skia").AnimatedProps<PathProps, never>, "start" | "end"> & {
    start?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
    end?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
} & {
    animate?: PathAnimationConfig;
}>;
export {};
