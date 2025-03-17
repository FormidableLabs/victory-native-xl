import * as React from "react";
import { type PieSliceData } from "./PieSlice";
type PieChartProps = {
    children?: (args: {
        slice: PieSliceData;
    }) => React.ReactNode;
    innerRadius?: number | string;
    circleSweepDegrees?: number;
    startAngle?: number;
    size?: number;
};
export declare const PieChart: (props: PieChartProps) => React.JSX.Element[];
export {};
