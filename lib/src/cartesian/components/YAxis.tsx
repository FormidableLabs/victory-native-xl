import React from "react";
import { Group, Line, Text, vec } from "@shopify/react-native-skia";
import { boundsToClip } from "../../utils/boundsToClip";
import type {
  InputDatum,
  NumericalFields,
  ValueOf,
  YAxisProps,
} from "../../types";
import {
  getAxisTitleLayout,
  getRotatedYAxisTitleBaselineY,
} from "../utils/getAxisTitleLayout";
import { getAxisLabelLayout } from "../utils/getAxisLabelLayout";
export { YAxisDefaults } from "../utils/axisDefaults";

export const YAxis = <
  RawData extends Record<string, unknown>,
  YK extends keyof NumericalFields<RawData>,
  Label = RawData[YK],
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
  title,
  labelRenderer,
  formatYLabel = (label: ValueOf<InputDatum>) => String(label),
  linePathEffect,
  chartBounds,
  orientation,
}: YAxisProps<RawData, YK, Label>) => {
  const [x1 = 0, x2 = 0] = xScale.domain();
  const [_ = 0, y2 = 0] = yScale.domain();
  const fontSize = font?.getSize() ?? 0;
  const yTickLabels = yTicksNormalized.map((tick, index) => {
    const contentY = String(formatYLabel(tick as never));
    const labelLayout = getAxisLabelLayout({
      axis: "y",
      orientation,
      value: tick as Label,
      text: contentY,
      index,
      font,
      labelRenderer,
    });
    return {
      tick,
      labelLayout,
    };
  });
  const maxYLabelWidth = Math.max(
    0,
    ...yTickLabels.map(({ labelLayout }) => labelLayout.width),
  );
  const labelOutset =
    labelPosition === "outset" && yTickLabels.length > 0 && maxYLabelWidth > 0
      ? maxYLabelWidth + labelOffset
      : 0;
  const titleLayout = getAxisTitleLayout({ title, font });
  const titleFont = titleLayout.font;
  const titleBaselineY = getRotatedYAxisTitleBaselineY(titleLayout);
  const titleX =
    axisSide === "left"
      ? chartBounds.left - labelOutset - titleLayout.offset
      : chartBounds.right + labelOutset + titleLayout.offset;
  const titleCenterY = (() => {
    if (titleLayout.position === "start") {
      return chartBounds.top + titleLayout.width / 2;
    }
    if (titleLayout.position === "end") {
      return chartBounds.bottom - titleLayout.width / 2;
    }
    return chartBounds.top + (chartBounds.bottom - chartBounds.top) / 2;
  })();
  const titleNodes =
    titleLayout.hasContent && titleFont
      ? titleLayout.lines.map((line, index) => (
          <Text
            key={`y-axis-title-line-${index}`}
            color={titleLayout.color ?? labelColor}
            text={line}
            font={titleFont}
            y={titleBaselineY + index * titleLayout.lineHeight}
            x={-titleLayout.width / 2}
          />
        ))
      : null;

  const yAxisNodes = yTickLabels.map(({ tick, labelLayout }) => {
    const labelWidth = labelLayout.width;
    const labelY =
      yScale(tick) +
      fontSize / 3 -
      Math.max(0, labelLayout.height - fontSize) / 2;
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
    const labelTopY = yScale(tick) - labelLayout.height / 2;

    const lastLabelY =
      labelY + (labelLayout.lines.length - 1) * labelLayout.lineHeight;
    const canFitLabelContent = labelY > fontSize && lastLabelY < yScale(y2);
    const canFitCustomLabel =
      labelTopY >= chartBounds.top &&
      labelTopY + labelLayout.height <= chartBounds.bottom;

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
        {labelRenderer
          ? labelWidth > 0 && labelLayout.height > 0
            ? labelRenderer.render({
                axis: "y",
                orientation,
                value: labelLayout.value,
                text: labelLayout.text,
                index: labelLayout.index,
                x: labelX,
                y: labelTopY,
                width: labelLayout.width,
                height: labelLayout.height,
                fontSize: labelLayout.fontSize,
                lineHeight: labelLayout.lineHeight,
                color: labelColor,
                canFitContent: canFitCustomLabel,
                chartBounds,
              })
            : null
          : font
            ? canFitLabelContent && (
                <>
                  {labelLayout.lines.map((line, index) => (
                    <Text
                      key={`y-tick-${tick}-label-line-${index}`}
                      color={labelColor}
                      text={line}
                      font={font}
                      y={labelY + index * labelLayout.lineHeight}
                      x={labelX}
                    />
                  ))}
                </>
              )
            : null}
      </React.Fragment>
    );
  });

  return (
    <>
      {yAxisNodes}
      {titleNodes ? (
        <Group
          transform={[
            { translateX: titleX },
            { translateY: titleCenterY },
            { rotate: axisSide === "right" ? Math.PI / 2 : -Math.PI / 2 },
          ]}
        >
          {titleNodes}
        </Group>
      ) : null}
    </>
  );
};
