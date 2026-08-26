import type { CartesianChartOrientation, ChartBounds } from "../../types";

type BarLabelPosition = "top" | "bottom" | "left" | "right";

export const getBarLabelPosition = ({
  orientation,
  position,
  x,
  y,
  labelWidth,
  fontSize,
  labelRotate = 0,
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
  labelRotate?: number;
  barWidth: number;
  chartBounds: ChartBounds;
  baselineX?: number;
}) => {
  const rotatedLabelOutwardOffset = getRotatedLabelOutwardOffset({
    labelWidth,
    fontSize,
    labelRotate,
  });

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
          y:
            barInnerTopEdge -
            LABEL_OFFSET_FROM_POSITION -
            rotatedLabelOutwardOffset,
        };
      case "bottom":
        return {
          x: barHorizontalMidpoint - labelWidth / 2,
          y:
            barOuterBottomEdge +
            fontSize +
            LABEL_OFFSET_FROM_POSITION +
            rotatedLabelOutwardOffset,
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
        y: y - LABEL_OFFSET_FROM_POSITION - rotatedLabelOutwardOffset,
      };
    case "bottom":
      return {
        x: barHorizontalMidpoint,
        y:
          chartBounds.bottom -
          LABEL_OFFSET_FROM_POSITION -
          rotatedLabelOutwardOffset,
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

const getRotatedLabelOutwardOffset = ({
  labelWidth,
  fontSize,
  labelRotate,
}: {
  labelWidth: number;
  fontSize: number;
  labelRotate: number;
}) => {
  if (!labelRotate || !labelWidth || !fontSize) return 0;

  const radians = Math.abs((Math.PI / 180) * labelRotate);
  const rotatedHalfHeight =
    (Math.abs(labelWidth * Math.sin(radians)) +
      Math.abs(fontSize * Math.cos(radians))) /
    2;
  const unrotatedHalfHeight = fontSize / 2;

  return Math.max(0, rotatedHalfHeight - unrotatedHalfHeight);
};

// Arbitrary offset so that the label is not touching the bar.
const LABEL_OFFSET_FROM_POSITION = 5;
