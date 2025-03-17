import * as React from "react";
import { type Color, type PathProps } from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { type AreaPathOptions } from "../hooks/useAreaPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";
type CustomizablePathProps = Partial<Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">>;
export type StackedAreaProps = {
    points: PointsArray[];
    y0: number;
    animate?: PathAnimationConfig;
    colors?: Color[];
    areaOptions?: ({ rowIndex, lowestY, highestY, }: {
        rowIndex: number;
        lowestY: number;
        highestY: number;
    }) => CustomizablePathProps & {
        children?: React.ReactNode;
    };
} & AreaPathOptions;
export declare function StackedArea({ points, y0, animate, curveType, colors, areaOptions, }: React.PropsWithChildren<StackedAreaProps>): React.FunctionComponentElement<{
    path: import("@shopify/react-native-skia").SkPath;
} & Omit<import("@shopify/react-native-skia").AnimatedProps<PathProps, never>, "start" | "end"> & {
    start?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
    end?: import("@shopify/react-native-skia").AnimatedProp<number> | undefined;
} & {
    animate?: PathAnimationConfig | undefined;
}>[];
export {};
