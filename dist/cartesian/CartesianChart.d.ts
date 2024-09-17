import * as React from "react";
import type { AxisProps, CartesianChartRenderArg, InputFields, NumericalFields, SidedNumber, ChartBounds } from "../types";
import type { ChartPressState } from "./hooks/useChartPressState";
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
    chartPressState?: ChartPressState<{
        x: InputFields<RawData>[XK];
        y: Record<YK, number>;
    }> | ChartPressState<{
        x: InputFields<RawData>[XK];
        y: Record<YK, number>;
    }>[];
    children: (args: CartesianChartRenderArg<RawData, YK>) => React.ReactNode;
    renderOutside?: (args: CartesianChartRenderArg<RawData, YK>) => React.ReactNode;
    axisOptions?: Partial<Omit<AxisProps<RawData, XK, YK>, "xScale" | "yScale">>;
    onChartBoundsChange?: (bounds: ChartBounds) => void;
    gestureLongPressDelay?: number;
};
export declare function CartesianChart<RawData extends Record<string, unknown>, XK extends keyof InputFields<RawData>, YK extends keyof NumericalFields<RawData>>({ data, xKey, yKeys, padding, domainPadding, children, renderOutside, axisOptions, domain, chartPressState, onChartBoundsChange, gestureLongPressDelay, }: CartesianChartProps<RawData, XK, YK>): React.JSX.Element;
export {};
