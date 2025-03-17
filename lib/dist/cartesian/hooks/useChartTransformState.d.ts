import { type SharedValue } from "react-native-reanimated";
import { type Matrix4 } from "@shopify/react-native-skia";
export type ChartTransformState = {
    panActive: SharedValue<boolean>;
    zoomActive: SharedValue<boolean>;
    origin: SharedValue<{
        x: number;
        y: number;
    }>;
    matrix: SharedValue<Matrix4>;
    offset: SharedValue<Matrix4>;
};
type ChartTransformStateConfig = {
    scaleX?: number;
    scaleY?: number;
};
export declare const useChartTransformState: (config?: ChartTransformStateConfig) => {
    state: ChartTransformState;
};
export {};
