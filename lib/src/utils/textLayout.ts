import type { SkFont } from "@shopify/react-native-skia";

export type TextLayout = {
  lines: string[];
  width: number;
  height: number;
  fontSize: number;
  lineHeight: number;
};

export type TextLayoutDimensions = Pick<
  TextLayout,
  "width" | "height" | "fontSize" | "lineHeight"
>;

export const getTextLines = (text: string) => text.split(/\r\n|\r|\n/);

export const getTextLayout = (
  text: string,
  font?: SkFont | null,
): TextLayout => {
  const lines = getTextLines(text);
  const fontSize = font?.getSize() ?? 0;
  const lineHeight = fontSize;
  const width = Math.max(
    0,
    ...lines.map((line) => {
      if (!font) return 0;
      const glyphIDs = font.getGlyphIDs(line);
      const widths = font.getGlyphWidths?.(glyphIDs) ?? [];
      return widths.reduce((sum, value) => sum + value, 0);
    }),
  );

  return {
    lines,
    width,
    height: lines.length * lineHeight,
    fontSize,
    lineHeight,
  };
};

export const getMaxTextLayout = (
  labels: string[],
  font?: SkFont | null,
): TextLayoutDimensions => {
  const fontSize = font?.getSize() ?? 0;
  const lineHeight = fontSize;

  return labels.reduce<TextLayoutDimensions>(
    (max, label) => {
      const layout = getTextLayout(label, font);
      return {
        width: Math.max(max.width, layout.width),
        height: Math.max(max.height, layout.height),
        fontSize: layout.fontSize,
        lineHeight: layout.lineHeight,
      };
    },
    { width: 0, height: 0, fontSize, lineHeight },
  );
};
