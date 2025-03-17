import type { NonUniformRRect } from "@shopify/react-native-skia";
export type RoundedCorners = {
    topLeft?: number;
    topRight?: number;
    bottomRight?: number;
    bottomLeft?: number;
};
export declare const createRoundedRectPath: (x: number, y: number, barWidth: number, barHeight: number, roundedCorners: RoundedCorners, yValue: number) => NonUniformRRect;
