import * as React from "react";
import { type ScaleLinear } from "d3-scale";
import { Line, Text, vec, type SkFont } from "@shopify/react-native-skia";
import type { InputDatum } from "../types";
import type { ValueOf } from "../types";

export type GridProps = {
  font?: SkFont | null;
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  labelOffset: number;
  ticks: number;
  formatXLabel: (label: ValueOf<InputDatum>) => string;
  formatYLabel: (label: ValueOf<InputDatum>) => string;
  labelBackgroundColor: string;
  lineColor: string;
  axisColor: string;
};

export const Grid = ({
  xScale,
  yScale,
  ticks,
  labelOffset,
  lineColor,
  font,
  axisColor,
  formatXLabel,
  formatYLabel,
}: GridProps) => {
  const [x1, x2] = xScale.domain();
  const [y1, y2] = yScale.domain();
  const fontSize = font?.getSize() ?? 0;

  if (
    typeof x1 === "undefined" ||
    typeof x2 === "undefined" ||
    typeof y1 === "undefined" ||
    typeof y2 === "undefined"
  )
    return null;

  const xTicks = xScale.ticks(ticks);
  const yTicks = yScale.ticks(ticks);

  return (
    <>
      {xTicks.map((tick) => {
        if (tick === 0) return null;
        return (
          <React.Fragment key={`x-tick-${tick}`}>
            <Line
              p1={vec(xScale(tick), yScale(y2))}
              p2={vec(xScale(tick), yScale(y1))}
              color={lineColor}
            />
            {font ? (
              <>
                <Text
                  text={formatXLabel(tick)}
                  font={font}
                  y={yScale(y2) + labelOffset + fontSize}
                  x={xScale(tick) - font.getTextWidth(formatXLabel(tick)) / 2}
                />
              </>
            ) : null}
          </React.Fragment>
        );
      })}
      {yTicks.map((tick) => (
        <React.Fragment key={`y-tick-${tick}`}>
          <Line
            p1={vec(xScale(x1), yScale(tick))}
            p2={vec(xScale(x2), yScale(tick))}
            color={lineColor}
          />
          {font ? (
            <>
              <Text
                text={formatYLabel(tick)}
                font={font}
                y={yScale(tick) + fontSize / 3}
                x={
                  xScale(x1) -
                  font.getTextWidth(formatYLabel(tick) + labelOffset)
                }
              />
            </>
          ) : null}
        </React.Fragment>
      ))}

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
  labelOffset: 6,
  ticks: 10,
  formatXLabel: (label: ValueOf<InputDatum>) => String(label),
  formatYLabel: (label: ValueOf<InputDatum>) => String(label),
  labelBackgroundColor: "hsla(0, 0%, 100%, 0.9)",
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  axisColor: "black",
};
