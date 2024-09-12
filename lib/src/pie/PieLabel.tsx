import {
  Group,
  Paragraph,
  Skia,
  Text,
  useFonts,
  vec,
  type Color,
  type SkFont,
} from "@shopify/react-native-skia";
import React, { type ReactNode } from "react";
import { usePieSliceContext } from "./contexts/PieSliceContext";

type LabelPostion = {
  x: number;
  y: number;
  midAngle: number;
};

export type PieLabelProps = {
  font?: SkFont | null;
  radiusOffset?: number;
  color?: Color;
  text?: string;
  children?: (position: LabelPostion) => ReactNode;
};

const PieLabel = ({
  font,
  radiusOffset = 0.5,
  color = "white",
  text,
  children,
}: PieLabelProps) => {
  const { slice } = usePieSliceContext();
  const labelText = text ?? slice.label;

  const labelWidth =
    font
      ?.getGlyphWidths(font.getGlyphIDs(labelText))
      .reduce((sum, value) => sum + value, 0) ?? 0;

  const RADIAN = Math.PI / 180;
  const radius = slice.radius * radiusOffset;
  const midAngle = (slice.startAngle + slice.endAngle) / 2;
  const x =
    slice.center.x + radius * Math.cos(-midAngle * RADIAN) - labelWidth / 2;
  const y = slice.center.y + radius * Math.sin(midAngle * RADIAN);

  if (children) {
    return children({ x, y, midAngle });
  }

  return (
    font && <Text font={font} text={labelText} x={x} y={y} color={color} />
  );
};

export default PieLabel;
