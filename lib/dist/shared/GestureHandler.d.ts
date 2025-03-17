import { type ComposedGesture, type GestureType } from "react-native-gesture-handler";
import { type SkRect } from "@shopify/react-native-skia";
import { type SharedValue } from "react-native-reanimated";
import * as React from "react";
import { type ChartTransformState } from "../cartesian/hooks/useChartTransformState";
type GestureHandlerProps = {
    gesture: ComposedGesture | GestureType;
    dimensions: SkRect;
    transformState?: ChartTransformState;
    debug?: boolean;
    derivedScrollX?: SharedValue<number>;
};
export declare const GestureHandler: ({ gesture, dimensions, transformState, derivedScrollX, debug, }: GestureHandlerProps) => React.JSX.Element;
export {};
