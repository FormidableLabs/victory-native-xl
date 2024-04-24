import * as React from "react";
import { Skia } from "@shopify/react-native-skia";
import type { ChartBounds, PointsArray } from "../../types";
import {
  createRoundedRectPath,
  type RoundedCorners,
} from "../../utils/createRoundedRectPath";

export const useBarPath = (
  points: PointsArray,
  chartBounds: ChartBounds,
  innerPadding = 0.2,
  roundedCorners?: RoundedCorners,
  customBarWidth?: number,
  barCount?: number,
) => {
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

  const path = React.useMemo(() => {
    const path = Skia.Path.Make();

    points.forEach(({ x, y }) => {
      if (typeof y !== "number") return;

      if (!roundedCorners) {
        path.addRect(
          Skia.XYWHRect(x - barWidth / 2, y, barWidth, chartBounds.bottom - y),
        );
        return;
      }
      const roundedRectPath = Skia.Path.MakeFromSVGString(
        createRoundedRectPath(
          x - barWidth / 2,
          y,
          barWidth,
          chartBounds.bottom - y,
          roundedCorners,
        ),
      );
      roundedRectPath && path.addPath(roundedRectPath);
    });

    return path;
  }, [barWidth, chartBounds.bottom, points, roundedCorners]);

  return { path, barWidth };
};
