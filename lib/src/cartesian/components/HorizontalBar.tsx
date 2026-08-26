import * as React from "react";
import { Path, type PathProps, type SkPath } from "@shopify/react-native-skia";
import type { PropsWithChildren } from "react";
import type { ChartBounds, PointsArray } from "../../types";
import { AnimatedPath } from "./AnimatedPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";
import { useHorizontalBarPath } from "../hooks/useHorizontalBarPath";
import type { RoundedCorners } from "../../utils/createRoundedRectPath";
import { BarGraphLabels, type BarLabelConfig } from "./BarGraphLabels";
import { useCartesianChartContext } from "../contexts/CartesianChartContext";

type HorizontalBarPathProps = Partial<
  Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">
>;

type CartesianHorizontalBarProps = {
  points: PointsArray;
  chartBounds: ChartBounds;
  innerPadding?: number;
  animate?: PathAnimationConfig;
  roundedCorners?: RoundedCorners;
  barWidth?: number;
  barCount?: number;
  labels?: BarLabelConfig;
} & HorizontalBarPathProps;

type HorizontalBarGraphProps = {
  animate?: PathAnimationConfig;
  path: SkPath;
  options: HorizontalBarPathProps;
};

const HorizontalBarGraph = (props: HorizontalBarGraphProps) => {
  const { options, ...pathProps } = props;
  const PathComponent = pathProps.animate ? AnimatedPath : Path;
  return <PathComponent style="fill" {...pathProps} {...options} />;
};

export const HorizontalBar = ({
  points,
  chartBounds,
  animate,
  innerPadding = 0.25,
  roundedCorners,
  barWidth,
  barCount,
  labels,
  ...ops
}: PropsWithChildren<CartesianHorizontalBarProps>) => {
  const { orientation } = useCartesianChartContext();
  const { path, barWidth: bw } = useHorizontalBarPath(
    points,
    chartBounds,
    innerPadding,
    roundedCorners,
    barWidth,
    barCount,
  );

  if (orientation !== "horizontal") {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        'HorizontalBar must be rendered inside a CartesianChart with orientation="horizontal".',
      );
    }
    return null;
  }

  return (
    <>
      {labels && (
        <BarGraphLabels
          points={points}
          chartBounds={chartBounds}
          barWidth={barWidth ?? bw}
          options={labels}
        />
      )}
      <HorizontalBarGraph path={path} animate={animate} options={ops} />
    </>
  );
};
