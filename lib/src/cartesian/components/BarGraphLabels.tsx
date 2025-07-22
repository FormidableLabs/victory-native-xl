import React from "react";
import { Text, type Color, type SkFont } from "@shopify/react-native-skia";
import { getFontGlyphWidth } from "../../utils/getFontGlyphWidth";
import type { ChartBounds, PointsArray } from "../../types";

export type BarLabelConfig = {
  position: "top" | "bottom" | "left" | "right";
  font: SkFont | null;
  color?: Color;
  labelRotate?: number;
  format?: (value: number | string) => string;
};

type BarGraphLabelProps = {
  points: PointsArray;
  chartBounds: ChartBounds;
  barWidth?: number;
  options: BarLabelConfig;
};

// Arbitrary offset so that the label is not touching the bar
const LABEL_OFFSET_FROM_POSITION = 5;

export const BarGraphLabels = ({
  points,
  chartBounds,
  barWidth = 0,
  options,
}: BarGraphLabelProps) => {
  const { position, font, color } = options;

  // Loop over the data points and position each label
  return points.map(({ x, y = 0, yValue }) => {
    // Format labels, if a format function is provided
    const yText = options.format
      ? options.format(yValue ? yValue : "")
      : yValue?.toString() ?? "";

    const labelWidth = getFontGlyphWidth(yText, font);

    let xOffset;
    let yOffset;

    // Bar Edges
    const barInnerLeftEdge = x - barWidth / 2;
    const barOuterRightEdge = x + barWidth / 2;

    // Chart Edges
    const { top: chartInnerTopEdge, bottom: chartInnerBottomEdge } =
      chartBounds;

    // Bar Midpoints
    const barVerticalMidpoint =
      (chartInnerTopEdge + chartInnerBottomEdge + Number(y)) / 2;
    // Move the label left by half its width to properly center the text over the bar
    // const barHorizontalMidpoint = x - labelWidth / 2;

    switch (position) {
      case "top": {
        // Position the label above the bar
        xOffset = x;
        yOffset = Number(y) - LABEL_OFFSET_FROM_POSITION;
        break;
      }
      case "bottom": {
        // Position the label at the bottom of the bar
        xOffset = x;
        // Use the chartBounds here so that the label isn't rendered under the graph
        yOffset = chartInnerBottomEdge - LABEL_OFFSET_FROM_POSITION;
        break;
      }
      case "left": {
        // Position the label to the left of the bar
        // Move the label to the inner left edge then by the labels full width so
        // that the label is not render inside the bar
        xOffset = barInnerLeftEdge - labelWidth - LABEL_OFFSET_FROM_POSITION;
        yOffset = barVerticalMidpoint;
        break;
      }
      case "right": {
        // Position the label to the right of the bar
        // Move the label to the outer right edge of the bar
        xOffset = barOuterRightEdge + LABEL_OFFSET_FROM_POSITION;
        yOffset = barVerticalMidpoint;
        break;
      }
      default: {
        xOffset = x;
        yOffset = Number(y);
      }
    }

    return (
      <Text
        key={`${xOffset}-${yOffset}-${yText}`}
        x={xOffset}
        y={yOffset}
        text={yText}
        font={font}
        color={color}
        // Rotation of the label
        transform={
          options.labelRotate !== undefined
            ? [{ rotate: (options.labelRotate * Math.PI) / 180 }]
            : undefined
        }
        origin={
          options.labelRotate !== undefined
            ? { x: xOffset, y: yOffset }
            : undefined
        }
      />
    );
  });
};
