import React from "react";
import type { ValueOf, NumericalFields, InputDatum, AxisProps, InputFields } from "../../types";
/**
 * @deprecated This component will eventually be replaced by the new, separate x/y/frame components.
 */
export declare const CartesianAxis: <RawData extends Record<string, unknown>, XK extends keyof InputFields<RawData>, YK extends keyof NumericalFields<RawData>>({ tickCount, xTicksNormalized, yTicksNormalized, labelPosition, labelOffset, axisSide, lineColor, lineWidth, labelColor, formatYLabel, formatXLabel, yScale, xScale, font, isNumericalData, ix, }: AxisProps<RawData, XK, YK>) => React.JSX.Element;
export declare const CartesianAxisDefaultProps: {
    lineColor: string;
    lineWidth: number;
    tickCount: number;
    labelOffset: {
        x: number;
        y: number;
    };
    axisSide: {
        x: "bottom";
        y: "left";
    };
    labelPosition: "outset";
    formatXLabel: (label: ValueOf<InputDatum>) => string;
    formatYLabel: (label: ValueOf<InputDatum>) => string;
    labelColor: string;
    ix: never[];
    domain: null;
};
