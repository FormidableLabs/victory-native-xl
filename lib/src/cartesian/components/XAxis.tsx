import React from "react";
import { StyleSheet } from "react-native";
import {
  Group,
  Line,
  Text,
  vec,
  type SkPoint,
} from "@shopify/react-native-skia";
import { getOffsetFromAngle } from "../../utils/getOffsetFromAngle";
import { boundsToClip } from "../../utils/boundsToClip";
import { DEFAULT_TICK_COUNT } from "../../utils/tickHelpers";
import { getXAxisLabelPosition } from "../utils/getXAxisLabelPosition";
import type { InputDatum, InputFields, ValueOf, XAxisProps } from "../../types";
import { getXAxisTicks } from "../utils/getXAxisTicks";
import { getAxisTitleLayout } from "../utils/getAxisTitleLayout";
import { getAxisLabelLayout } from "../utils/getAxisLabelLayout";
export { XAxisDefaults } from "../utils/axisDefaults";

export const XAxis = <
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  Label = InputFields<RawData>[XK],
>({
  xScale: xScaleProp,
  yScale,
  axisSide = "bottom",
  labelPosition = "outset",
  labelRotate,
  tickCount = DEFAULT_TICK_COUNT,
  tickValues,
  labelOffset = 2,
  labelColor = "#000000",
  lineWidth = StyleSheet.hairlineWidth,
  lineColor = "hsla(0, 0%, 0%, 0.25)",
  font,
  title,
  labelRenderer,
  formatXLabel = (label: ValueOf<InputDatum>) => String(label),
  ix = [],
  isNumericalData,
  linePathEffect,
  chartBounds,
  orientation,
  enableRescaling,
  zoom,
}: XAxisProps<RawData, XK, Label>) => {
  const xScale = zoom ? zoom.rescaleX(xScaleProp) : xScaleProp;
  const [y1 = 0, y2 = 0] = yScale.domain();
  const fontSize = font?.getSize() ?? 0;
  const xTicksNormalized = getXAxisTicks({
    isNumericalData,
    ix,
    tickCount,
    tickValues,
    xScale: enableRescaling ? xScale : xScaleProp,
  });
  const xTickLabels = xTicksNormalized.map((tick, index) => {
    const tickPosition = xScale(tick);
    const val = (isNumericalData ? tick : ix[tick]) as Label;
    const contentX = String(formatXLabel(val as never));
    const labelLayout = getAxisLabelLayout({
      axis: "x",
      orientation,
      value: val,
      text: contentX,
      index,
      font,
      labelRenderer,
    });
    return {
      tick,
      tickPosition,
      labelLayout,
    };
  });
  const maxXLabelLayout = xTickLabels.reduce(
    (max, { labelLayout }) => ({
      width: Math.max(max.width, labelLayout.width),
      height: Math.max(max.height, labelLayout.height),
    }),
    { width: 0, height: 0 },
  );
  const titleLayout = getAxisTitleLayout({ title, font });
  const labelOutset =
    labelPosition === "outset" &&
    xTickLabels.length > 0 &&
    maxXLabelLayout.width > 0
      ? maxXLabelLayout.height + labelOffset * 2
      : 0;

  const titleX = (() => {
    if (titleLayout.position === "start") {
      return chartBounds.left;
    }
    if (titleLayout.position === "end") {
      return chartBounds.right - titleLayout.width;
    }
    return (
      chartBounds.left +
      (chartBounds.right - chartBounds.left) / 2 -
      titleLayout.width / 2
    );
  })();
  const titleY = (() => {
    if (axisSide === "bottom") {
      return (
        chartBounds.bottom +
        labelOutset +
        titleLayout.offset +
        titleLayout.fontSize
      );
    }
    return (
      chartBounds.top -
      labelOutset -
      titleLayout.offset -
      Math.max(0, titleLayout.height - titleLayout.fontSize)
    );
  })();
  const titleFont = titleLayout.font;
  const titleNodes =
    titleLayout.hasContent && titleFont
      ? titleLayout.lines.map((line, index) => (
          <Text
            key={`x-axis-title-line-${index}`}
            color={titleLayout.color ?? labelColor}
            text={line}
            font={titleFont}
            y={titleY + index * titleLayout.lineHeight}
            x={titleX}
          />
        ))
      : null;

  const xAxisNodes = xTickLabels.map(({ tick, tickPosition, labelLayout }) => {
    const p1 = vec(tickPosition, yScale(y2));
    const p2 = vec(tickPosition, yScale(y1));

    const labelWidth = labelLayout.width;
    const { canRenderLabel, labelX, labelCenterX } = getXAxisLabelPosition({
      tickPosition,
      labelWidth,
      chartBounds,
    });

    const labelY = (() => {
      const multilineOffset = Math.max(0, labelLayout.height - fontSize);

      // bottom, outset
      if (axisSide === "bottom" && labelPosition === "outset") {
        return chartBounds.bottom + labelOffset + fontSize;
      }
      // bottom, inset
      if (axisSide === "bottom" && labelPosition === "inset") {
        return yScale(y2) - labelOffset - multilineOffset;
      }
      // top, outset
      if (axisSide === "top" && labelPosition === "outset") {
        return yScale(y1) - labelOffset - multilineOffset;
      }
      // top, inset
      return yScale(y1) + fontSize + labelOffset;
    })();
    const labelTopY = (() => {
      if (axisSide === "bottom" && labelPosition === "outset") {
        return chartBounds.bottom + labelOffset;
      }
      if (axisSide === "bottom" && labelPosition === "inset") {
        return yScale(y2) - labelOffset - labelLayout.height;
      }
      if (axisSide === "top" && labelPosition === "outset") {
        return yScale(y1) - labelOffset - labelLayout.height;
      }
      return yScale(y1) + labelOffset;
    })();

    // Calculate origin and translate for label rotation
    const { origin, rotateOffset } = ((): {
      origin: SkPoint | undefined;
      rotateOffset: number;
    } => {
      let rotateOffset = 0;
      let origin;

      // return defaults if no labelRotate is provided
      if (!labelRotate) return { origin, rotateOffset };

      if (axisSide === "bottom" && labelPosition === "outset") {
        // bottom, outset
        origin = vec(labelCenterX, labelY);
        rotateOffset = Math.abs(
          (labelWidth / 2) * getOffsetFromAngle(labelRotate),
        );
      } else if (axisSide === "bottom" && labelPosition === "inset") {
        // bottom, inset
        origin = vec(labelCenterX, labelY);
        rotateOffset = -Math.abs(
          (labelWidth / 2) * getOffsetFromAngle(labelRotate),
        );
      } else if (axisSide === "top" && labelPosition === "inset") {
        // top, inset
        origin = vec(labelCenterX, labelY - fontSize / 4);
        rotateOffset = Math.abs(
          (labelWidth / 2) * getOffsetFromAngle(labelRotate),
        );
      } else {
        // top, outset
        origin = vec(labelCenterX, labelY - fontSize / 4);
        rotateOffset = -Math.abs(
          (labelWidth / 2) * getOffsetFromAngle(labelRotate),
        );
      }

      return { origin, rotateOffset };
    })();
    const customOrigin = vec(
      labelX + labelLayout.width / 2,
      labelTopY + labelLayout.height / 2,
    );
    const canRenderCustomLabel =
      labelWidth > 0 && labelLayout.height > 0 && canRenderLabel;

    return (
      <React.Fragment key={`x-tick-${tick}`}>
        {lineWidth > 0 ? (
          <Group clip={boundsToClip(chartBounds)}>
            <Line p1={p1} p2={p2} color={lineColor} strokeWidth={lineWidth}>
              {linePathEffect ? linePathEffect : null}
            </Line>
          </Group>
        ) : null}
        {labelRenderer ? (
          canRenderCustomLabel ? (
            labelRenderer.render({
              axis: "x",
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
              canFitContent: canRenderLabel,
              chartBounds,
              rotation: labelRotate,
              origin: customOrigin,
            })
          ) : null
        ) : font && labelWidth && canRenderLabel ? (
          <Group transform={[{ translateY: rotateOffset }]}>
            {labelLayout.lines.map((line, index) => (
              <Text
                key={`x-tick-${tick}-label-line-${index}`}
                transform={[
                  {
                    rotate: (Math.PI / 180) * (labelRotate ?? 0),
                  },
                ]}
                origin={origin}
                color={labelColor}
                text={line}
                font={font}
                y={labelY + index * labelLayout.lineHeight}
                x={labelX}
              />
            ))}
          </Group>
        ) : null}
        <></>
      </React.Fragment>
    );
  });

  return (
    <>
      {xAxisNodes}
      {titleNodes}
    </>
  );
};
