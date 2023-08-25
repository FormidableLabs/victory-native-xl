import * as React from "react";
import type { PointsArray } from "victory-native";
import { Path, Skia } from "@shopify/react-native-skia";
import { AnimatedPath } from "./AnimatedPath";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";

type CartesianDotsProps = {
  data: PointsArray;
  isAnimated?: boolean;
  animationConfig?: PathAnimationConfig;
  color?: string;
};

/**
 * TODO: Colors, sizes, shapes
 */
export function CartesianDots({
  data,
  isAnimated,
  animationConfig,
  color = "black",
}: CartesianDotsProps) {
  const path = React.useMemo(() => {
    const p = Skia.Path.Make();

    data.forEach(({ x, y }) => {
      p.addCircle(x, y, 10);
    });

    return p;
  }, [data]);

  return React.createElement(isAnimated ? AnimatedPath : Path, {
    path,
    style: "fill",
    color,
    ...(isAnimated && { animationConfig }),
  });
}
