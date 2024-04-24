import * as React from "react";
import { Path, type PathProps } from "@shopify/react-native-skia";
import type { PropsWithChildren } from "react";
import type { ChartBounds, PointsArray } from "../../types";
import { AnimatedPath } from "./AnimatedPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";
import { useBarPath } from "../hooks/useBarPath";
import type { RoundedCorners } from "../../utils/createRoundedRectPath";

type CartesianBarProps = {
  points: PointsArray;
  chartBounds: ChartBounds;
  innerPadding?: number;
  animate?: PathAnimationConfig;
  roundedCorners?: RoundedCorners;
  barWidth?: number;
  barCount?: number;
} & Partial<Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">>;

export const Bar = ({
  points,
  chartBounds,
  animate,
  innerPadding = 0.25,
  roundedCorners,
  barWidth,
  barCount,
  ...ops
}: PropsWithChildren<CartesianBarProps>) => {
  const { path } = useBarPath(
    points,
    chartBounds,
    innerPadding,
    roundedCorners,
    barWidth,
    barCount,
  );

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
