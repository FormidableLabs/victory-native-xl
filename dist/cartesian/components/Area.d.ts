import * as React from "react";
import { type PathProps } from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { type AreaPathOptions } from "../hooks/useAreaPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";
export type AreaProps = {
    points: PointsArray;
    y0: number;
    animate?: PathAnimationConfig;
} & AreaPathOptions & Partial<Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">>;
export declare function Area({ points, y0, animate, curveType, connectMissingData, ...ops }: React.PropsWithChildren<AreaProps>): React.FunctionComponentElement<{
    path: import("@shopify/react-native-skia").SkPath;
} & Omit<import("@shopify/react-native-skia").AnimatedProps<PathProps, never>, "start" | "end"> & {
    start?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
    end?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
} & {
    animate?: PathAnimationConfig;
}>;
