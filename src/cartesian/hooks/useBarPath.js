import * as React from "react";
import { Skia } from "@shopify/react-native-skia";
import { createRoundedRectPath, } from "../../utils/createRoundedRectPath";
import { useCartesianChartContext } from "../contexts/CartesianChartContext";
import { useBarWidth } from "./useBarWidth";
export const useBarPath = (points, chartBounds, innerPadding = 0.2, roundedCorners, customBarWidth, barCount) => {
    const { yScale } = useCartesianChartContext();
    const barWidth = useBarWidth({
        points,
        chartBounds,
        innerPadding,
        customBarWidth,
        barCount,
    });
    const path = React.useMemo(() => {
        const path = Skia.Path.Make();
        points.forEach(({ x, y, yValue }) => {
            if (typeof y !== "number")
                return;
            const barHeight = yScale(0) - y;
            if (roundedCorners) {
                const nonUniformRoundedRect = createRoundedRectPath(x - barWidth / 2, y, barWidth, barHeight, roundedCorners, Number(yValue));
                path.addRRect(nonUniformRoundedRect);
            }
            else {
                path.addRect(Skia.XYWHRect(x - barWidth / 2, y, barWidth, barHeight));
            }
        });
        return path;
    }, [barWidth, points, roundedCorners, yScale]);
    return { path, barWidth };
};
