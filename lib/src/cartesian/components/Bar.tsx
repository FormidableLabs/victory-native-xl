import * as React from "react";
import { Path, type PathProps, type SkPath } from "@shopify/react-native-skia";
import type { PropsWithChildren } from "react";
import type { ChartBounds, PointsArray } from "../../types";
import { AnimatedPath } from "./AnimatedPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";
import { useBarPath } from "../hooks/useBarPath";
import type { RoundedCorners } from "../../utils/createRoundedRectPath";
import { BarGraphLabels, type BarLabelConfig } from "./BarGraphLabels";

type BarPathProps = Partial<
  Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">
>;

type CartesianBarProps = {
  points: PointsArray;
  chartBounds: ChartBounds;
  innerPadding?: number;
  animate?: PathAnimationConfig;
  roundedCorners?: RoundedCorners;
  barWidth?: number;
  barCount?: number;
  labels?: BarLabelConfig;
} & Partial<Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">>;

type BarGraphProps = {
  animate?: PathAnimationConfig;
  path: SkPath;
  options: BarPathProps;
};

const BarGraph = (props: BarGraphProps) => {
  const { options, ...pathProps } = props;
  const PathComponent = pathProps.animate ? AnimatedPath : Path;
  return <PathComponent style="fill" {...pathProps} {...options} />;
};

export const Bar = ({
  points,
  chartBounds,
  animate,
  innerPadding = 0.25,
  roundedCorners,
  barWidth,
  barCount,
  labels,
  ...ops
}: PropsWithChildren<CartesianBarProps>) => {
  const { path, barWidth: bw } = useBarPath(
    points,
    chartBounds,
    innerPadding,
    roundedCorners,
    barWidth,
    barCount,
  );

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
      <BarGraph path={path} animate={animate} options={ops} />
    </>
  );
};
