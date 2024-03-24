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
  innerPadding = 12,
  roundedCorners?: RoundedCorners,
) => {
  const gaps = points.length - 1;
  const totalGapWidth = gaps * innerPadding;

  const barWidth = React.useMemo(() => {
    const domainWidth = chartBounds.right - chartBounds.left;

    return domainWidth / points.length - totalGapWidth / points.length;
  }, [chartBounds.left, chartBounds.right, totalGapWidth, points.length]);

  const path = React.useMemo(() => {
    const path = Skia.Path.Make();

    points.forEach(({ y }, index) => {
      if (typeof y !== 'number') return;

      if (!roundedCorners) {
        path.addRect(
          Skia.XYWHRect(
            barWidth * index + innerPadding * index,
            y,
            barWidth,
            chartBounds.bottom - y,
          ),
        );
        return;
      }

      const roundedRectPath = Skia.Path.MakeFromSVGString(
        createRoundedRectPath(
          barWidth * index + innerPadding * index,
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
