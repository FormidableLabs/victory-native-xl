import React, { type PropsWithChildren } from "react";
import type { ChartTransformState } from "../hooks/useChartTransformState";
interface CartesianTransformContext {
    k: number;
    kx: number;
    ky: number;
    tx: number;
    ty: number;
}
declare const CartesianTransformContext: React.Context<CartesianTransformContext | undefined>;
type CartesianTransformProviderProps = PropsWithChildren<{
    transformState?: ChartTransformState;
}>;
export declare const CartesianTransformProvider: ({ transformState, children }: CartesianTransformProviderProps) => React.JSX.Element;
export declare const useCartesianTransformContext: () => CartesianTransformContext;
export {};
