import * as React from "react";
import { type Color, type PathProps, type SkPath } from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { type CurveType } from "../utils/curves";
type CustomizablePathProps = Partial<Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">>;
type UseStackedAreaPathArgs = {
    pointsArray: PointsArray[];
    colors: Color[];
    y0: number;
    curveType?: CurveType;
    areaOptions?: ({ rowIndex, lowestY, highestY, }: {
        rowIndex: number;
        lowestY: number;
        highestY: number;
    }) => CustomizablePathProps & {
        children?: React.ReactNode;
    };
};
export type StackedAreaPath = {
    path: SkPath;
    key: string;
    color?: Color;
} & CustomizablePathProps & {
    children?: React.ReactNode;
};
export declare const useStackedAreaPaths: ({ pointsArray, colors, y0, curveType, areaOptions, }: UseStackedAreaPathArgs) => StackedAreaPath[];
export {};
