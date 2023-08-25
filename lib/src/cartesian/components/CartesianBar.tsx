import * as React from "react";
import { Path, Skia } from "@shopify/react-native-skia";
import { scaleBand } from "d3-scale";
import type { PointsArray, Scale } from "../../types";
import { AnimatedPath } from "./AnimatedPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";

type CartesianBarProps = {
  points: PointsArray;
  xScale: Scale;
  yScale: Scale;
  isAnimated?: boolean;
  color?: string;
  animationConfig?: PathAnimationConfig;
};

export const CartesianBar = ({
  points,
  xScale,
  yScale,
  isAnimated,
  animationConfig,
  color,
}: CartesianBarProps) => {
  const [y0 = 0, y1 = 0] = yScale.domain();

  const path = React.useMemo(() => {
    const path = Skia.Path.Make();
    const scale = scaleBand()
      .range([xScale(points.at(0)!.xValue!), xScale(points.at(-1)!.xValue!)])
      .domain(points.map((p) => p.xValue.toFixed(0)))
      .paddingInner(0.5)
      .paddingOuter(-0.5)
      .align(0.5)
      .round(false);

    points.forEach((point) => {
      path.addRect(
        Skia.XYWHRect(
          scale(point.xValue.toFixed(0))!,
          point.y!,
          scale.bandwidth(),
          -(yScale(y0) - yScale(y1) - point.y),
        ),
      );
    });

    return path;
  }, [xScale, yScale, points]);

  return React.createElement(isAnimated ? AnimatedPath : Path, {
    path,
    style: "fill",
    color,
    ...(isAnimated && { animationConfig }),
  });
};
