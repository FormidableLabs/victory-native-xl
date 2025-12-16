import React from "react";
import { StyleSheet } from "react-native";
import { Group, Line, Text, vec } from "@shopify/react-native-skia";
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
}: YAxisProps<RawData, YK>) => {
  const [x1 = 0, x2 = 0] = xScale.domain();
  const [_ = 0, y2 = 0] = yScale.domain();
  const fontSize = font?.getSize() ?? 0;
  const yAxisNodes = yTicksNormalized.map((tick) => {
    const contentY = formatYLabel(tick as never);

    // Handle both string and string array formats for multiline labels
    const lines = Array.isArray(contentY) ? contentY : contentY.split("\n");

    // Calculate width for each line and find the max width
    const lineWidths = lines.map(
      (line: string) =>
        font
          ?.getGlyphWidths?.(font.getGlyphIDs(line))
          .reduce((sum, value) => sum + value, 0) ?? 0,
    );

    const labelY = yScale(tick) + fontSize / 3;

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
              <>
                {lines.map((line: string, lineIndex: number) => {
                  // Calculate x position for each line based on line width
                  const lineWidth = lineWidths[lineIndex];
                  const lineLabelX = (() => {
                    // left, outset
                    if (axisSide === "left" && labelPosition === "outset") {
                      return (
                        chartBounds.left - ((lineWidth || 0) + labelOffset)
                      );
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
                    return chartBounds.right - ((lineWidth || 0) + labelOffset);
                  })();

                  // Calculate y position for each line
                  const lineY = labelY + lineIndex * fontSize;

                  return (
                    <Text
                      key={`line-${lineIndex}`}
                      color={labelColor}
                      text={line}
                      font={font}
                      y={lineY}
                      x={lineLabelX}
                    />
                  );
                })}
              </>
            )
          : null}
      </React.Fragment>
    );
  });

  return yAxisNodes;
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
