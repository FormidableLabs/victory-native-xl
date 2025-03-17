import React, { type PropsWithChildren } from "react";
interface PolarChartContext {
    data: Record<string, unknown>[];
    canvasSize: {
        width: number;
        height: number;
    };
    labelKey: string;
    valueKey: string;
    colorKey: string;
}
declare const PolarChartContext: React.Context<PolarChartContext | undefined>;
interface PolarChartProviderProps {
    data: Record<string, unknown>[];
    canvasSize: {
        width: number;
        height: number;
    };
    labelKey: string;
    valueKey: string;
    colorKey: string;
}
export declare const PolarChartProvider: (props: PropsWithChildren<PolarChartProviderProps>) => React.JSX.Element;
export declare const usePolarChartContext: () => PolarChartContext;
export {};
