import * as React from "react";
import { Skia } from "@shopify/react-native-skia";
import type { ChartBounds, PointsArray } from "../../types";

export const useBarPath = (
  points: PointsArray,
  chartBounds: ChartBounds,
  innerPadding = 0.2,
) => {
  const barWidth = React.useMemo(() => {
    const domainWidth = chartBounds.right - chartBounds.left;
    const barWidth = ((1 - innerPadding) * domainWidth) / (points.length - 1);

    return barWidth;
  }, [chartBounds.left, chartBounds.right, innerPadding, points.length]);

  const path = React.useMemo(() => {
    const path = Skia.Path.Make();

    points.forEach(({ x, y }) => {
      path.addRect(
        Skia.XYWHRect(x - barWidth / 2, y, barWidth, chartBounds.bottom - y),
      );
    });

    return path;
  }, [barWidth, chartBounds.bottom, points]);

  return { path, barWidth };
};
