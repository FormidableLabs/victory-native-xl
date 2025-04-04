import { Text, type Color, type SkFont } from "@shopify/react-native-skia";
import React, { type ReactNode } from "react";
import { usePieSliceContext } from "./contexts/PieSliceContext";
import { getFontGlyphWidth } from "../utils/getFontGlyphWidth";

type LabelPosition = {
  x: number;
  y: number;
  midAngle: number;
};

export type PieLabelProps = {
  font?: SkFont | null;
  radiusOffset?: number;
  color?: Color;
  text?: string;
  children?: (position: LabelPosition) => ReactNode;
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

  const labelWidth = getFontGlyphWidth(labelText, font);

  const RADIAN = Math.PI / 180;

  // Offset from the slice radius to help position the label
  const radius = slice.radius * radiusOffset;

  // Middle angle of the slice
  const midAngle = (slice.startAngle + slice.endAngle) / 2;

  // Center coordinates of slice
  const x = slice.center.x + radius * Math.cos(-midAngle * RADIAN);
  const y = slice.center.y + radius * Math.sin(midAngle * RADIAN);

  if (children) return children({ x, y, midAngle });

  return (
    font && (
      <Text
        font={font}
        text={labelText}
        x={x - labelWidth / 2}
        y={y}
        color={color}
      />
    )
  );
};

export default PieLabel;
