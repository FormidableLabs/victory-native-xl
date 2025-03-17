import type { ScaleLinear } from "d3-scale";
import React, { type PropsWithChildren } from "react";
interface CartesianChartContext {
    xScale: ScaleLinear<number, number, never>;
    yScale: ScaleLinear<number, number, never>;
}
declare const CartesianChartContext: React.Context<CartesianChartContext | undefined>;
interface CartesianChartProviderProps {
    xScale: ScaleLinear<number, number, never>;
    yScale: ScaleLinear<number, number, never>;
}
export declare const CartesianChartProvider: (props: PropsWithChildren<CartesianChartProviderProps>) => React.JSX.Element;
export declare const useCartesianChartContext: () => CartesianChartContext;
export {};
