import type { SkFont } from "@shopify/react-native-skia";
import { describe, expect, it } from "vitest";
import { getMaxTextLayout, getTextLayout, getTextLines } from "./textLayout";

const font = {
  getSize: () => 10,
  getGlyphIDs: (text: string) => Array.from(text).map((_, index) => index),
  getGlyphWidths: (glyphs: number[]) => glyphs.map(() => 4),
} as unknown as SkFont;

describe("textLayout", () => {
  it("splits labels on common newline forms", () => {
    expect(getTextLines("A\nB\r\nC\rD")).toEqual(["A", "B", "C", "D"]);
  });

  it("measures multiline labels by their widest line", () => {
    expect(getTextLayout("A\nLong", font)).toEqual({
      lines: ["A", "Long"],
      width: 16,
      height: 20,
      fontSize: 10,
      lineHeight: 10,
    });
  });

  it("returns zero dimensions when no font is provided", () => {
    expect(getTextLayout("A\nLong", null)).toEqual({
      lines: ["A", "Long"],
      width: 0,
      height: 0,
      fontSize: 0,
      lineHeight: 0,
    });
  });

  it("measures max text layout by widest label and tallest label", () => {
    expect(getMaxTextLayout(["A\nLong", "WiderLine"], font)).toEqual({
      width: 36,
      height: 20,
      fontSize: 10,
      lineHeight: 10,
    });
  });

  it("returns zero max layout for no labels", () => {
    expect(getMaxTextLayout([], font)).toEqual({
      width: 0,
      height: 0,
      fontSize: 10,
      lineHeight: 10,
    });
  });
});
