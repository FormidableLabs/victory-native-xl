import * as React from "react";
import {
  StackedBar,
  useStackedBarPaths,
  type ChartBounds,
  type PointsArray,
  type StackedBarOptionsContext,
} from "victory-native";

const POINTS: PointsArray[] = [];
const CHART_BOUNDS: ChartBounds = {
  left: 0,
  right: 100,
  top: 0,
  bottom: 100,
};

const getOpacity = ({
  columnIndex,
  rowIndex,
  isBottom,
  isTop,
  isStart,
  isEnd,
  seriesIndex,
  datumIndex,
}: StackedBarOptionsContext) => {
  const legacyIndexesMatch =
    columnIndex === seriesIndex && rowIndex === datumIndex;
  const hasVisibleEdge = isBottom || isTop || isStart || isEnd;

  return legacyIndexesMatch && hasVisibleEdge ? 1 : 0.5;
};

export function StackedBarOptionsFields() {
  return (
    <StackedBar
      points={POINTS}
      chartBounds={CHART_BOUNDS}
      barOptions={(context) => ({
        opacity: getOpacity(context),
        roundedCorners: context.isEnd ? { topLeft: 4, topRight: 4 } : undefined,
      })}
    />
  );
}

export function UseStackedBarPathsOptionsFields() {
  useStackedBarPaths({
    points: POINTS,
    chartBounds: CHART_BOUNDS,
    barOptions: (context) => ({
      opacity: getOpacity(context),
      children: context.seriesIndex === 0 ? null : undefined,
    }),
  });

  return null;
}
