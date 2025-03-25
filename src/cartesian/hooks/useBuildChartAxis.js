import React from "react";
import { CartesianAxisDefaultProps } from "../components/CartesianAxis";
import { XAxisDefaults } from "../components/XAxis";
import { YAxisDefaults } from "../components/YAxis";
import { FrameDefaults } from "../components/Frame";
/**
 * This hook builds the chart axes + the surrounding frame based on either the new x, y, frame props, or via backwards compatability for the older axisOptions props and the associated default values it had. The defaults for the former are the new XAxisDefaults, YAxisDefaults, and FrameDefaults, while the defaults for the latter come from the older CartesianAxisDefaultProps.
 *
 * The hook returns a normalized object of `xAxis, yAxes, and frame` objects that are used to determine the axes to render and in the transformInputData function.
 */
export const useBuildChartAxis = ({ axisOptions, xAxis, yAxis, frame, yKeys, }) => {
    const normalizeAxisProps = React.useMemo(() => {
        // Helper functions to pick only the relevant properties for each prop type
        const pickXAxisProps = (axisProp) => ({
            axisSide: axisProp.axisSide.x,
            yAxisSide: axisProp.axisSide.y,
            tickCount: typeof axisProp.tickCount === "number"
                ? axisProp.tickCount
                : axisProp.tickCount.x,
            tickValues: axisProp.tickValues &&
                typeof axisProp.tickValues === "object" &&
                "x" in axisProp.tickValues
                ? axisProp.tickValues.x
                : axisProp.tickValues,
            formatXLabel: axisProp.formatXLabel,
            labelPosition: typeof axisProp.labelPosition === "string"
                ? axisProp.labelPosition
                : axisProp.labelPosition.x,
            labelOffset: typeof axisProp.labelOffset === "number"
                ? axisProp.labelOffset
                : axisProp.labelOffset.x,
            labelColor: typeof axisProp.labelColor === "string"
                ? axisProp.labelColor
                : axisProp.labelColor.x,
            lineWidth: typeof axisProp.lineWidth === "object" && "grid" in axisProp.lineWidth
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
                : axisProp.lineColor),
            font: axisProp.font,
        });
        const pickYAxisProps = (axisProp) => {
            return {
                axisSide: axisProp.axisSide.y,
                formatYLabel: axisProp.formatYLabel,
                tickValues: axisProp.tickValues &&
                    typeof axisProp.tickValues === "object" &&
                    "y" in axisProp.tickValues
                    ? axisProp.tickValues.y
                    : axisProp.tickValues,
                tickCount: typeof axisProp.tickCount === "number"
                    ? axisProp.tickCount
                    : axisProp.tickCount.y,
                labelPosition: typeof axisProp.labelPosition === "string"
                    ? axisProp.labelPosition
                    : axisProp.labelPosition.y,
                labelOffset: typeof axisProp.labelOffset === "number"
                    ? axisProp.labelOffset
                    : axisProp.labelOffset.y,
                labelColor: typeof axisProp.labelColor === "string"
                    ? axisProp.labelColor
                    : axisProp.labelColor.y,
                lineWidth: typeof axisProp.lineWidth === "object" && "grid" in axisProp.lineWidth
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
                    : axisProp.lineColor),
                font: axisProp.font,
                yKeys: yKeys,
                domain: axisProp.domain,
            };
        };
        const pickFrameProps = (axisProp) => ({
            lineColor: typeof axisProp.lineColor === "object" && "frame" in axisProp.lineColor
                ? axisProp.lineColor.frame
                : axisProp.lineColor,
            lineWidth: typeof axisProp.lineWidth === "object" && "frame" in axisProp.lineWidth
                ? axisProp.lineWidth.frame
                : axisProp.lineWidth,
        });
        const defaultAxisOptions = {
            ...CartesianAxisDefaultProps,
            ...axisOptions,
            ignoreClip: axisOptions?.ignoreClip ?? false,
        };
        const xAxisWithDefaults = {
            ...XAxisDefaults,
            ...xAxis,
        };
        const yAxisWithDefaults = yAxis
            ? yAxis.length === 1
                ? yAxis.map((axis) => ({
                    ...YAxisDefaults,
                    yKeys: axis.yKeys ?? yKeys,
                    ...axis,
                }))
                : yAxis.map((axis) => ({ ...YAxisDefaults, ...axis }))
            : [{ ...YAxisDefaults, yKeys }];
        const frameWithDefaults = frame
            ? { ...FrameDefaults, ...frame }
            : FrameDefaults;
        return {
            xAxis: xAxis ? xAxisWithDefaults : pickXAxisProps(defaultAxisOptions),
            yAxes: yAxis ? yAxisWithDefaults : [pickYAxisProps(defaultAxisOptions)],
            frame: frameWithDefaults ?? pickFrameProps(defaultAxisOptions),
        };
    }, [axisOptions, xAxis, yAxis, frame, yKeys]);
    return normalizeAxisProps;
};
