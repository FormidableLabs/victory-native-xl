import * as React from "react";
import { type ScaleLinear } from "d3-scale";
import {
  Line,
  Text,
  vec,
  type SkFont,
  Path,
  Skia,
} from "@shopify/react-native-skia";
import type {
  AxisLabelPosition,
  InputDatum,
  XAxisSide,
  YAxisSide,
} from "../types";
import type { ValueOf } from "../types";
import { useMemo } from "react";

export type GridProps<
  T extends InputDatum,
  XK extends keyof T,
  YK extends keyof T,
> = {
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  font?: SkFont | null;
  lineColor: string;
  labelColor: string | { x: string; y: string };
  tickCount: number | { x: number; y: number };
  labelOffset: number | { x: number; y: number };
  labelPosition:
    | AxisLabelPosition
    | { x: AxisLabelPosition; y: AxisLabelPosition };
  axisSide: { x: XAxisSide; y: YAxisSide };
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
  lineColor,
  font,
  labelColor,
  formatXLabel,
  formatYLabel,
  tickCount,
  labelPosition,
  axisSide,
  labelOffset,
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

  const path = useMemo(() => {
    const path = Skia.Path.Make();
    path.addRect(
      Skia.XYWHRect(
        xScale(x1),
        yScale(y1),
        xScale(x2) - xScale(x1),
        yScale(y2) - yScale(y1),
      ),
    );
    return path;
  }, [x1, x2, y1, y2, xScale, yScale]);

  const xTicks = typeof tickCount === "number" ? tickCount : tickCount.x;
  const yTicks = typeof tickCount === "number" ? tickCount : tickCount.y;
  const xLabelOffset =
    typeof labelOffset === "number" ? labelOffset : labelOffset.x;
  const yLabelOffset =
    typeof labelOffset === "number" ? labelOffset : labelOffset.y;
  const xAxisPosition = axisSide.x;
  const yAxisPosition = axisSide.y;
  const xLabelPosition =
    typeof labelPosition === "string" ? labelPosition : labelPosition.x;
  const yLabelPosition =
    typeof labelPosition === "string" ? labelPosition : labelPosition.y;

  return (
    <>
      {/* x-ticks */}
      {xScale.ticks(xTicks).map((tick) => {
        const contentX = formatXLabel(tick as never);
        const labelWidth = font?.getTextWidth?.(contentX) ?? 0;
        const labelX = xScale(tick) - (labelWidth ?? 0) / 2;
        const canFitLabelContent =
          yAxisPosition === "left" ? labelX + labelWidth < x2r : x1r < labelX;

        const labelY = (() => {
          // bottom, outset
          if (xAxisPosition === "bottom" && xLabelPosition === "outset") {
            return yScale(y2) + xLabelOffset + fontSize;
          }
          // bottom, inset
          if (xAxisPosition === "bottom" && xLabelPosition === "inset") {
            return yScale(y2) - xLabelOffset;
          }
          // top, outset
          if (xAxisPosition === "top" && xLabelPosition === "outset") {
            return yScale(y1) - xLabelOffset;
          }
          // top, inset
          return yScale(y1) + fontSize + xLabelOffset;
        })();

        return (
          <React.Fragment key={`x-tick-${tick}`}>
            <Line
              p1={vec(xScale(tick), yScale(y2))}
              p2={vec(xScale(tick), yScale(y1))}
              color={lineColor}
            />
            {font && labelWidth && canFitLabelContent ? (
              <Text
                color={
                  typeof labelColor === "string" ? labelColor : labelColor.x
                }
                text={contentX}
                font={font}
                y={labelY}
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
                  <Text
                    color={
                      typeof labelColor === "string" ? labelColor : labelColor.y
                    }
                    text={contentY}
                    font={font}
                    y={labelY}
                    x={labelX}
                  />
                )
              : null}
          </React.Fragment>
        );
      })}
      <Path path={path} strokeWidth={1} color={lineColor} style="stroke" />
    </>
  );
};

Grid.defaultProps = {
  tickCount: 10,
  labelOffset: { x: 2, y: 4 },
  axisSide: { x: "bottom", y: "left" },
  labelPosition: "outset",
  formatXLabel: (label: ValueOf<InputDatum>) => String(label),
  formatYLabel: (label: ValueOf<InputDatum>) => String(label),
  labelColor: "#000000",
  lineColor: "hsla(0, 0%, 0%, 0.25)",
} satisfies Partial<GridProps<never, never, never>>;
