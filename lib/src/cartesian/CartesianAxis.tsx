import * as React from "react";
import { type ScaleLinear } from "d3-scale";
import { Line, Text, vec, type SkFont } from "@shopify/react-native-skia";
import type {
  AxisLabelPosition,
  InputDatum,
  XAxisSide,
  YAxisSide,
} from "../types";
import type { ValueOf } from "../types";
import { useMemo } from "react";
import { type NumericalFields } from "../types";

export type AxisProps<
  RawData extends Record<string, unknown>,
  T extends NumericalFields<RawData>,
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

export const Axis = <
  RawData extends Record<string, unknown>,
  T extends NumericalFields<RawData>,
  XK extends keyof T,
  YK extends keyof T,
>({
  tickCount,
  labelPosition,
  labelOffset,
  axisSide,
  lineColor,
  labelColor,
  formatYLabel,
  formatXLabel,
  yScale,
  xScale,
  font,
}: AxisProps<RawData, T, XK, YK>) => {
  const axisConfiguration = useMemo(() => {
    return {
      xTicks: typeof tickCount === "number" ? tickCount : tickCount.x,
      yTicks: typeof tickCount === "number" ? tickCount : tickCount.y,
      xLabelOffset:
        typeof labelOffset === "number" ? labelOffset : labelOffset.x,
      yLabelOffset:
        typeof labelOffset === "number" ? labelOffset : labelOffset.y,
      xAxisPosition: axisSide.x,
      yAxisPosition: axisSide.y,
      xLabelPosition:
        typeof labelPosition === "string" ? labelPosition : labelPosition.x,
      yLabelPosition:
        typeof labelPosition === "string" ? labelPosition : labelPosition.y,
    } as const;
  }, [tickCount, labelPosition, labelOffset, axisSide]);

  const {
    xTicks,
    yTicks,
    xAxisPosition,
    yAxisPosition,
    xLabelPosition,
    yLabelPosition,
    xLabelOffset,
    yLabelOffset,
  } = axisConfiguration;

  const [x1 = 0, x2 = 0] = xScale.domain();
  const [y1 = 0, y2 = 0] = yScale.domain();
  const [x1r = 0, x2r = 0] = xScale.range();
  const fontSize = font?.getSize() ?? 0;

  const yAxisNodes = yScale.ticks(yTicks).map((tick) => {
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
          strokeWidth={1}
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
  });

  const xAxisNodes = xScale.ticks(xTicks).map((tick) => {
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
          strokeWidth={1}
        />
        {font && labelWidth && canFitLabelContent ? (
          <Text
            color={typeof labelColor === "string" ? labelColor : labelColor.x}
            text={contentX}
            font={font}
            y={labelY}
            x={labelX}
          />
        ) : null}
      </React.Fragment>
    );
  });

  return (
    <>
      {xTicks > 0 ? xAxisNodes : null}
      {yTicks > 0 ? yAxisNodes : null}
    </>
  );
};

export const axisDefaultProps = {
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  tickCount: 10,
  labelOffset: { x: 2, y: 4 },
  axisSide: { x: "bottom", y: "left" },
  labelPosition: "outset",
  formatXLabel: (label: ValueOf<InputDatum>) => String(label),
  formatYLabel: (label: ValueOf<InputDatum>) => String(label),
  labelColor: "#000000",
} satisfies Partial<AxisProps<never, never, never, never>>;
