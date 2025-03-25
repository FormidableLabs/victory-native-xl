import * as React from "react";
import { Path } from "@shopify/react-native-skia";
import { AnimatedPath } from "./AnimatedPath";
import {} from "../../hooks/useAnimatedPath";
import {} from "../../utils/createRoundedRectPath";
import { useStackedBarPaths, } from "../hooks/useStackedBarPaths";
const DEFAULT_COLORS = ["red", "orange", "blue", "green", "blue", "purple"];
export const StackedBar = ({ points, chartBounds, animate, innerPadding = 0.25, barWidth, barCount, barOptions = () => ({}), colors = DEFAULT_COLORS, }) => {
    const paths = useStackedBarPaths({
        points,
        chartBounds,
        innerPadding,
        barWidth,
        barCount,
        barOptions,
        colors,
    });
    return paths.map((p) => {
        return React.createElement(animate ? AnimatedPath : Path, {
            ...p,
            style: "fill",
            ...(Boolean(animate) && { animate }),
        });
    });
};
