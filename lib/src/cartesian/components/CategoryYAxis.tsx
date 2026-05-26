import React from "react";
import {
  Group,
  Line,
  Text,
  vec,
  type Color,
  type SkFont,
} from "@shopify/react-native-skia";
import { boundsToClip } from "../../utils/boundsToClip";
import { getTextLayout } from "../../utils/textLayout";
import type {
  AxisLabelPosition,
  ChartBounds,
  InputFields,
  Scale,
  YAxisSide,
} from "../../types";

type CategoryYAxisProps<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
> = {
  axisSide: YAxisSide;
  font?: SkFont | null;
  formatYLabel?: (label: never) => string;
  labelColor: string;
  labelOffset: number;
  labelPosition: AxisLabelPosition;
  lineColor: Color;
  lineWidth: number;
  linePathEffect?: React.ReactNode;
  xScale: Scale;
  yScale: Scale;
  yTicksNormalized: number[];
  ix: InputFields<RawData>[XK][];
  chartBounds: ChartBounds;
};

export const CategoryYAxis = <
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
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
  formatYLabel = (label: never) => String(label),
  linePathEffect,
  chartBounds,
  ix,
}: CategoryYAxisProps<RawData, XK>) => {
  const [x1 = 0, x2 = 0] = xScale.domain();
  const fontSize = font?.getSize() ?? 0;

  return yTicksNormalized.map((tick) => {
    const categoryValue = ix[tick];
    const contentY = String(formatYLabel(categoryValue as never));
    const labelLayout = getTextLayout(contentY, font);
    const labelWidth = labelLayout.width;
    const tickPosition = yScale(tick);
    const labelY =
      tickPosition +
      fontSize / 3 -
      Math.max(0, labelLayout.height - fontSize) / 2;
    const labelX = (() => {
      if (axisSide === "left" && labelPosition === "outset") {
        return chartBounds.left - (labelWidth + labelOffset);
      }
      if (axisSide === "left" && labelPosition === "inset") {
        return chartBounds.left + labelOffset;
      }
      if (axisSide === "right" && labelPosition === "outset") {
        return chartBounds.right + labelOffset;
      }
      return chartBounds.right - (labelWidth + labelOffset);
    })();

    const lastLabelY =
      labelY + (labelLayout.lines.length - 1) * labelLayout.lineHeight;
    const canFitLabelContent =
      labelY > chartBounds.top + fontSize / 2 &&
      lastLabelY < chartBounds.bottom + fontSize / 2;

    return (
      <React.Fragment key={`category-y-tick-${tick}`}>
        {lineWidth > 0 ? (
          <Group clip={boundsToClip(chartBounds)}>
            <Line
              p1={vec(xScale(x1), tickPosition)}
              p2={vec(xScale(x2), tickPosition)}
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
                    key={`category-y-tick-${tick}-label-line-${index}`}
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
};
