import { type ScaleLinear } from "d3-scale";
import { useMemo } from "react";
import { Path, Skia } from "@shopify/react-native-skia";
import * as React from "react";

export type GridProps = {
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  lineColor: string;
};

export const Grid = ({ xScale, yScale, lineColor }: GridProps) => {
  const gridPath = useMemo(() => {
    const [x1 = 0, x2 = 0] = xScale.domain();
    const [y1 = 0, y2 = 0] = yScale.domain();
    const gridPath = Skia.Path.Make();

    gridPath.addRect(
      Skia.XYWHRect(
        xScale(x1),
        yScale(y1),
        xScale(x2) - xScale(x1),
        yScale(y2) - yScale(y1),
      ),
    );
    return gridPath;
  }, [xScale, yScale]);

  return (
    <Path path={gridPath} strokeWidth={1} color={lineColor} style="stroke" />
  );
};

export const gridDefaultProps = {
  lineColor: "hsla(0, 0%, 0%, 0.25)",
} satisfies Partial<GridProps>;
