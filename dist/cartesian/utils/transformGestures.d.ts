import { type PanGesture, type PinchGesture } from "react-native-gesture-handler";
import type { PanGestureConfig } from "react-native-gesture-handler/lib/typescript/handlers/PanGestureHandler";
import type { ChartTransformState } from "../hooks/useChartTransformState";
import { type SharedValue } from "react-native-reanimated";
type Dimension = "x" | "y";
export type PinchTransformGestureConfig = {
    enabled?: boolean;
    dimensions?: Dimension | Dimension[];
};
export declare const pinchTransformGesture: (state: ChartTransformState, _config?: PinchTransformGestureConfig) => PinchGesture;
export type PanTransformGestureConfig = {
    enabled?: boolean;
    dimensions?: Dimension | Dimension[];
} & Pick<PanGestureConfig, "activateAfterLongPress">;
export declare const panTransformGesture: (state: ChartTransformState, _config?: PanTransformGestureConfig) => PanGesture;
export declare const scrollTransformGesture: ({ scrollX, prevTranslateX, viewportWidth, length, dimensions, onScroll, }: {
    scrollX: SharedValue<number>;
    prevTranslateX: SharedValue<number>;
    viewportWidth: number;
    length: number;
    dimensions: Partial<{
        totalContentWidth: number;
        width: number;
    }>;
    onScroll?: (data: any) => void;
}) => PanGesture;
export {};
