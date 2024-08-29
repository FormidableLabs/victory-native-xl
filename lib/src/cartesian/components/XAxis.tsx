import React from "react";
import { StyleSheet } from "react-native";
import { Line, Text, vec } from "@shopify/react-native-skia";
import type {
  InputDatum,
  InputFields,
  ValueOf,
  XAxisProps,
  XAxisPropsWithDefaults,
} from "lib/src/types";
import { DEFAULT_TICK_COUNT, downsampleTicks } from "lib/src/utils/tickHelpers";

export const XAxis = <
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
>({
  xScale,
  yScale,
  axisSide = "bottom",
  yAxisSide = "left",
  labelPosition = "outset",
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
}: XAxisProps<RawData, XK>) => {
  const [y1 = 0, y2 = 0] = yScale.domain();
  const [x1r = 0, x2r = 0] = xScale.range();
  const fontSize = font?.getSize() ?? 0;
  const xTicksNormalized = tickValues
    ? downsampleTicks(tickValues, tickCount)
    : xScale.ticks(tickCount);

  const xAxisNodes = xTicksNormalized.map((tick) => {
    const val = isNumericalData ? tick : ix[tick];

    const contentX = formatXLabel(val as never);
    const labelWidth =
      font
        ?.getGlyphWidths?.(font.getGlyphIDs(contentX))
        .reduce((sum, value) => sum + value, 0) ?? 0;
    const labelX = xScale(tick) - (labelWidth ?? 0) / 2;
    const canFitLabelContent =
      yAxisSide === "left" ? labelX + labelWidth < x2r : x1r < labelX;

    const labelY = (() => {
      // bottom, outset
      if (axisSide === "bottom" && labelPosition === "outset") {
        return yScale(y2) + labelOffset + fontSize;
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
          <Line
            p1={vec(xScale(tick), yScale(y2))}
            p2={vec(xScale(tick), yScale(y1))}
            color={lineColor}
            strokeWidth={lineWidth}
          />
        ) : null}
        {font && labelWidth && canFitLabelContent ? (
          <Text
            color={labelColor}
            text={contentX}
            font={font}
            y={labelY}
            x={labelX}
          />
        ) : null}
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
