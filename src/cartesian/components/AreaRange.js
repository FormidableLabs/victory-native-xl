import * as React from "react";
import { Path } from "@shopify/react-native-skia";
import { useAreaPath } from "../hooks/useAreaPath";
import { AnimatedPath } from "./AnimatedPath";
import {} from "../../hooks/useAnimatedPath";
export function AreaRange({ points, animate, curveType, connectMissingData, ...ops }) {
    const areaRangePoints = React.useMemo(() => {
        // Create upper bound points going forward
        const upperPoints = points.map((point) => ({
            ...point,
            y: point.y,
        }));
        // Create lower bound points going backward
        const lowerPoints = [...points].reverse().map((point) => ({
            ...point,
            y: point.y0,
        }));
        // Combine into single array that traces a complete path
        return [...upperPoints, ...lowerPoints];
    }, [points]);
    const { path } = useAreaPath(areaRangePoints, 0, {
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
