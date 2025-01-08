import React from "react";
import { StyleSheet } from "react-native";
import { Group, Line, Text, vec } from "@shopify/react-native-skia";
import { boundsToClip } from "../../utils/boundsToClip";
import { DEFAULT_TICK_COUNT, downsampleTicks } from "../../utils/tickHelpers";
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
    const val = isNumericalData ? tick : ix[tick];

    const contentX = formatXLabel(val as never);
    const labelWidth =
      font
        ?.getGlyphWidths?.(font.getGlyphIDs(contentX))
        .reduce((sum, value) => sum + value, 0) ?? 0;
    const labelX = xScale(tick) - (labelWidth ?? 0) / 2;
    const canFitLabelContent =
      xScale(tick) >= chartBounds.left &&
      xScale(tick) <= chartBounds.right &&
      (yAxisSide === "left"
        ? labelX + labelWidth < chartBounds.right
        : chartBounds.left < labelX);

    const labelY = (() => {
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

    return (
      <React.Fragment key={`x-tick-${tick}`}>
        {lineWidth > 0 ? (
          <Group clip={boundsToClip(chartBounds)}>
            <Line
              p1={vec(xScale(tick), yScale(y2))}
              p2={vec(xScale(tick), yScale(y1))}
              color={lineColor}
              strokeWidth={lineWidth}
            >
              {linePathEffect ? linePathEffect : null}
            </Line>
          </Group>
        ) : null}
        {font && labelWidth && canFitLabelContent ? (
          <Text
            transform={[
              {
                rotate: (Math.PI / 180) * (labelRotate ?? 0),
              },
            ]}
            origin={vec(xScale(tick) + labelWidth / 2, yScale(y2))}
            color={labelColor}
            text={contentX}
            font={font}
            y={labelY}
            x={labelX}
          />
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
} satisfies XAxisPropsWithDefaults<never, never>;
