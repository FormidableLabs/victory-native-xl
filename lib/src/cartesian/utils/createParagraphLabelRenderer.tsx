import React from "react";
import {
  Paragraph,
  Skia,
  type SkColor,
  type SkParagraphStyle,
  type SkTextStyle,
  type SkTypefaceFontProvider,
} from "@shopify/react-native-skia";
import type { AxisLabelRenderer } from "../../types";

const PARAGRAPH_LAYOUT_WIDTH = 10000;

export type CreateParagraphLabelRendererOptions = {
  paragraphStyle?: SkParagraphStyle;
  textStyle?: Omit<SkTextStyle, "color"> & { color?: SkColor };
  typefaceFontProvider?: SkTypefaceFontProvider;
};

const removeUndefinedValues = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as T;

const buildParagraph = ({
  text,
  color,
  paragraphStyle,
  textStyle,
  typefaceFontProvider,
}: {
  text: string;
  color?: string;
} & CreateParagraphLabelRendererOptions) => {
  const builder = typefaceFontProvider
    ? Skia.ParagraphBuilder.Make(paragraphStyle, typefaceFontProvider)
    : Skia.ParagraphBuilder.Make(paragraphStyle);

  const resolvedColor = color ? Skia.Color(color) : textStyle?.color;
  const style = removeUndefinedValues({
    ...(textStyle ?? {}),
    color: resolvedColor,
  });

  builder.pushStyle(style);
  builder.addText(text);

  const paragraph = builder.build();
  paragraph.layout(PARAGRAPH_LAYOUT_WIDTH);

  const width = Math.ceil(
    Math.max(paragraph.getLongestLine(), paragraph.getMaxIntrinsicWidth(), 0),
  );
  const height = Math.ceil(paragraph.getHeight());

  if (width > 0) {
    paragraph.layout(width);
  }

  return {
    paragraph,
    width,
    height,
  };
};

export const createParagraphLabelRenderer = ({
  paragraphStyle,
  textStyle,
  typefaceFontProvider,
}: CreateParagraphLabelRendererOptions = {}): AxisLabelRenderer => ({
  measureText: (text) => {
    const { width, height } = buildParagraph({
      text,
      paragraphStyle,
      textStyle,
      typefaceFontProvider,
    });

    return { width, height };
  },
  render: ({ text, color, x, y, width }) => {
    const { paragraph } = buildParagraph({
      text,
      color,
      paragraphStyle,
      textStyle,
      typefaceFontProvider,
    });

    return <Paragraph paragraph={paragraph} x={x} y={y} width={width} />;
  },
});
