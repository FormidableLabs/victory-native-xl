import * as React from "react";
import type { ScaleLinear } from "d3-scale";
import interMediumTTF from "../fonts/inter-medium.ttf";
import {
  Line,
  Text,
  RoundedRect,
  useFont,
  vec,
} from "@shopify/react-native-skia";

export type GridProps = {
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
  axisColor,
}: AxisProps) => {
  const [x1, x2] = xScale.domain();
  const [y1, y2] = yScale.domain();
  const font = useFont(interMediumTTF, fontSize);

  if (
    !font ||
    typeof x1 === "undefined" ||
    typeof x2 === "undefined" ||
    typeof y1 === "undefined" ||
    typeof y2 === "undefined"
  )
    return null;

  return (
    <>
      {xScale.ticks(ticks).map((tick) => {
        if (tick === 0) return null;
        return (
          <React.Fragment key={`x-tick-${tick}`}>
            <Line
              p1={vec(xScale(tick), yScale(y2))}
              p2={vec(xScale(tick), yScale(y1))}
              color={lineColor}
            />
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
          </React.Fragment>
        );
      })}
      {yScale.ticks(ticks).map((tick) => {
        if (tick === 0) return null;
        return (
          <React.Fragment key={`y-tick-${tick}`}>
            <Line
              p1={vec(xScale(x1), yScale(tick))}
              p2={vec(xScale(x2), yScale(tick))}
              color={lineColor}
            />
            <RoundedRect
              x={xScale(x1) + 2}
              y={yScale(tick) - font.getTextWidth(tick.toFixed(0)) / 3}
              width={font.getTextWidth(tick.toFixed(0)) * 1.5}
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
          </React.Fragment>
        );
      })}
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
  ticks: 4,
  labelBackgroundColor: "hsla(0, 0%, 100%, 0.9)",
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  axisColor: "black",
};
