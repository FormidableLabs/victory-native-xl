import React from "react";
import type { Color } from "@shopify/react-native-skia";
import type { AxisProps, FrameInputProps, InputFields, NumericalFields, XAxisInputProps, XAxisPropsWithDefaults, YAxisInputProps, YAxisPropsWithDefaults } from "../../types";
/**
 * This hook builds the chart axes + the surrounding frame based on either the new x, y, frame props, or via backwards compatability for the older axisOptions props and the associated default values it had. The defaults for the former are the new XAxisDefaults, YAxisDefaults, and FrameDefaults, while the defaults for the latter come from the older CartesianAxisDefaultProps.
 *
 * The hook returns a normalized object of `xAxis, yAxes, and frame` objects that are used to determine the axes to render and in the transformInputData function.
 */
export declare const useBuildChartAxis: <RawData extends Record<string, unknown>, XK extends keyof InputFields<RawData>, YK extends keyof NumericalFields<RawData>>({ axisOptions, xAxis, yAxis, frame, yKeys, }: {
    axisOptions?: Partial<Omit<AxisProps<RawData, XK, YK>, "xScale" | "yScale">>;
    xAxis?: XAxisInputProps<RawData, XK>;
    yAxis?: YAxisInputProps<RawData, YK>[];
    frame?: FrameInputProps;
    yKeys: YK[];
}) => {
    xAxis: XAxisPropsWithDefaults<RawData, XK>;
    yAxes: YAxisPropsWithDefaults<RawData, YK>[];
    frame: {
        lineColor: string;
        lineWidth: number;
    } | {
        lineWidth: import("../../types").SidedNumber;
        lineColor: Color;
        linePathEffect?: React.ReactElement<import("@shopify/react-native-skia").AnimatedProps<import("@shopify/react-native-skia").DashPathEffectProps, never>, string | React.JSXElementConstructor<any>> | undefined;
    };
};
