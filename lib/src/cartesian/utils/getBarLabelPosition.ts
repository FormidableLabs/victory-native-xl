import type { CartesianChartOrientation, ChartBounds } from "../../types";

type BarLabelPosition = "top" | "bottom" | "left" | "right";

export const getBarLabelPosition = ({
  orientation,
  position,
  x,
  y,
  labelWidth,
  fontSize,
  barWidth,
  chartBounds,
  baselineX = 0,
}: {
  orientation: CartesianChartOrientation;
  position: BarLabelPosition;
  x: number;
  y: number;
  labelWidth: number;
  fontSize: number;
  barWidth: number;
  chartBounds: ChartBounds;
  baselineX?: number;
}) => {
  if (orientation === "horizontal") {
    const barInnerLeftEdge = Math.min(baselineX, x);
    const barOuterRightEdge = Math.max(baselineX, x);
    const barInnerTopEdge = y - barWidth / 2;
    const barOuterBottomEdge = y + barWidth / 2;
    const barHorizontalMidpoint =
      barInnerLeftEdge + (barOuterRightEdge - barInnerLeftEdge) / 2;
    const barVerticalMidpoint = y + fontSize / 3;

    switch (position) {
      case "top":
        return {
          x: barHorizontalMidpoint - labelWidth / 2,
          y: barInnerTopEdge - LABEL_OFFSET_FROM_POSITION,
        };
      case "bottom":
        return {
          x: barHorizontalMidpoint - labelWidth / 2,
          y: barOuterBottomEdge + fontSize + LABEL_OFFSET_FROM_POSITION,
        };
      case "left":
        return {
          x: barInnerLeftEdge - labelWidth - LABEL_OFFSET_FROM_POSITION,
          y: barVerticalMidpoint,
        };
      case "right":
        return {
          x: barOuterRightEdge + LABEL_OFFSET_FROM_POSITION,
          y: barVerticalMidpoint,
        };
    }
  }

  const barInnerLeftEdge = x - barWidth / 2;
  const barOuterRightEdge = x + barWidth / 2;
  const barVerticalMidpoint = (chartBounds.top + chartBounds.bottom + y) / 2;
  const barHorizontalMidpoint = x - labelWidth / 2;

  switch (position) {
    case "top":
      return {
        x: barHorizontalMidpoint,
        y: y - LABEL_OFFSET_FROM_POSITION,
      };
    case "bottom":
      return {
        x: barHorizontalMidpoint,
        y: chartBounds.bottom - LABEL_OFFSET_FROM_POSITION,
      };
    case "left":
      return {
        x: barInnerLeftEdge - labelWidth - LABEL_OFFSET_FROM_POSITION,
        y: barVerticalMidpoint,
      };
    case "right":
      return {
        x: barOuterRightEdge + LABEL_OFFSET_FROM_POSITION,
        y: barVerticalMidpoint,
      };
  }
};

// Arbitrary offset so that the label is not touching the bar.
const LABEL_OFFSET_FROM_POSITION = 5;
