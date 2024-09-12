import {
  Group,
  RoundedRect,
  Text,
  type SkFont,
} from "@shopify/react-native-skia";

import React from "react";
import type { PieSliceData } from "victory-native";

export const PieChartCustomLabel = ({
  slice,
  font,
  position,
}: {
  slice: PieSliceData;
  font: SkFont | null;
  position: { x: number; y: number };
}) => {
  const { x, y } = position;
  const fontSize = font?.getSize() ?? 0;
  const getLabelWidth = (text: string) =>
    font
      ?.getGlyphWidths(font.getGlyphIDs(text))
      .reduce((sum, value) => sum + value, 0) ?? 0;

  const isGood = slice.value > 130;
  const label = slice.label;
  const value = `${slice.value} UNITS`;

  return (
    <Group transform={[{ translateY: -(font?.getSize() ?? 0) }]}>
      <Text
        x={x - getLabelWidth(label) / 2}
        y={y}
        text={label}
        font={font}
        color={"white"}
      />
      <Group>
        <RoundedRect
          color={"balck"}
          height={fontSize * 2}
          width={getLabelWidth(value) + 10}
          x={x - (getLabelWidth(value) + 10) / 2}
          y={y + fontSize / 4}
          r={5}
        />
        <Text
          x={x - getLabelWidth(value) / 2}
          y={y + fontSize + 5}
          text={value}
          font={font}
          color={isGood ? "limegreen" : "red"}
        />
      </Group>
    </Group>
  );
};
