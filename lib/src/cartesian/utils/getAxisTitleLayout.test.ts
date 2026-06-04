import type { SkFont } from "@shopify/react-native-skia";
import { describe, expect, it } from "vitest";
import {
  getAxisTitleLayout,
  getRotatedYAxisTitleBaselineY,
} from "./getAxisTitleLayout";

const font = {
  getSize: () => 10,
  getGlyphIDs: (text: string) => Array.from(text).map((_, index) => index),
  getGlyphWidths: (glyphs: number[]) => glyphs.map(() => 4),
} as unknown as SkFont;

describe("getAxisTitleLayout", () => {
  it("falls back to the axis font when the title does not provide one", () => {
    expect(
      getAxisTitleLayout({
        title: { text: "Revenue" },
        font,
      }),
    ).toMatchObject({
      font,
      width: 28,
      height: 10,
      fontSize: 10,
      hasContent: true,
    });
  });

  it("respects a null title font as an explicit disabled font", () => {
    expect(
      getAxisTitleLayout({
        title: { text: "Revenue", font: null },
        font,
      }),
    ).toMatchObject({
      font: null,
      width: 0,
      height: 0,
      fontSize: 0,
      hasContent: false,
    });
  });

  it("keeps single-line rotated y-axis title baselines unchanged", () => {
    const layout = getAxisTitleLayout({
      title: { text: "Revenue", font },
      font,
    });

    expect(getRotatedYAxisTitleBaselineY(layout)).toBe(0);
  });

  it("anchors multiline rotated y-axis title blocks by their chart-facing edge", () => {
    const layout = getAxisTitleLayout({
      title: { text: "Gross\nRevenue", font },
      font,
    });

    expect(getRotatedYAxisTitleBaselineY(layout)).toBe(-10);
  });
});
