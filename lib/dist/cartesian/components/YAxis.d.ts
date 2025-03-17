import React from "react";
import type { InputDatum, NumericalFields, ValueOf, YAxisProps } from "../../types";
export declare const YAxis: <RawData extends Record<string, unknown>, YK extends keyof NumericalFields<RawData>>({ xScale, yScale, yTicksNormalized, axisSide, labelPosition, labelOffset, labelColor, lineWidth, lineColor, font, formatYLabel, linePathEffect, chartBounds, }: YAxisProps<RawData, YK>) => React.JSX.Element[];
export declare const YAxisDefaults: {
    lineColor: string;
    lineWidth: number;
    tickCount: number;
    labelOffset: number;
    axisSide: "left";
    labelPosition: "outset";
    formatYLabel: (label: ValueOf<InputDatum>) => string;
    labelColor: string;
    yKeys: never[];
    domain: null;
};
