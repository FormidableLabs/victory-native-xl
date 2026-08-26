import React from "react";
import {
  Paragraph,
  Skia,
  type SkParagraphStyle,
  type SkTextStyle,
  type SkTypefaceFontProvider,
} from "@shopify/react-native-skia";
import type {
  AxisLabelMeasureArgs,
  AxisLabelRenderer,
  AxisLabelRenderArgs,
} from "../../types";

const DEFAULT_PARAGRAPH_LAYOUT_WIDTH = 1_000_000;

export type CreateParagraphLabelRendererOptions<Label = unknown> = {
  paragraphStyle?: SkParagraphStyle;
  textStyle?: SkTextStyle;
  typefaceFontProvider?: SkTypefaceFontProvider | null;
  maxWidth?: number | ((args: AxisLabelMeasureArgs<Label>) => number);
};

const normalizeDimension = (value: number | undefined) =>
  Number.isFinite(value) ? Math.max(0, value ?? 0) : 0;

export const createParagraphLabelRenderer = <Label = unknown,>({
  paragraphStyle,
  textStyle,
  typefaceFontProvider,
  maxWidth,
}: CreateParagraphLabelRendererOptions<Label> = {}): AxisLabelRenderer<Label> => {
  const resolvedTypefaceFontProvider =
    typefaceFontProvider ?? Skia.TypefaceFontProvider.Make();

  const getLayoutWidth = (args: AxisLabelMeasureArgs<Label>) => {
    const width = typeof maxWidth === "function" ? maxWidth(args) : maxWidth;
    return normalizeDimension(width ?? DEFAULT_PARAGRAPH_LAYOUT_WIDTH);
  };

  const buildParagraph = (
    args: AxisLabelMeasureArgs<Label>,
    color?: string,
  ) => {
    const builder = Skia.ParagraphBuilder.Make(
      paragraphStyle ?? {},
      resolvedTypefaceFontProvider,
    );
    const resolvedTextStyle =
      color && !textStyle?.color
        ? { ...textStyle, color: Skia.Color(color) }
        : textStyle;

    builder.pushStyle(resolvedTextStyle ?? {});
    builder.addText(args.text);
    builder.pop();

    const paragraph = builder.build();
    const layoutWidth = getLayoutWidth(args);
    paragraph.layout(layoutWidth);

    return {
      paragraph,
      layoutWidth,
    };
  };

  const measure = (args: AxisLabelMeasureArgs<Label>) => {
    const { paragraph, layoutWidth } = buildParagraph(args);
    const longestLine = normalizeDimension(paragraph.getLongestLine());
    const maxIntrinsicWidth = normalizeDimension(
      paragraph.getMaxIntrinsicWidth(),
    );
    const measuredWidth = Math.max(longestLine, maxIntrinsicWidth);
    const height = normalizeDimension(paragraph.getHeight());

    return {
      width: maxWidth === undefined ? measuredWidth : layoutWidth,
      height,
      fontSize: normalizeDimension(textStyle?.fontSize),
      lineHeight: height,
    };
  };

  const render = (args: AxisLabelRenderArgs<Label>) => {
    const { paragraph } = buildParagraph(args, args.color);
    return (
      <Paragraph
        paragraph={paragraph}
        x={args.x}
        y={args.y}
        width={args.width}
      />
    );
  };

  return {
    measure,
    render,
  };
};
