import * as React from "react";
import type { SkPath } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";
import type { ChartBounds, PointsArray, Tuple } from "../../types";

export const useBarGroupPaths = <N extends number>(
  points: Tuple<PointsArray, N>,
  chartBounds: ChartBounds,
  betweenGroupPadding = 0,
  withinGroupPadding = 0,
) => {
  const numGroups = points[0]?.length || 0;

  const groupWidth = React.useMemo(() => {
    return (
      ((1 - betweenGroupPadding) * (chartBounds.right - chartBounds.left)) /
      Math.max(1, numGroups)
    );
  }, [betweenGroupPadding, chartBounds.left, chartBounds.right, numGroups]);

  const barWidth = React.useMemo(() => {
    return ((1 - withinGroupPadding) * groupWidth) / Math.max(1, points.length);
  }, [groupWidth, points.length, withinGroupPadding]);

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
        p.addRect(
          Skia.XYWHRect(x + offset, y, barWidth, chartBounds.bottom - y),
        );
      });
      return p;
    }) as Tuple<SkPath, N>;
  }, [barWidth, chartBounds.bottom, gapWidth, groupWidth, points]);

  return { barWidth, groupWidth, gapWidth, paths };
};
