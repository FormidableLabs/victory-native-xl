import * as React from "react";
import { type PathProps, type SkiaDefaultProps } from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { type LinePathOptions } from "../hooks/useLinePath";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";
export type CartesianLinePathProps = {
    points: PointsArray;
    animate?: PathAnimationConfig;
} & LinePathOptions & SkiaDefaultProps<Pick<PathProps, "color" | "strokeWidth" | "strokeJoin" | "strokeCap" | "blendMode" | "strokeMiter" | "opacity" | "antiAlias" | "start" | "end">, "start" | "end">;
export declare function Line({ points, animate, curveType, connectMissingData, ...ops }: React.PropsWithChildren<CartesianLinePathProps>): React.FunctionComponentElement<{
    path: import("@shopify/react-native-skia").SkPath;
} & Omit<import("@shopify/react-native-skia").AnimatedProps<PathProps, never>, "start" | "end"> & {
    start?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
    end?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
} & {
    animate?: PathAnimationConfig;
}>;
