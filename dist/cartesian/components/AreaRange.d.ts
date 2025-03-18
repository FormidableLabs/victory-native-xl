import * as React from "react";
import { type PathProps } from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { type AreaPathOptions } from "../hooks/useAreaPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";
export type AreaRangePointsArray = {
    x: number;
    xValue: PointsArray[number]["xValue"];
    y: number;
    y0: number;
    yValue: PointsArray[number]["yValue"];
}[];
export type AreaRangeProps = {
    points: AreaRangePointsArray;
    animate?: PathAnimationConfig;
} & AreaPathOptions & Partial<Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">>;
export declare function AreaRange({ points, animate, curveType, connectMissingData, ...ops }: React.PropsWithChildren<AreaRangeProps>): React.FunctionComponentElement<{
    path: import("@shopify/react-native-skia").SkPath;
} & Omit<import("@shopify/react-native-skia").AnimatedProps<PathProps, never>, "start" | "end"> & {
    start?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
    end?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
} & {
    animate?: PathAnimationConfig;
}>;
