import React from "react";
import { Group, Line, Text, vec } from "@shopify/react-native-skia";
import { boundsToClip } from "../../utils/boundsToClip";
import { getTextLayout } from "../../utils/textLayout";
import type {
  InputDatum,
  NumericalFields,
  ValueOf,
  YAxisProps,
} from "../../types";
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
  formatYLabel = (label: ValueOf<InputDatum>) => String(label),
  linePathEffect,
  chartBounds,
}: YAxisProps<RawData, YK, Label>) => {
  const [x1 = 0, x2 = 0] = xScale.domain();
  const [_ = 0, y2 = 0] = yScale.domain();
  const fontSize = font?.getSize() ?? 0;
  const yAxisNodes = yTicksNormalized.map((tick) => {
    const contentY = String(formatYLabel(tick as never));
    const labelLayout = getTextLayout(contentY, font);
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

    const lastLabelY =
      labelY + (labelLayout.lines.length - 1) * labelLayout.lineHeight;
    const canFitLabelContent = labelY > fontSize && lastLabelY < yScale(y2);

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

  return yAxisNodes;
};
