import * as React from "react";
import { type ScaleLinear } from "d3-scale";
import { Line, Text, vec, type SkFont } from "@shopify/react-native-skia";
import type { InputDatum } from "../types";
import type { ValueOf } from "../types";

export type GridProps<
  T extends InputDatum,
  XK extends keyof T,
  YK extends keyof T,
> = {
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  font?: SkFont | null;
  xLabelOffset: number;
  yLabelOffset: number;
  yAxisPosition: "left" | "right";
  yLabelPosition: "inset" | "outset";
  xTicks: number;
  yTicks: number;
  lineColor: string;
  axisColor: string;
  formatXLabel: (label: T[XK]) => string;
  formatYLabel: (label: T[YK]) => string;
};

export const Grid = <
  T extends InputDatum,
  XK extends keyof T,
  YK extends keyof T,
>({
  xScale,
  yScale,
  xTicks,
  yTicks,
  xLabelOffset,
  yLabelOffset,
  lineColor,
  font,
  axisColor,
  yAxisPosition,
  yLabelPosition,
  formatXLabel,
  formatYLabel,
}: GridProps<T, XK, YK>) => {
  const [x1, x2] = xScale.domain();
  const [y1, y2] = yScale.domain();
  const [x1r, x2r] = xScale.range();
  const fontSize = font?.getSize() ?? 0;

  if (
    typeof x1 === "undefined" ||
    typeof x2 === "undefined" ||
    typeof y1 === "undefined" ||
    typeof y2 === "undefined" ||
    typeof x1r === "undefined" ||
    typeof x2r === "undefined"
  )
    return null;

  return (
    <>
      {xScale.ticks(xTicks).map((tick) => {
        const contentX = formatXLabel(tick as never);
        const labelWidth = font?.getTextWidth?.(contentX) ?? 0;
        const labelX = xScale(tick) - (labelWidth ?? 0) / 2;
        const canFitLabelContent =
          yAxisPosition === "left" ? labelX + labelWidth < x2r : x1r < labelX;
        return (
          <React.Fragment key={`x-tick-${tick}`}>
            <Line
              p1={vec(xScale(tick), yScale(y2))}
              p2={vec(xScale(tick), yScale(y1))}
              color={lineColor}
            />
            {font && labelWidth && canFitLabelContent ? (
              <Text
                text={contentX}
                font={font}
                y={yScale(y2) + xLabelOffset + fontSize}
                x={labelX}
              />
            ) : null}
          </React.Fragment>
        );
      })}
      {/* y Ticks labels */}
      {yScale.ticks(yTicks).map((tick) => {
        const contentY = formatYLabel(tick as never);
        const labelWidth = font?.getTextWidth?.(contentY) ?? 0;
        const labelY = yScale(tick) + fontSize / 3;
        const labelX = (() => {
          // left, outset
          if (yAxisPosition === "left" && yLabelPosition === "outset") {
            return xScale(x1) - (labelWidth + yLabelOffset);
          }
          // left, inset
          if (yAxisPosition === "left" && yLabelPosition === "inset") {
            return xScale(x1) + yLabelOffset;
          }
          // right, outset
          if (yAxisPosition === "right" && yLabelPosition === "outset") {
            return xScale(x2) + yLabelOffset;
          }
          // right, inset
          return xScale(x2) - (labelWidth + yLabelOffset);
        })();

        const canFitLabelContent = labelY > fontSize && labelY < yScale(y2);

        return (
          <React.Fragment key={`y-tick-${tick}`}>
            <Line
              p1={vec(xScale(x1), yScale(tick))}
              p2={vec(xScale(x2), yScale(tick))}
              color={lineColor}
            />
            {font
              ? canFitLabelContent && (
                  <Text text={contentY} font={font} y={labelY} x={labelX} />
                )
              : null}
          </React.Fragment>
        );
      })}

      <Line
        p1={vec(xScale(x1), yScale(y2))}
        p2={vec(xScale(x2), yScale(y2))}
        strokeWidth={2}
        color={axisColor}
      />
    </>
  );
};

Grid.defaultProps = {
  xLabelOffset: 0,
  yLabelOffset: 0,
  xTicks: 10,
  yTicks: 10,
  yAxisPosition: "left",
  yLabelPosition: "outset",
  formatXLabel: (label: ValueOf<InputDatum>) => String(label),
  formatYLabel: (label: ValueOf<InputDatum>) => String(label),
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  axisColor: "black",
} satisfies Partial<GridProps<never, never, never>>;
