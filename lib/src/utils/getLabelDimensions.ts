import type { SkFont } from "@shopify/react-native-skia";
import type { AxisLabelDimensions, AxisLabelRenderer } from "../types";

export const getLabelDimensions = ({
  text,
  font,
  labelRenderer,
}: {
  text: string;
  font?: SkFont | null;
  labelRenderer?: AxisLabelRenderer;
}): AxisLabelDimensions => {
  if (labelRenderer) return labelRenderer.measureText(text);

  const width =
    font
      ?.getGlyphWidths(font.getGlyphIDs(text))
      .reduce((sum, value) => sum + value, 0) ?? 0;

  return {
    width,
    height: font?.getSize() ?? 0,
  };
};
