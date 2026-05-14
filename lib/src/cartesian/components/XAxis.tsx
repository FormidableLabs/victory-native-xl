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
import { DEFAULT_TICK_COUNT, downsampleTicks } from "../../utils/tickHelpers";
import { getLabelDimensions } from "../../utils/getLabelDimensions";
import type {
  InputDatum,
  InputFields,
  ValueOf,
  XAxisProps,
  XAxisPropsWithDefaults,
} from "../../types";

export const XAxis = <
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
>({
  xScale: xScaleProp,
  yScale,
  axisSide = "bottom",
  yAxisSide = "left",
  labelPosition = "outset",
  labelRotate,
  tickCount = DEFAULT_TICK_COUNT,
  tickValues,
  labelOffset = 2,
  labelColor = "#000000",
  lineWidth = StyleSheet.hairlineWidth,
  lineColor = "hsla(0, 0%, 0%, 0.25)",
  font,
  labelRenderer,
  formatXLabel = (label: ValueOf<InputDatum>) => String(label),
  ix = [],
  isNumericalData,
  linePathEffect,
  chartBounds,
  enableRescaling,
  zoom,
}: XAxisProps<RawData, XK>) => {
  const xScale = zoom ? zoom.rescaleX(xScaleProp) : xScaleProp;
  const [y1 = 0, y2 = 0] = yScale.domain();
  const fontSize = font?.getSize() ?? 0;
  const xTicksNormalized = tickValues
    ? downsampleTicks(tickValues, tickCount)
    : enableRescaling
      ? xScale.ticks(tickCount)
      : xScaleProp.ticks(tickCount);

  const xAxisNodes = xTicksNormalized.map((tick) => {
    const p1 = vec(xScale(tick), yScale(y2));
    const p2 = vec(xScale(tick), yScale(y1));

    const val = isNumericalData ? tick : ix[tick];

    const contentX = formatXLabel(val as never);
    const { width: labelWidth, height: labelHeight } = getLabelDimensions({
      text: contentX,
      font,
      labelRenderer,
    });
    const labelX = xScale(tick) - (labelWidth ?? 0) / 2;
    const canFitLabelContent =
      xScale(tick) >= chartBounds.left &&
      xScale(tick) <= chartBounds.right &&
      (yAxisSide === "left"
        ? labelX + labelWidth < chartBounds.right
        : chartBounds.left < labelX);

    const labelY = (() => {
      if (labelRenderer) {
        if (axisSide === "bottom" && labelPosition === "outset") {
          return chartBounds.bottom + labelOffset;
        }
        if (axisSide === "bottom" && labelPosition === "inset") {
          return yScale(y2) - labelOffset - labelHeight;
        }
        if (axisSide === "top" && labelPosition === "outset") {
          return yScale(y1) - labelOffset - labelHeight;
        }
        return yScale(y1) + labelOffset;
      }

      // bottom, outset
      if (axisSide === "bottom" && labelPosition === "outset") {
        return chartBounds.bottom + labelOffset + fontSize;
      }
      // bottom, inset
      if (axisSide === "bottom" && labelPosition === "inset") {
        return yScale(y2) - labelOffset;
      }
      // top, outset
      if (axisSide === "top" && labelPosition === "outset") {
        return yScale(y1) - labelOffset;
      }
      // top, inset
      return yScale(y1) + fontSize + labelOffset;
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
        origin = labelRenderer
          ? vec(labelX + labelWidth / 2, labelY + labelHeight / 2)
          : vec(labelX + labelWidth / 2, labelY);
        rotateOffset = Math.abs(
          (labelWidth / 2) * getOffsetFromAngle(labelRotate),
        );
      } else if (axisSide === "bottom" && labelPosition === "inset") {
        // bottom, inset
        origin = labelRenderer
          ? vec(labelX + labelWidth / 2, labelY + labelHeight / 2)
          : vec(labelX + labelWidth / 2, labelY);
        rotateOffset = -Math.abs(
          (labelWidth / 2) * getOffsetFromAngle(labelRotate),
        );
      } else if (axisSide === "top" && labelPosition === "inset") {
        // top, inset
        origin = labelRenderer
          ? vec(labelX + labelWidth / 2, labelY + labelHeight / 2)
          : vec(labelX + labelWidth / 2, labelY - fontSize / 4);
        rotateOffset = Math.abs(
          (labelWidth / 2) * getOffsetFromAngle(labelRotate),
        );
      } else {
        // top, outset
        origin = labelRenderer
          ? vec(labelX + labelWidth / 2, labelY + labelHeight / 2)
          : vec(labelX + labelWidth / 2, labelY - fontSize / 4);
        rotateOffset = -Math.abs(
          (labelWidth / 2) * getOffsetFromAngle(labelRotate),
        );
      }

      return { origin, rotateOffset };
    })();

    return (
      <React.Fragment key={`x-tick-${tick}`}>
        {lineWidth > 0 ? (
          <Group clip={boundsToClip(chartBounds)}>
            <Line p1={p1} p2={p2} color={lineColor} strokeWidth={lineWidth}>
              {linePathEffect ? linePathEffect : null}
            </Line>
          </Group>
        ) : null}
        {(font || labelRenderer) && labelWidth && canFitLabelContent ? (
          <Group transform={[{ translateY: rotateOffset }]}>
            {labelRenderer ? (
              <Group
                transform={[
                  {
                    rotate: (Math.PI / 180) * (labelRotate ?? 0),
                  },
                ]}
                origin={origin}
              >
                {labelRenderer.render({
                  text: contentX,
                  color: labelColor,
                  x: labelX,
                  y: labelY,
                  width: labelWidth,
                  height: labelHeight,
                  rotation: labelRotate ?? 0,
                  origin,
                })}
              </Group>
            ) : (
              <Text
                transform={[
                  {
                    rotate: (Math.PI / 180) * (labelRotate ?? 0),
                  },
                ]}
                origin={origin}
                color={labelColor}
                text={contentX}
                font={font ?? null}
                y={labelY}
                x={labelX}
              />
            )}
          </Group>
        ) : null}
        <></>
      </React.Fragment>
    );
  });

  return xAxisNodes;
};

export const XAxisDefaults = {
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  lineWidth: StyleSheet.hairlineWidth,
  tickCount: 5,
  labelOffset: 2,
  axisSide: "bottom",
  yAxisSide: "left",
  labelPosition: "outset",
  formatXLabel: (label: ValueOf<InputDatum>) => String(label),
  labelColor: "#000000",
  labelRotate: 0,
} satisfies XAxisPropsWithDefaults<never, never>;
