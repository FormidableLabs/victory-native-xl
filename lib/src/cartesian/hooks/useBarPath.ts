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
  dataLength?: number,
) => {
  const barWidth = React.useMemo(() => {
    const length = dataLength ?? points.length;
    const domainWidth = chartBounds.right - chartBounds.left;
    const barWidth = ((1 - innerPadding) * domainWidth) / (length - 1);
    return barWidth;
  }, [
    chartBounds.left,
    chartBounds.right,
    innerPadding,
    points.length,
    dataLength,
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
