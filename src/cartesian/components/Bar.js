import * as React from "react";
import { Path } from "@shopify/react-native-skia";
import { AnimatedPath } from "./AnimatedPath";
import {} from "../../hooks/useAnimatedPath";
import { useBarPath } from "../hooks/useBarPath";
import { BarGraphLabels } from "./BarGraphLabels";
const BarGraph = (props) => {
    const { options, ...pathProps } = props;
    const PathComponent = pathProps.animate ? AnimatedPath : Path;
    return React.createElement(PathComponent, { style: "fill", ...pathProps, ...options });
};
export const Bar = ({ points, chartBounds, animate, innerPadding = 0.25, roundedCorners, barWidth, barCount, labels, ...ops }) => {
    const { path, barWidth: bw } = useBarPath(points, chartBounds, innerPadding, roundedCorners, barWidth, barCount);
    return (React.createElement(React.Fragment, null,
        labels && (React.createElement(BarGraphLabels, { points: points, chartBounds: chartBounds, barWidth: barWidth ?? bw, options: labels })),
        React.createElement(BarGraph, { path: path, animate: animate, options: ops })));
};
