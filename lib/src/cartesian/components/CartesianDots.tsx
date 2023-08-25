import * as React from "react";
import type { PointsArray } from "../../types";
import { Path, Skia } from "@shopify/react-native-skia";
import { AnimatedPath } from "./AnimatedPath";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";

type CartesianDotsProps = {
  points: PointsArray;
  isAnimated?: boolean;
  animationConfig?: PathAnimationConfig;
  color?: string;
};

/**
 * TODO: Colors, sizes, shapes
 */
export function CartesianDots({
  points,
  isAnimated,
  animationConfig,
  color = "black",
}: CartesianDotsProps) {
  const path = React.useMemo(() => {
    const p = Skia.Path.Make();

    points.forEach(({ x, y }) => {
      p.addCircle(x, y, 10);
    });

    return p;
  }, [points]);

  return React.createElement(isAnimated ? AnimatedPath : Path, {
    path,
    style: "fill",
    color,
    ...(isAnimated && { animationConfig }),
  });
}
