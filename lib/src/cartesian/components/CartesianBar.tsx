import * as React from "react";
import { Path, Skia } from "@shopify/react-native-skia";
import type { PointsArray, Scale } from "../../types";
import { AnimatedPath } from "./AnimatedPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";

type CartesianBarProps = {
  points: PointsArray;
  xScale: Scale;
  yScale: Scale;
  innerPadding: number;
  color?: string;
  animate?: PathAnimationConfig;
};

export const CartesianBar = ({
  points,
  xScale,
  yScale,
  animate,
  color,
  innerPadding,
}: CartesianBarProps) => {
  const [y0 = 0, y1 = 0] = yScale.domain();

  const path = React.useMemo(() => {
    const domainWidth = xScale.range().at(1)! - xScale.range().at(0)!;
    const barWidth = ((1 - innerPadding) * domainWidth) / (points.length - 1);
    const path = Skia.Path.Make();

    points.forEach((point) => {
      path.addRect(
        Skia.XYWHRect(
          point.x! - barWidth / 2,
          point.y!,
          barWidth,
          -(yScale(y0) - yScale(y1) - point.y),
        ),
      );
    });

    return path;
  }, [xScale, yScale, points]);

  return React.createElement(animate ? AnimatedPath : Path, {
    path,
    style: "fill",
    color,
    ...(Boolean(animate) && { animate }),
  });
};

CartesianBar.defaultProps = {
  innerPadding: 0.25,
} satisfies Partial<CartesianBarProps>;
