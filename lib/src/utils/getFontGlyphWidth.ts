import type { SkFont } from "react-native-skia";

export const getFontGlyphWidth = (text: string, font?: SkFont | null) =>
  font
    ?.getGlyphWidths(font.getGlyphIDs(text))
    .reduce((sum, value) => sum + value, 0) ?? 0;
