import React from "react";
import type { InputDatum, InputFields, ValueOf, XAxisProps } from "../../types";
import { type SharedValue } from "react-native-reanimated";
export declare const XAxis: <RawData extends Record<string, unknown>, XK extends keyof InputFields<RawData>>({ xScale: xScaleProp, ignoreClip, yScale, axisSide, yAxisSide, labelPosition, labelRotate, tickCount, tickValues, labelOffset, labelColor, lineWidth, lineColor, font, formatXLabel, ix, isNumericalData, linePathEffect, chartBounds, enableRescaling, zoom, scrollX, }: XAxisProps<RawData, XK> & {
    scrollX: SharedValue<number>;
    ignoreClip: boolean;
}) => React.JSX.Element[];
export declare const XAxisDefaults: {
    lineColor: string;
    lineWidth: number;
    tickCount: number;
    labelOffset: number;
    axisSide: "bottom";
    yAxisSide: "left";
    labelPosition: "outset";
    formatXLabel: (label: ValueOf<InputDatum>) => string;
    labelColor: string;
    labelRotate: number;
};
