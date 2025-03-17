import React, { type PropsWithChildren } from "react";
import type { PieSliceData } from "../PieSlice";
interface PieSliceContext {
    slice: PieSliceData;
}
declare const PieSliceContext: React.Context<PieSliceContext | undefined>;
interface PieSliceProviderProps {
    slice: PieSliceData;
}
export declare const PieSliceProvider: ({ children, slice: _slice, }: PropsWithChildren<PieSliceProviderProps>) => React.JSX.Element;
export declare const usePieSliceContext: () => PieSliceContext;
export {};
