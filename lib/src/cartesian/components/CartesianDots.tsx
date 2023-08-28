import * as React from "react";
import { Path, Skia } from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { AnimatedPath } from "./AnimatedPath";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";

type CartesianDotsProps = {
  points: PointsArray;
  animate?: PathAnimationConfig;
  color?: string;
};

/**
 * TODO: Colors, sizes, shapes
 */
export function CartesianDots({
  points,
  animate,
  color = "black",
}: CartesianDotsProps) {
  const path = React.useMemo(() => {
    const p = Skia.Path.Make();

    points.forEach(({ x, y }) => {
      p.addCircle(x, y, 10);
    });

    return p;
  }, [points]);

  return React.createElement(animate ? AnimatedPath : Path, {
    path,
    style: "fill",
    color,
    ...(Boolean(animate) && { animate }),
  });
}
