export const getFontGlyphWidth = (text, font) => font
    ?.getGlyphWidths(font.getGlyphIDs(text))
    .reduce((sum, value) => sum + value, 0) ?? 0;
