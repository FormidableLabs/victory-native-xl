import * as React from "react";
import { Path, type Color, type PathProps } from "@shopify/react-native-skia";
import type { PropsWithChildren } from "react";
import type { ChartBounds, PointsArray } from "../../types";
import { AnimatedPath } from "./AnimatedPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";
import { type RoundedCorners } from "../../utils/createRoundedRectPath";
import {
  useStackedBarPaths,
  type StackedBarPath,
} from "../hooks/useStackedBarPaths";

type CustomizablePathProps = Partial<
  Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">
>;
type CartesianStackedBarProps = {
  points: PointsArray[];
  chartBounds: ChartBounds;
  innerPadding?: number;
  animate?: PathAnimationConfig;
  barWidth?: number;
  barCount?: number;
  colors?: Color[];
  barOptions?: ({
    columnIndex,
    rowIndex,
    isBottom,
    isTop,
  }: {
    isBottom: boolean;
    isTop: boolean;
    columnIndex: number;
    rowIndex: number;
  }) => CustomizablePathProps & { roundedCorners?: RoundedCorners };
};
const DEFAULT_COLORS = ["red", "orange", "blue", "green", "blue", "purple"];

export const StackedBar = ({
  points,
  chartBounds,
  animate,
  innerPadding = 0.25,
  barWidth,
  barCount,
  barOptions = () => ({}),
  colors = DEFAULT_COLORS,
}: PropsWithChildren<CartesianStackedBarProps>) => {
  const paths = useStackedBarPaths({
    points,
    chartBounds,
    innerPadding,
    barWidth,
    barCount,
    barOptions,
    colors,
  });

  return paths.map((p: StackedBarPath) => {
    return React.createElement(animate ? AnimatedPath : Path, {
      ...p,
      style: "fill",
      ...(Boolean(animate) && { animate }),
    });
  });
};
