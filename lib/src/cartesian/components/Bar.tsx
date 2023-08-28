import * as React from "react";
import { Path, type PathProps, Skia } from "@shopify/react-native-skia";
import type { PropsWithChildren } from "react";
import type { ChartBounds, PointsArray } from "../../types";
import { AnimatedPath } from "./AnimatedPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";

type CartesianBarProps = {
  points: PointsArray;
  innerPadding?: number;
  chartBounds: ChartBounds;
  animate?: PathAnimationConfig;
} & Partial<Pick<PathProps, "color">>;

export const Bar = ({
  points,
  chartBounds,
  animate,
  innerPadding = 0.25,
  ...ops
}: PropsWithChildren<CartesianBarProps>) => {
  const path = React.useMemo(() => {
    const domainWidth = chartBounds.right - chartBounds.left;
    const barWidth = ((1 - innerPadding) * domainWidth) / (points.length - 1);
    const path = Skia.Path.Make();

    points.forEach(({ x, y }) => {
      path.addRect(
        Skia.XYWHRect(x - barWidth / 2, y, barWidth, chartBounds.bottom - y),
      );
    });

    return path;
  }, [
    chartBounds.right,
    chartBounds.left,
    chartBounds.bottom,
    innerPadding,
    points,
  ]);

  return React.createElement(animate ? AnimatedPath : Path, {
    path,
    style: "fill",
    ...(Boolean(animate) && { animate }),
    ...ops,
  });
};

Bar.defaultProps = {
  innerPadding: 0.25,
} satisfies Partial<CartesianBarProps>;
