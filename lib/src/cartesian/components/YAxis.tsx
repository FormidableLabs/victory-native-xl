import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Group, Line, Text, vec } from "@shopify/react-native-skia";
import { getFontGlyphWidth } from "../../utils/getFontGlyphWidth";
import { boundsToClip } from "../../utils/boundsToClip";
import type {
  InputDatum,
  NumericalFields,
  ValueOf,
  YAxisProps,
  YAxisPropsWithDefaults,
} from "../../types";

export const YAxis = <
  RawData extends Record<string, unknown>,
  YK extends keyof NumericalFields<RawData>,
>({
  xScale,
  yScale,
  yTicksNormalized,
  axisSide,
  labelPosition,
  labelOffset,
  labelColor,
  lineWidth,
  lineColor,
  font,
  formatYLabel = (label: ValueOf<InputDatum>) => String(label),
  linePathEffect,
  chartBounds,
  title,
}: YAxisProps<RawData, YK>) => {
  const [x1 = 0, x2 = 0] = xScale.domain();
  const [_ = 0, y2 = 0] = yScale.domain();
  const fontSize = font?.getSize() ?? 0;
  const yAxisNodes = yTicksNormalized.map((tick) => {
    const contentY = formatYLabel(tick as never);
    const labelWidth =
      font
        ?.getGlyphWidths?.(font.getGlyphIDs(contentY))
        .reduce((sum, value) => sum + value, 0) ?? 0;
    const labelY = yScale(tick) + fontSize / 3;
    const labelX = (() => {
      // left, outset
      if (axisSide === "left" && labelPosition === "outset") {
        return chartBounds.left - (labelWidth + labelOffset);
      }
      // left, inset
      if (axisSide === "left" && labelPosition === "inset") {
        return chartBounds.left + labelOffset;
      }
      // right, outset
      if (axisSide === "right" && labelPosition === "outset") {
        return chartBounds.right + labelOffset;
      }
      // right, inset
      return chartBounds.right - (labelWidth + labelOffset);
    })();

    const canFitLabelContent = labelY > fontSize && labelY < yScale(y2);

    return (
      <React.Fragment key={`y-tick-${tick}`}>
        {lineWidth > 0 ? (
          <Group clip={boundsToClip(chartBounds)}>
            <Line
              p1={vec(xScale(x1), yScale(tick))}
              p2={vec(xScale(x2), yScale(tick))}
              color={lineColor}
              strokeWidth={lineWidth}
            >
              {linePathEffect ? linePathEffect : null}
            </Line>
          </Group>
        ) : null}
        {font
          ? canFitLabelContent && (
              <Text
                color={labelColor}
                text={contentY}
                font={font}
                y={labelY}
                x={labelX}
              />
            )
          : null}
      </React.Fragment>
    );
  });

  const AxisTitle = useMemo(() => {
    if (!title) return null;

    const {
      text,
      position: titlePosition = "center",
      xOffset = 2,
      font: titleFont,
    } = title;

    const titleFontToUse = titleFont ?? font;
    const titleWidth = getFontGlyphWidth(text, titleFontToUse);
    const isRightSide = axisSide === "right";

    // Calculate vertical position
    const titleY = (() => {
      const center = (chartBounds.bottom + chartBounds.top) / 2;
      if (titlePosition === "top") return chartBounds.top;
      if (titlePosition === "bottom") return chartBounds.bottom;
      return center;
    })();

    // Calculate horizontal offset from axis
    const baseOffset = fontSize * 2 + labelOffset + (xOffset ?? 0);
    const translateX = isRightSide
      ? chartBounds.right + baseOffset
      : chartBounds.left - baseOffset;

    return (
      <Group
        transform={[
          { translateX },
          { translateY: titleY },
          { rotate: isRightSide ? Math.PI / 2 : -Math.PI / 2 },
        ]}
      >
        <Text
          color={labelColor}
          text={text}
          font={titleFontToUse!}
          x={-titleWidth / 2} // Center text horizontally
          y={0}
        />
      </Group>
    );
  }, [title, chartBounds, font, labelOffset, fontSize, labelColor, axisSide]);

  return (
    <>
      {yAxisNodes}
      {AxisTitle}
    </>
  );
};

export const YAxisDefaults = {
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  lineWidth: StyleSheet.hairlineWidth,
  tickCount: 5,
  labelOffset: 4,
  axisSide: "left",
  labelPosition: "outset",
  formatYLabel: (label: ValueOf<InputDatum>) => String(label),
  labelColor: "#000000",
  yKeys: [],
  domain: null,
} satisfies YAxisPropsWithDefaults<never, never>;
