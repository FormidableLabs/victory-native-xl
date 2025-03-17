import * as React from "react";
import { Skia } from "@shopify/react-native-skia";
import type { ChartBounds, PointsArray } from "../../types";
import {
  createRoundedRectPath,
  type RoundedCorners,
} from "../../utils/createRoundedRectPath";
import { useCartesianChartContext } from "../contexts/CartesianChartContext";

export const useBarGroupPaths = (
  points: PointsArray[],
  chartBounds: ChartBounds,
  betweenGroupPadding = 0,
  withinGroupPadding = 0,
  roundedCorners?: RoundedCorners,
  customBarWidth?: number,
  barCount?: number,
) => {
  const numGroups = points[0]?.length || 0;

  const { yScale } = useCartesianChartContext();

  const groupWidth = React.useMemo(() => {
    return (
      ((1 - betweenGroupPadding) * (chartBounds.right - chartBounds.left)) /
      Math.max(1, numGroups)
    );
  }, [betweenGroupPadding, chartBounds.left, chartBounds.right, numGroups]);

  const barWidth = React.useMemo(() => {
    if (customBarWidth) return customBarWidth;
    const numerator = (1 - withinGroupPadding) * groupWidth;
    const denominator = barCount ? barCount : Math.max(1, points.length);
    return numerator / denominator;
  }, [customBarWidth, groupWidth, points.length, withinGroupPadding, barCount]);

  const gapWidth = React.useMemo(() => {
    return (
      (groupWidth - barWidth * points.length) / Math.max(1, points.length - 1)
    );
  }, [barWidth, groupWidth, points.length]);

  const paths = React.useMemo(() => {
    return points.map((pointSet, i) => {
      const p = Skia.Path.Make();
      const offset = -groupWidth / 2 + i * (barWidth + gapWidth);
      pointSet.forEach(({ x, y, yValue }) => {
        if (typeof y !== "number") return;
        const barHeight = yScale(0) - y;
        if (roundedCorners) {
          const nonUniformRoundedRect = createRoundedRectPath(
            x + offset,
            y,
            barWidth,
            barHeight,
            roundedCorners,
            Number(yValue),
          );
          p.addRRect(nonUniformRoundedRect);
        } else {
          p.addRect(Skia.XYWHRect(x + offset, y, barWidth, barHeight));
        }
      });
      return p;
    });
  }, [barWidth, gapWidth, groupWidth, points, roundedCorners, yScale]);

  return { barWidth, groupWidth, gapWidth, paths };
};
