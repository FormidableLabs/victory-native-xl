import * as React from "react";
import { Path, type Color } from "@shopify/react-native-skia";
import type { PropsWithChildren } from "react";
import type { ChartBounds, PointsArray } from "../../types";
import { AnimatedPath } from "./AnimatedPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";
import { useCartesianChartContext } from "../contexts/CartesianChartContext";
import {
  useHorizontalStackedBarPaths,
  type HorizontalStackedBarOptionsFn,
  type HorizontalStackedBarPath,
} from "../hooks/useHorizontalStackedBarPaths";

type CartesianHorizontalStackedBarProps = {
  points: PointsArray[];
  chartBounds: ChartBounds;
  innerPadding?: number;
  animate?: PathAnimationConfig;
  barWidth?: number;
  barCount?: number;
  colors?: Color[];
  barOptions?: HorizontalStackedBarOptionsFn;
};

const DEFAULT_COLORS = ["red", "orange", "blue", "green", "blue", "purple"];

export const HorizontalStackedBar = ({
  points,
  chartBounds,
  animate,
  innerPadding = 0.25,
  barWidth,
  barCount,
  barOptions,
  colors = DEFAULT_COLORS,
}: PropsWithChildren<CartesianHorizontalStackedBarProps>) => {
  const { orientation } = useCartesianChartContext();
  const paths = useHorizontalStackedBarPaths({
    points,
    chartBounds,
    innerPadding,
    barWidth,
    barCount,
    barOptions,
    colors,
  });

  if (orientation !== "horizontal") {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        'HorizontalStackedBar must be rendered inside a CartesianChart with orientation="horizontal".',
      );
    }
    return null;
  }

  return (
    <>
      {paths.map((p: HorizontalStackedBarPath) => {
        return React.createElement(animate ? AnimatedPath : Path, {
          ...p,
          style: "fill",
          ...(Boolean(animate) && { animate }),
        });
      })}
    </>
  );
};
