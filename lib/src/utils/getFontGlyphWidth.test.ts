import { describe, it, expect } from "vitest";
import type { SkFont } from "@shopify/react-native-skia";
import { getFontGlyphWidth } from "./getFontGlyphWidth";

describe("getFontGlyphWidth", () => {
  it("returns 0 when font is null", () => {
    expect(getFontGlyphWidth("test", null)).toBe(0);
  });

  it("returns 0 when font is undefined", () => {
    expect(getFontGlyphWidth("test", undefined)).toBe(0);
  });

  it("calculates width correctly with mock font", () => {
    // Create a mock SkFont
    const mockFont = {
      getGlyphIDs: (text: string) => {
        // Return an array of the same length as the input string
        return Array.from({ length: text.length }, (_, i) => i);
      },
      getGlyphWidths: (glyphIDs: number[]) => {
        // Return a fixed width (10) for each glyph
        return Array.from({ length: glyphIDs.length }, () => 10);
      },
    } as SkFont;

    // Test with different strings
    expect(getFontGlyphWidth("a", mockFont)).toBe(10); // 1 character * 10
    expect(getFontGlyphWidth("ab", mockFont)).toBe(20); // 2 characters * 10
    expect(getFontGlyphWidth("test", mockFont)).toBe(40); // 4 characters * 10
    expect(getFontGlyphWidth("", mockFont)).toBe(0); // Empty string
  });

  it("handles varying glyph widths", () => {
    // Create a mock font with varying glyph widths
    const mockFont = {
      getGlyphIDs: (text: string) => {
        return Array.from({ length: text.length }, (_, i) => i);
      },
      getGlyphWidths: (glyphIDs: number[]) => {
        // Return increasing widths (5, 10, 15, 20, ...)
        return Array.from({ length: glyphIDs.length }, (_, i) => (i + 1) * 5);
      },
    } as SkFont;

    // Test with different strings
    expect(getFontGlyphWidth("a", mockFont)).toBe(5); // 5
    expect(getFontGlyphWidth("ab", mockFont)).toBe(15); // 5 + 10
    expect(getFontGlyphWidth("abc", mockFont)).toBe(30); // 5 + 10 + 15
  });
}); 