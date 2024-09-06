import React from "react";
import { Text, type SkFont } from "@shopify/react-native-skia";
import type { ChartBounds, PointsArray } from "lib/src/types";

export type BarLabelConfig = {
  position: "top" | "bottom" | "left" | "right";
  font: SkFont | null;
  color?: string;
};

type BarGraphLabelProps = {
  points: PointsArray;
  chartBounds: ChartBounds;
  barWidth?: number;
  options: BarLabelConfig;
};

export const BarGraphLabels = ({
  points,
  chartBounds,
  barWidth = 0,
  options,
}: BarGraphLabelProps) => {
  const labelPositions = points.map(({ x, y, yValue }) => {
    const yText = yValue?.toString() ?? "";
    const fontWidth = options.font?.measureText(yText).width ?? 1;
    let xOffset;
    let yOffset;

    switch (options.position) {
      case "top": {
        xOffset = x - fontWidth / 2;
        yOffset = (y ?? 0) - 5;
        break;
      }
      case "bottom": {
        xOffset = x - fontWidth / 2;
        yOffset = chartBounds.bottom - 5;
        break;
      }
      case "left": {
        xOffset = x - barWidth / 2 - fontWidth;
        yOffset = (chartBounds.top + (y ?? 0) + chartBounds.bottom) / 2;
        break;
      }
      case "right": {
        xOffset = x + barWidth / 2;
        yOffset = (chartBounds.top + (y ?? 0) + chartBounds.bottom) / 2;
        break;
      }
      default: {
        xOffset = x;
        yOffset = y ?? 0;
      }
    }

    return { x: xOffset, y: yOffset, value: yText };
  });

  return labelPositions.map(({ x, y, value }) => {
    return (
      <Text
        key={`${x}-${y}-${value}`}
        x={x}
        y={y}
        text={value}
        font={options.font}
        color={options.color}
      />
    );
  });
};
