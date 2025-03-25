import * as React from "react";
import { Path, } from "@shopify/react-native-skia";
import { useLinePath } from "../hooks/useLinePath";
import { AnimatedPath } from "./AnimatedPath";
export function Line({ points, animate, curveType, connectMissingData, ...ops }) {
    const { path } = useLinePath(points, {
        curveType,
        connectMissingData,
    });
    return React.createElement(animate ? AnimatedPath : Path, {
        path,
        style: "stroke",
        ...ops,
        ...(Boolean(animate) && { animate }),
    });
}
