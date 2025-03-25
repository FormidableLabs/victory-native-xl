import * as React from "react";
import { Path } from "@shopify/react-native-skia";
import { useAreaPath } from "../hooks/useAreaPath";
import { AnimatedPath } from "./AnimatedPath";
import {} from "../../hooks/useAnimatedPath";
export function Area({ points, y0, animate, curveType, connectMissingData, ...ops }) {
    const { path } = useAreaPath(points, y0, {
        curveType,
        connectMissingData,
    });
    return React.createElement(animate ? AnimatedPath : Path, {
        path,
        style: "fill",
        ...ops,
        ...(Boolean(animate) && { animate }),
    });
}
