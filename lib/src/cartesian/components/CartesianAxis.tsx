import React, { useMemo } from "react";
import {
  Line,
  Path,
  Skia,
  Text,
  vec,
  type Color,
} from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";
import type {
  ValueOf,
  NumericalFields,
  InputDatum,
  AxisProps,
} from "../../types";

export const CartesianAxis = <
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
  lineWidth,
  labelColor,
  formatYLabel,
  formatXLabel,
  yScale,
  xScale,
  font,
  isNumericalData = false,
  ix,
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
      gridLineColor: (typeof lineColor === "object" && "grid" in lineColor
        ? lineColor.grid
        : lineColor) as Color,
      frameLineColor: (typeof lineColor === "object" && "frame" in lineColor
        ? lineColor.frame
        : lineColor) as Color,
      gridLineWidth: typeof lineWidth === "number" ? lineWidth : lineWidth.grid,
      frameLineWidth:
        typeof lineWidth === "number" ? lineWidth : lineWidth.grid,
    } as const;
  }, [
    tickCount,
    labelOffset,
    axisSide.x,
    axisSide.y,
    labelPosition,
    lineColor,
    lineWidth,
  ]);

  const {
    xTicks,
    yTicks,
    xAxisPosition,
    yAxisPosition,
    xLabelPosition,
    yLabelPosition,
    xLabelOffset,
    yLabelOffset,
    gridLineColor,
    frameLineColor,
    gridLineWidth,
    frameLineWidth,
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
          color={gridLineColor}
          strokeWidth={gridLineWidth}
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
    const val = isNumericalData ? tick : ix[tick];
    const contentX = formatXLabel(val as never); // TODO: Need to tweak this? tick needs a lookup?
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
          color={gridLineColor}
          strokeWidth={gridLineWidth}
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

  const boundingFrame = React.useMemo(() => {
    const framePath = Skia.Path.Make();

    framePath.addRect(
      Skia.XYWHRect(
        xScale(x1),
        yScale(y1),
        xScale(x2) - xScale(x1),
        yScale(y2) - yScale(y1),
      ),
    );
    return framePath;
  }, [x1, x2, xScale, y1, y2, yScale]);

  return (
    <>
      {xTicks > 0 ? xAxisNodes : null}
      {yTicks > 0 ? yAxisNodes : null}
      <Path
        path={boundingFrame}
        strokeWidth={frameLineWidth}
        style="stroke"
        color={frameLineColor}
      />
    </>
  );
};

CartesianAxis.defaultProps = {
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  lineWidth: { grid: StyleSheet.hairlineWidth, frame: 1 },
  tickCount: 5,
  labelOffset: { x: 2, y: 4 },
  axisSide: { x: "bottom", y: "left" },
  labelPosition: "outset",
  formatXLabel: (label: ValueOf<InputDatum>) => String(label),
  formatYLabel: (label: ValueOf<InputDatum>) => String(label),
  labelColor: "#000000",
  ix: [],
} satisfies Partial<AxisProps<never, never, never, never>>;
