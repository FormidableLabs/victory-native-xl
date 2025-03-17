import * as React from "react";
import { type ComposedGesture } from "react-native-gesture-handler";
import { type MutableRefObject } from "react";
import type { ScaleLinear } from "d3-scale";
import type { AxisProps, CartesianChartRenderArg, InputFields, NumericalFields, SidedNumber, ChartBounds, YAxisInputProps, XAxisInputProps, FrameInputProps, ChartPressPanConfig, Viewport } from "../types";
import type { ChartPressState, ChartPressStateInit } from "./hooks/useChartPressState";
import { type ChartTransformState } from "./hooks/useChartTransformState";
import { type PanTransformGestureConfig, type PinchTransformGestureConfig } from "./utils/transformGestures";
export type CartesianActionsHandle<T = undefined> = T extends ChartPressState<infer S> ? S extends ChartPressStateInit ? {
    handleTouch: (v: T, x: number, y: number) => void;
} : never : never;
type CartesianChartProps<RawData extends Record<string, unknown>, XK extends keyof InputFields<RawData>, YK extends keyof NumericalFields<RawData>> = {
    data: RawData[];
    xKey: XK;
    yKeys: YK[];
    padding?: SidedNumber;
    domainPadding?: SidedNumber;
    domain?: {
        x?: [number] | [number, number];
        y?: [number] | [number, number];
    };
    viewport?: Viewport;
    chartPressState?: ChartPressState<{
        x: InputFields<RawData>[XK];
        y: Record<YK, number>;
    }> | ChartPressState<{
        x: InputFields<RawData>[XK];
        y: Record<YK, number>;
    }>[];
    chartPressConfig?: {
        pan?: ChartPressPanConfig;
    };
    children: (args: CartesianChartRenderArg<RawData, YK>) => React.ReactNode;
    renderOutside?: (args: CartesianChartRenderArg<RawData, YK>) => React.ReactNode;
    axisOptions?: Partial<Omit<AxisProps<RawData, XK, YK>, "xScale" | "yScale">>;
    onChartBoundsChange?: (bounds: ChartBounds) => void;
    onScaleChange?: (xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>) => void;
    /**
     * @deprecated This prop will eventually be replaced by the new `chartPressConfig`. For now it's being kept around for backwards compatibility sake.
     */
    gestureLongPressDelay?: number;
    xAxis?: XAxisInputProps<RawData, XK>;
    yAxis?: YAxisInputProps<RawData, YK>[];
    frame?: FrameInputProps;
    transformState?: ChartTransformState;
    transformConfig?: {
        pan?: PanTransformGestureConfig;
        pinch?: PinchTransformGestureConfig;
    };
    customGestures?: ComposedGesture;
    actionsRef?: MutableRefObject<CartesianActionsHandle<ChartPressState<{
        x: InputFields<RawData>[XK];
        y: Record<YK, number>;
    }> | undefined> | null>;
};
export declare function CartesianChart<RawData extends Record<string, unknown>, XK extends keyof InputFields<RawData>, YK extends keyof NumericalFields<RawData>>({ transformState, children, ...rest }: CartesianChartProps<RawData, XK, YK>): React.JSX.Element;
export {};
