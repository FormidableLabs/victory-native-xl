import * as React from "react";
import { Skia } from "@shopify/react-native-skia";
import type { ChartBounds, PointsArray } from "../../types";
import {
  createRoundedRectPath,
  type RoundedCorners,
} from "../../utils/createRoundedRectPath";
import { useCartesianChartContext } from "../contexts/CartesianChartContext";
import { getBarGroupDimensionsForAxis } from "../utils/getBarGroupDimensionsForAxis";
import { getHorizontalBarGroupRect } from "../utils/getHorizontalBarGroupRect";

export const useHorizontalBarGroupPaths = (
  points: PointsArray[],
  chartBounds: ChartBounds,
  betweenGroupPadding = 0,
  withinGroupPadding = 0,
  roundedCorners?: RoundedCorners,
  customBarWidth?: number,
  barCount?: number,
) => {
  const numGroups = points[0]?.length || 0;

  const { xScale } = useCartesianChartContext();

  const { barWidth, groupWidth, gapWidth } = getBarGroupDimensionsForAxis({
    axisStart: chartBounds.top,
    axisEnd: chartBounds.bottom,
    betweenGroupPadding,
    withinGroupPadding,
    groupCount: numGroups,
    barsPerGroup: points.length,
    customBarWidth,
    barCount,
  });

  const paths = React.useMemo(() => {
    const baselineX = xScale(0);

    return points.map((pointSet, i) => {
      const p = Skia.Path.Make();
      pointSet.forEach((point) => {
        const rect = getHorizontalBarGroupRect({
          point,
          baselineX,
          barWidth,
          groupWidth,
          gapWidth,
          barIndex: i,
        });
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
          p.addRRect(nonUniformRoundedRect);
        } else {
          p.addRect(Skia.XYWHRect(rect.x, rect.y, rect.width, rect.height));
        }
      });
      return p;
    });
  }, [barWidth, gapWidth, groupWidth, points, roundedCorners, xScale]);

  return { barWidth, groupWidth, gapWidth, paths };
};
