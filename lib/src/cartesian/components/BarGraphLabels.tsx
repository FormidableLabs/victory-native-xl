import React from "react";
import { Text, vec, type Color, type SkFont } from "@shopify/react-native-skia";
import { getFontGlyphWidth } from "../../utils/getFontGlyphWidth";
import type { ChartBounds, MaybeNumber, PointsArray } from "../../types";
import { useCartesianChartContext } from "../contexts/CartesianChartContext";
import { getBarLabelPosition } from "../utils/getBarLabelPosition";
import { getBarLabelText } from "../utils/getBarLabelText";

export type BarLabelConfig = {
  position: "top" | "bottom" | "left" | "right";
  font: SkFont | null;
  color?: Color;
  formatLabel?: (value: MaybeNumber) => string;
  rotate?: number;
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
  const { position, font, color, formatLabel, rotate } = options;
  const { orientation, xScale } = useCartesianChartContext();

  // Loop over the data points and position each label
  return points.map(({ x, y = 0, yValue }) => {
    const yText = getBarLabelText(yValue, formatLabel);
    const labelWidth = getFontGlyphWidth(yText, font);
    const fontSize = font?.getSize() ?? 0;
    const labelRotate = rotate ?? 0;
    const labelPosition = getBarLabelPosition({
      orientation,
      position,
      x,
      y: Number(y),
      labelWidth,
      fontSize,
      labelRotate,
      barWidth,
      chartBounds,
      baselineX: xScale(0),
    });
    const labelOrigin = labelRotate
      ? vec(labelPosition.x + labelWidth / 2, labelPosition.y - fontSize / 2)
      : undefined;
    const labelTransform = labelRotate
      ? [{ rotate: (Math.PI / 180) * labelRotate }]
      : undefined;

    return (
      <Text
        key={`${labelPosition.x}-${labelPosition.y}-${yText}`}
        x={labelPosition.x}
        y={labelPosition.y}
        text={yText}
        font={font}
        color={color}
        origin={labelOrigin}
        transform={labelTransform}
      />
    );
  });
};
