import * as React from "react";
import { Skia } from "@shopify/react-native-skia";
import type { ChartBounds, PointsArray } from "../../types";
import {
  createRoundedRectPath,
  type RoundedCorners,
} from "../../utils/createRoundedRectPath";

export const useBarGroupPaths = (
  points: PointsArray[],
  chartBounds: ChartBounds,
  betweenGroupPadding = 0,
  withinGroupPadding = 0,
  roundedCorners?: RoundedCorners,
  customBarWidth?: number,
) => {
  const numGroups = points[0]?.length || 0;

  const groupWidth = React.useMemo(() => {
    return (
      ((1 - betweenGroupPadding) * (chartBounds.right - chartBounds.left)) /
      Math.max(1, numGroups)
    );
  }, [betweenGroupPadding, chartBounds.left, chartBounds.right, numGroups]);

  const barWidth = React.useMemo(() => {
    if (customBarWidth) return customBarWidth;
    return ((1 - withinGroupPadding) * groupWidth) / Math.max(1, points.length);
  }, [customBarWidth, groupWidth, points.length, withinGroupPadding]);

  const gapWidth = React.useMemo(() => {
    return (
      (groupWidth - barWidth * points.length) / Math.max(1, points.length - 1)
    );
  }, [barWidth, groupWidth, points.length]);

  const paths = React.useMemo(() => {
    return points.map((pointSet, i) => {
      const p = Skia.Path.Make();
      const offset = -groupWidth / 2 + i * (barWidth + gapWidth);

      pointSet.forEach(({ x, y }) => {
        if (typeof y !== "number") return;

        if (!roundedCorners) {
          p.addRect(
            Skia.XYWHRect(x + offset, y, barWidth, chartBounds.bottom - y),
          );
        } else {
          const roundedRectPath = Skia.Path.MakeFromSVGString(
            createRoundedRectPath(
              x + offset,
              y,
              barWidth,
              chartBounds.bottom - y,
              roundedCorners,
            ),
          );
          roundedRectPath && p.addPath(roundedRectPath);
        }
      });
      return p;
    });
  }, [
    barWidth,
    chartBounds.bottom,
    gapWidth,
    groupWidth,
    points,
    roundedCorners,
  ]);

  return { barWidth, groupWidth, gapWidth, paths };
};
