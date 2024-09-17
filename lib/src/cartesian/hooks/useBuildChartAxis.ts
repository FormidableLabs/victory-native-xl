import React from "react";
import type { Color } from "@shopify/react-native-skia";
import type {
  AxisPropWithDefaults,
  AxisProps,
  FrameProps,
  FramePropsWithDefaults,
  InputFields,
  NumericalFields,
  OptionalAxisProps,
  XAxisInputProps,
  XAxisPropsWithDefaults,
  YAxisInputProps,
  YAxisPropsWithDefaults,
} from "../../types";
import { CartesianAxisDefaultProps } from "../components/CartesianAxis";
import { XAxisDefaults } from "../components/XAxis";
import { YAxisDefaults } from "../components/YAxis";
import { FrameDefaults } from "../components/Frame";

/**
 * This hook builds the chart axes + the surrounding frame based on either the new x, y, frame props, or via backwards compatability for the older axisOptions props and the associated default values it had. The defaults for the former are the new XAxisDefaults, YAxisDefaults, and FrameDefaults, while the defaults for the latter come from the older CartesianAxisDefaultProps.
 *
 * The hook returns a normalized object of `xAxis, yAxes, and frame` objects that are used to determine the axes to render and in the transformInputData function.
 */
export const useBuildChartAxis = <
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>({
  axisOptions,
  xAxis,
  yAxis,
  frame,
  yKeys,
}: {
  axisOptions?: Partial<Omit<AxisProps<RawData, XK, YK>, "xScale" | "yScale">>;
  xAxis?: XAxisInputProps<RawData, XK>;
  yAxis?: YAxisInputProps<RawData, YK>[];
  frame?: Omit<FrameProps, "xScale" | "yScale">;
  yKeys: YK[];
}) => {
  const normalizeAxisProps = React.useMemo(() => {
    // Helper functions to pick only the relevant properties for each prop type
    const pickXAxisProps = (
      axisProp: AxisPropWithDefaults<RawData, XK, YK> &
        OptionalAxisProps<RawData, XK, YK>,
    ): XAxisPropsWithDefaults<RawData, XK> => ({
      axisSide: axisProp.axisSide.x,
      yAxisSide: axisProp.axisSide.y,
      tickCount:
        typeof axisProp.tickCount === "number"
          ? axisProp.tickCount
          : axisProp.tickCount.x,
      tickValues:
        axisProp.tickValues &&
        typeof axisProp.tickValues === "object" &&
        "x" in axisProp.tickValues
          ? axisProp.tickValues.x
          : axisProp.tickValues,
      formatXLabel: axisProp.formatXLabel,
      labelPosition:
        typeof axisProp.labelPosition === "string"
          ? axisProp.labelPosition
          : axisProp.labelPosition.x,
      labelOffset:
        typeof axisProp.labelOffset === "number"
          ? axisProp.labelOffset
          : axisProp.labelOffset.x,
      labelColor:
        typeof axisProp.labelColor === "string"
          ? axisProp.labelColor
          : axisProp.labelColor.x,
      lineWidth:
        typeof axisProp.lineWidth === "object" && "grid" in axisProp.lineWidth
          ? typeof axisProp.lineWidth.grid === "object" &&
            "x" in axisProp.lineWidth.grid
            ? axisProp.lineWidth.grid.x
            : axisProp.lineWidth.grid
          : axisProp.lineWidth,
      lineColor: (typeof axisProp.lineColor === "object" &&
      "grid" in axisProp.lineColor
        ? typeof axisProp.lineColor.grid === "object" &&
          "x" in axisProp.lineColor.grid
          ? axisProp.lineColor.grid.x
          : axisProp.lineColor.grid
        : axisProp.lineColor) as Color,
      font: axisProp.font,
    });

    const pickYAxisProps = (
      axisProp: AxisPropWithDefaults<RawData, XK, YK> &
        OptionalAxisProps<RawData, XK, YK>,
    ): YAxisPropsWithDefaults<RawData, YK> => {
      return {
        axisSide: axisProp.axisSide.y,
        formatYLabel: axisProp.formatYLabel,
        tickValues:
          axisProp.tickValues &&
          typeof axisProp.tickValues === "object" &&
          "y" in axisProp.tickValues
            ? axisProp.tickValues.y
            : axisProp.tickValues,
        tickCount:
          typeof axisProp.tickCount === "number"
            ? axisProp.tickCount
            : axisProp.tickCount.y,
        labelPosition:
          typeof axisProp.labelPosition === "string"
            ? axisProp.labelPosition
            : axisProp.labelPosition.y,
        labelOffset:
          typeof axisProp.labelOffset === "number"
            ? axisProp.labelOffset
            : axisProp.labelOffset.y,
        labelColor:
          typeof axisProp.labelColor === "string"
            ? axisProp.labelColor
            : axisProp.labelColor.y,
        lineWidth:
          typeof axisProp.lineWidth === "object" && "grid" in axisProp.lineWidth
            ? typeof axisProp.lineWidth.grid === "object" &&
              "y" in axisProp.lineWidth.grid
              ? axisProp.lineWidth.grid.y
              : axisProp.lineWidth.grid
            : axisProp.lineWidth,
        lineColor: (typeof axisProp.lineColor === "object" &&
        "grid" in axisProp.lineColor
          ? typeof axisProp.lineColor.grid === "object" &&
            "y" in axisProp.lineColor.grid
            ? axisProp.lineColor.grid.y
            : axisProp.lineColor.grid
          : axisProp.lineColor) as Color,
        font: axisProp.font,
        yKeys: yKeys,
      };
    };

    const pickFrameProps = (
      axisProp: AxisPropWithDefaults<RawData, XK, YK> &
        OptionalAxisProps<RawData, XK, YK>,
    ): FramePropsWithDefaults => ({
      lineColor:
        typeof axisProp.lineColor === "object" && "frame" in axisProp.lineColor
          ? axisProp.lineColor.frame
          : axisProp.lineColor,
      lineWidth:
        typeof axisProp.lineWidth === "object" && "frame" in axisProp.lineWidth
          ? axisProp.lineWidth.frame
          : axisProp.lineWidth,
    });

    const defaultAxisOptions: AxisPropWithDefaults<RawData, XK, YK> &
      OptionalAxisProps<RawData, XK, YK> = {
      ...CartesianAxisDefaultProps,
      ...axisOptions,
    };
    const xAxisWithDefaults: XAxisPropsWithDefaults<RawData, XK> = {
      ...XAxisDefaults,
      ...xAxis,
    };
    const yAxisWithDefaults: YAxisPropsWithDefaults<RawData, YK>[] = yAxis
      ? yAxis.length === 1
        ? yAxis.map((axis) => ({
            ...YAxisDefaults,
            yKeys: axis.yKeys ?? yKeys,
            ...axis,
          }))
        : yAxis.map((axis) => ({ ...YAxisDefaults, ...axis }))
      : [{ ...YAxisDefaults, yKeys }];
    const frameWithDefaults = frame
      ? { ...FrameDefaults, frame }
      : FrameDefaults;

    return {
      xAxis: xAxis ? xAxisWithDefaults : pickXAxisProps(defaultAxisOptions),
      yAxes: yAxis ? yAxisWithDefaults : [pickYAxisProps(defaultAxisOptions)],
      frame: frameWithDefaults ?? pickFrameProps(defaultAxisOptions),
    };
  }, [axisOptions, xAxis, yAxis, frame, yKeys]);
  return normalizeAxisProps;
};
