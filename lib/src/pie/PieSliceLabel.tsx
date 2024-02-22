import React from "react";
import {
  Text,
  Skia,
  type TextProps,
  type SkFont,
} from "@shopify/react-native-skia";
import {
  calculatePointOnCircumference,
  degreesToRadians,
} from "./utils/radians";
import { usePieSliceContext } from "./contexts/PieSliceContext";

type AdditionalPathProps = Partial<Omit<TextProps, "font">>;

type PieSliceLabelDataProps = {
  font: SkFont | null;
} & AdditionalPathProps;

export const PieSliceLabel = ({ font }: PieSliceLabelDataProps) => {
  const { slice } = usePieSliceContext();
  const { startAngle, endAngle, label, radius, center } = slice;

  // Create a paint object for the text
  const textPaint = Skia.Paint();
  textPaint.setAntiAlias(true);
  textPaint.setColor(Skia.Color("black"));

  // Calculate the midpoint angle of the slice
  const midAngleRadians = degreesToRadians((startAngle + endAngle) / 2);

  // Position the label halfway between the center of the pie and the edge of the slice
  const labelRadius2 = radius / 2;
  const labelPosition = calculatePointOnCircumference(
    center,
    labelRadius2,
    midAngleRadians,
  );

  return (
    <Text
      font={font}
      x={labelPosition.x}
      y={labelPosition.y}
      text={label}
      paint={textPaint}
    />
  );
};
