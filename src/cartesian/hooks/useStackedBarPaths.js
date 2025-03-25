import React from "react";
import { Skia, } from "@shopify/react-native-skia";
import { createRoundedRectPath, } from "../../utils/createRoundedRectPath";
import { useCartesianChartContext } from "../contexts/CartesianChartContext";
import { useBarWidth } from "./useBarWidth";
const DEFAULT_COLORS = ["red", "orange", "blue", "green", "blue", "purple"];
export const useStackedBarPaths = ({ points, chartBounds, innerPadding = 0.25, barWidth: customBarWidth, barCount, barOptions = () => ({}), colors = DEFAULT_COLORS, }) => {
    const { yScale } = useCartesianChartContext();
    const barWidth = useBarWidth({
        points,
        chartBounds,
        innerPadding,
        customBarWidth,
        barCount,
    });
    // initialize an object that will offset the bars' height's for each x value
    // so that we know where to start drawing the next bar for each x value
    const barYPositionOffsetTracker = points.reduce((acc, points) => {
        points.map((point) => (acc[point.xValue] = [0, 0]));
        return acc;
    }, {});
    const paths = React.useMemo(() => {
        const bars = [];
        const xToBottomTopIndexMap = getXToPointIndexMap(points);
        points.forEach((pointsArray, i) => {
            pointsArray.forEach((point, j) => {
                const isBottom = xToBottomTopIndexMap.get(point.x)?.[0] === i;
                const isTop = xToBottomTopIndexMap.get(point.x)?.[1] === i;
                const { yValue, x, y } = point;
                if (typeof y !== "number")
                    return;
                const isPositive = (yValue ?? 0) > 0;
                // call for any additional bar options per bar
                const options = barOptions({
                    columnIndex: i,
                    rowIndex: j,
                    isBottom: isPositive ? isBottom : isTop,
                    isTop: isPositive ? isTop : isBottom,
                });
                const { roundedCorners, color, ...ops } = options;
                const path = Skia.Path.Make();
                const barHeight = yScale(0) - y;
                const offset = isPositive
                    ? barYPositionOffsetTracker?.[point.xValue]?.[0]
                    : barYPositionOffsetTracker?.[point.xValue]?.[1];
                if (roundedCorners) {
                    const nonUniformRoundedRect = createRoundedRectPath(x - barWidth / 2, y - (offset ?? 0), barWidth, barHeight, roundedCorners, Number(yValue));
                    path.addRRect(nonUniformRoundedRect);
                }
                else {
                    path.addRect(Skia.XYWHRect(point.x - barWidth / 2, y - (offset ?? 0), barWidth, barHeight));
                }
                if (notNullAndUndefined(offset)) {
                    if (isPositive) {
                        barYPositionOffsetTracker[point.xValue][0] = barHeight + offset; // accumulate the positive heights as we loop
                    }
                    else {
                        barYPositionOffsetTracker[point.xValue][1] = barHeight + offset; // accumulate the negative heights as we loop
                    }
                }
                const bar = {
                    path,
                    key: `${i}-${j}`,
                    color: color ?? colors[i],
                    ...ops,
                };
                bars.push(bar);
            });
        });
        return bars;
    }, [barOptions, barWidth, barYPositionOffsetTracker, colors, points, yScale]);
    return paths;
};
/**
 * Returns a map of x values to a two value array where the first number is the index of
 * the bottom bar and the second is the index of the top bar.
 */
const getXToPointIndexMap = (points) => {
    const xToIndexMap = new Map();
    points.forEach((pointsArray, i) => {
        pointsArray.forEach(({ x, y, yValue }) => {
            if (notNullAndUndefined(y) &&
                notNullAndUndefined(yValue) &&
                yValue !== 0) {
                const current = xToIndexMap.get(x);
                if (!current) {
                    xToIndexMap.set(x, [i, i]);
                }
                else {
                    yValue > 0 ? (current[1] = i) : (current[0] = i);
                }
            }
        });
    });
    return xToIndexMap;
};
const notNullAndUndefined = (value) => value !== null && value !== undefined;
