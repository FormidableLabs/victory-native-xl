import * as React from "react";
import { Path } from "@shopify/react-native-skia";
import {} from "../hooks/useAreaPath";
import { AnimatedPath } from "./AnimatedPath";
import {} from "../../hooks/useAnimatedPath";
import { useStackedAreaPaths } from "../hooks/useStackedAreaPaths";
const DEFAULT_COLORS = ["red", "orange", "yellow", "green", "blue", "purple"];
export function StackedArea({ points, y0, animate, curveType, colors = DEFAULT_COLORS, areaOptions, }) {
    const paths = useStackedAreaPaths({
        pointsArray: points,
        colors,
        y0,
        curveType,
        areaOptions,
    });
    return paths.map((p) => {
        return React.createElement(animate ? AnimatedPath : Path, {
            ...p,
            ...(Boolean(animate) && { animate }),
        });
    });
}
