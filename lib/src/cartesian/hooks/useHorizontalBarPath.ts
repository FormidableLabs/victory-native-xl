import * as React from "react";
import { Skia } from "@shopify/react-native-skia";
import {
  createRoundedRectPath,
  type RoundedCorners,
} from "../../utils/createRoundedRectPath";
import type { ChartBounds, PointsArray } from "../../types";
import { useCartesianChartContext } from "../contexts/CartesianChartContext";
import { getBarThickness } from "../utils/getBarThickness";
import { getHorizontalBarRect } from "../utils/getHorizontalBarRect";

export const useHorizontalBarPath = (
  points: PointsArray,
  chartBounds: ChartBounds,
  innerPadding = 0.2,
  roundedCorners?: RoundedCorners,
  customBarWidth?: number,
  barCount?: number,
) => {
  const { xScale } = useCartesianChartContext();
  const barWidth = getBarThickness({
    points,
    axisStart: chartBounds.top,
    axisEnd: chartBounds.bottom,
    innerPadding,
    customBarThickness: customBarWidth,
    barCount,
  });

  const path = React.useMemo(() => {
    const path = Skia.Path.Make();
    const baselineX = xScale(0);

    points.forEach((point) => {
      const rect = getHorizontalBarRect(point, baselineX, barWidth);
      if (!rect) return;

      if (roundedCorners) {
        const nonUniformRoundedRect = createRoundedRectPath(
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          roundedCorners,
          Number(point.yValue),
          "horizontal",
        );
        path.addRRect(nonUniformRoundedRect);
      } else {
        path.addRect(Skia.XYWHRect(rect.x, rect.y, rect.width, rect.height));
      }
    });

    return path;
  }, [barWidth, points, roundedCorners, xScale]);

  return { path, barWidth };
};
