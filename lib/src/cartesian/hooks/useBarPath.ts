import * as React from "react";
import { Skia, type SkPath } from "@shopify/react-native-skia";
import {
  createRoundedRectPath,
  type RoundedCorners,
} from "../../utils/createRoundedRectPath";
import type { ChartBounds, PointsArray } from "../../types";
import { useCartesianChartContext } from "../contexts/CartesianChartContext";

export const useBarPath = (
  points: PointsArray,
  chartBounds: ChartBounds,
  innerPadding = 0.2,
  roundedCorners?: RoundedCorners,
  customBarWidth?: number,
  barCount?: number,
) => {
  const { yScale } = useCartesianChartContext();
  const barWidth = React.useMemo(() => {
    if (customBarWidth) return customBarWidth;
    const domainWidth = chartBounds.right - chartBounds.left;

    const numerator = (1 - innerPadding) * domainWidth;

    const denominator = barCount
      ? barCount
      : points.length - 1 <= 0
        ? // don't divide by 0 if there's only one data point
          points.length
        : points.length - 1;

    const barWidth = numerator / denominator;

    return barWidth;
  }, [
    customBarWidth,
    chartBounds.left,
    chartBounds.right,
    innerPadding,
    points.length,
    barCount,
  ]);

  const paths = React.useMemo(() => {
    const paths: SkPath[] = [];
    points.forEach(({ x, y, yValue }) => {
      const path = Skia.Path.Make();
      if (typeof y !== "number") return;
      const barHeight = yScale(0) - y;
      if (roundedCorners) {
        const nonUniformRoundedRect = createRoundedRectPath(
          x,
          y,
          barWidth,
          barHeight,
          roundedCorners,
          Number(yValue),
        );
        path.addRRect(nonUniformRoundedRect);
      } else {
        path.addRect(Skia.XYWHRect(x - barWidth / 2, y, barWidth, barHeight));
      }
      paths.push(path);
    });
    return paths;
  }, [barWidth, points, roundedCorners, yScale]);

  return { paths, barWidth };
};
