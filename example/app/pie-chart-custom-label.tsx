import { Group, Text, type SkFont } from "@shopify/react-native-skia";

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

  const isGoodUnits = slice.value > 130;
  const label = slice.label;
  const value = `${slice.value} UNITS`;
  const centerLabel = (font?.getSize() ?? 0) / 2;

  return (
    <Group transform={[{ translateY: -centerLabel }]}>
      <Text
        x={x - getLabelWidth(label) / 2}
        y={y}
        text={label}
        font={font}
        color={"white"}
      />
      <Group>
        <Text
          x={x - getLabelWidth(value) / 2}
          y={y + fontSize}
          text={value}
          font={font}
          color={isGoodUnits ? "limegreen" : "red"}
        />
      </Group>
    </Group>
  );
};
