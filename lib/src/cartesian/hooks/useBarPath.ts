import * as React from "react";
import { Skia } from "@shopify/react-native-skia";
import {
  createRoundedRectPath,
  type RoundedCorners,
} from "../../utils/createRoundedRectPath";
import type { ChartBounds, PointsArray } from "../../types";
import { useCartesianChartContext } from "../contexts/CartesianChartContext";
import { useBarWidth } from "./useBarWidth";
import { getVerticalBarRect } from "../utils/getVerticalBarRect";

export const useBarPath = (
  points: PointsArray,
  chartBounds: ChartBounds,
  innerPadding = 0.2,
  roundedCorners?: RoundedCorners,
  customBarWidth?: number,
  barCount?: number,
) => {
  const { yScale } = useCartesianChartContext();
  const barWidth = useBarWidth({
    points,
    chartBounds,
    innerPadding,
    customBarWidth,
    barCount,
  });

  const path = React.useMemo(() => {
    const builder = Skia.PathBuilder.Make();

    const baselineY = yScale(0);

    points.forEach((point) => {
      const rect = getVerticalBarRect(point, baselineY, barWidth);
      if (!rect) return;

      const yValue = point.yValue;
      if (roundedCorners) {
        const nonUniformRoundedRect = createRoundedRectPath(
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          roundedCorners,
          Number(yValue),
        );
        builder.addRRect(nonUniformRoundedRect);
      } else {
        builder.addRect(Skia.XYWHRect(rect.x, rect.y, rect.width, rect.height));
      }
    });

    return builder.build();
  }, [barWidth, points, roundedCorners, yScale]);

  return { path, barWidth };
};
