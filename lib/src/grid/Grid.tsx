import * as React from "react";
import { type ScaleLinear } from "d3-scale";
import {
  Line,
  Text,
  RoundedRect,
  vec,
  type SkFont,
} from "@shopify/react-native-skia";

export type GridProps = {
  font?: SkFont | null;
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  labelOffset: number;
  fontSize: number;
  ticks: number;
  labelBackgroundColor: string;
  lineColor: string;
  axisColor: string;
};

export const Grid = ({
  xScale,
  yScale,
  fontSize,
  ticks,
  labelOffset,
  labelBackgroundColor,
  lineColor,
  font,
  axisColor,
}: GridProps) => {
  const [x1, x2] = xScale.domain();
  const [y1, y2] = yScale.domain();

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
                <RoundedRect
                  x={xScale(tick) - font.getTextWidth(tick.toFixed(0))}
                  y={yScale(y2) - labelOffset - fontSize}
                  width={font.getTextWidth(tick.toFixed(0)) * 2}
                  height={fontSize + 4}
                  r={4}
                  color={labelBackgroundColor}
                />
                <Text
                  text={String(tick)}
                  font={font}
                  y={yScale(y2) - labelOffset}
                  x={xScale(tick) - font.getTextWidth(tick.toFixed(0)) / 2}
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
              <RoundedRect
                x={xScale(x1) + 2}
                y={yScale(tick) - (fontSize + 4) / 2}
                width={font.getTextWidth(tick.toFixed(0)) + labelOffset + 4}
                height={fontSize + 4}
                r={4}
                color={labelBackgroundColor}
              />
              <Text
                text={String(tick)}
                font={font}
                y={yScale(tick) + fontSize / 3}
                x={xScale(x1) + labelOffset}
              />
            </>
          ) : null}
        </React.Fragment>
      ))}
      <Line
        p1={vec(xScale(x1), yScale(y1))}
        p2={vec(xScale(x1), yScale(y2))}
        color={axisColor}
      />
      <Line
        p1={vec(xScale(x1), yScale(y2))}
        p2={vec(xScale(x2), yScale(y2))}
        color={axisColor}
      />
    </>
  );
};

Grid.defaultProps = {
  fontSize: 12,
  labelOffset: 6,
  ticks: 10,
  labelBackgroundColor: "hsla(0, 0%, 100%, 0.9)",
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  axisColor: "black",
};