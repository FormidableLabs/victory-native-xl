import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const paragraphMock = vi.hoisted(() => {
  type MockParagraph = {
    layoutWidth: number;
    layout: (width: number) => void;
    getLongestLine: () => number;
    getMaxIntrinsicWidth: () => number;
    getHeight: () => number;
  };
  type MockBuilder = {
    text: string;
    style: unknown;
    pushStyle: (style: unknown) => MockBuilder;
    addText: (text: string) => MockBuilder;
    pop: () => MockBuilder;
    build: () => MockParagraph;
  };

  const builders: MockBuilder[] = [];
  const paragraphs: MockParagraph[] = [];
  const color = vi.fn((value: string) => ["sk-color", value]);
  const makeTypefaceFontProvider = vi.fn(() => ["font-provider"]);
  const make = vi.fn(() => {
    const builder = {
      text: "",
      style: undefined,
    } as MockBuilder;
    builder.pushStyle = vi.fn((style) => {
      builder.style = style;
      return builder;
    });
    builder.addText = vi.fn((text) => {
      builder.text = text;
      return builder;
    });
    builder.pop = vi.fn(() => builder);
    builder.build = vi.fn(() => {
      const paragraph = {
        layoutWidth: 0,
      } as MockParagraph;
      paragraph.layout = vi.fn((width) => {
        paragraph.layoutWidth = width;
      });
      paragraph.getLongestLine = vi.fn(() => 36);
      paragraph.getMaxIntrinsicWidth = vi.fn(() => 40);
      paragraph.getHeight = vi.fn(() => 18);
      paragraphs.push(paragraph);
      return paragraph;
    });
    builders.push(builder);
    return builder;
  });

  return {
    builders,
    paragraphs,
    color,
    makeTypefaceFontProvider,
    make,
  };
});

vi.mock("@shopify/react-native-skia", () => ({
  Paragraph: () => null,
  Skia: {
    Color: paragraphMock.color,
    TypefaceFontProvider: {
      Make: paragraphMock.makeTypefaceFontProvider,
    },
    ParagraphBuilder: {
      Make: paragraphMock.make,
    },
  },
}));

import { createParagraphLabelRenderer } from "./createParagraphLabelRenderer";

describe("createParagraphLabelRenderer", () => {
  beforeEach(() => {
    paragraphMock.builders.length = 0;
    paragraphMock.paragraphs.length = 0;
    paragraphMock.color.mockClear();
    paragraphMock.makeTypefaceFontProvider.mockClear();
    paragraphMock.make.mockClear();
  });

  it("measures labels with paragraph layout", () => {
    const maxWidthArgs: unknown[] = [];
    const renderer = createParagraphLabelRenderer<string>({
      textStyle: { fontSize: 12 },
      maxWidth: (args) => {
        maxWidthArgs.push(args);
        return 20;
      },
    });

    const measurement = renderer.measure({
      axis: "x",
      orientation: "vertical",
      value: "東京",
      text: "東京",
      index: 1,
    });

    expect(measurement).toEqual({
      width: 20,
      height: 18,
      fontSize: 12,
      lineHeight: 18,
    });
    expect(maxWidthArgs).toEqual([
      {
        axis: "x",
        orientation: "vertical",
        value: "東京",
        text: "東京",
        index: 1,
      },
    ]);
    expect(paragraphMock.builders[0]!.text).toBe("東京");
    expect(paragraphMock.paragraphs[0]!.layoutWidth).toBe(20);
    expect(paragraphMock.makeTypefaceFontProvider).toHaveBeenCalledOnce();
    expect(paragraphMock.make).toHaveBeenCalledWith({}, ["font-provider"]);
  });

  it("uses intrinsic width when it is wider than the laid out longest line", () => {
    const renderer = createParagraphLabelRenderer<string>({
      textStyle: { fontSize: 12 },
    });

    const measurement = renderer.measure({
      axis: "x",
      orientation: "vertical",
      value: "Tokyo",
      text: "Tokyo",
      index: 0,
    });

    expect(measurement.width).toBe(40);
  });

  it("renders a Skia Paragraph with axis label color", () => {
    const renderer = createParagraphLabelRenderer<string>({
      textStyle: { fontSize: 14 },
    });

    const node = renderer.render({
      axis: "y",
      orientation: "horizontal",
      value: "Books",
      text: "Books",
      index: 0,
      x: 11,
      y: 22,
      width: 40,
      height: 18,
      fontSize: 14,
      lineHeight: 18,
      color: "#123456",
      canFitContent: true,
      chartBounds: { left: 0, right: 100, top: 0, bottom: 100 },
    }) as React.ReactElement<{
      x: number;
      y: number;
      width: number;
      paragraph: unknown;
    }>;

    expect(node.props.x).toBe(11);
    expect(node.props.y).toBe(22);
    expect(node.props.width).toBe(40);
    expect(node.props.paragraph).toBe(paragraphMock.paragraphs[0]);
    expect(paragraphMock.color).toHaveBeenCalledWith("#123456");
    expect(paragraphMock.builders[0]!.style).toEqual({
      fontSize: 14,
      color: ["sk-color", "#123456"],
    });
  });
});
