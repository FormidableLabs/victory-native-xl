import type { SkFont } from "@shopify/react-native-skia";
import { describe, expect, it } from "vitest";
import { getTextLayout, getTextLines } from "./textLayout";

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
});
