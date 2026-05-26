import React from "react";
import { Text, type Color, type SkFont } from "@shopify/react-native-skia";
import { getFontGlyphWidth } from "../../utils/getFontGlyphWidth";
import type { ChartBounds, PointsArray } from "../../types";
import { useCartesianChartContext } from "../contexts/CartesianChartContext";
import { getBarLabelPosition } from "../utils/getBarLabelPosition";

export type BarLabelConfig = {
  position: "top" | "bottom" | "left" | "right";
  font: SkFont | null;
  color?: Color;
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
  const { position, font, color } = options;
  const { orientation, xScale } = useCartesianChartContext();

  // Loop over the data points and position each label
  return points.map(({ x, y = 0, yValue }) => {
    const yText = yValue?.toString() ?? "";
    const labelWidth = getFontGlyphWidth(yText, font);
    const fontSize = font?.getSize() ?? 0;
    const labelPosition = getBarLabelPosition({
      orientation,
      position,
      x,
      y: Number(y),
      labelWidth,
      fontSize,
      barWidth,
      chartBounds,
      baselineX: xScale(0),
    });

    return (
      <Text
        key={`${labelPosition.x}-${labelPosition.y}-${yText}`}
        x={labelPosition.x}
        y={labelPosition.y}
        text={yText}
        font={font}
        color={color}
      />
    );
  });
};
