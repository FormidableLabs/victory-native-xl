import * as React from "react";
import { Path, type PathProps } from "@shopify/react-native-skia";
import type { PointsArray } from "victory-native";
import { type LinePathOptions, useLinePath } from "../hooks/useLinePath";
import { AnimatedPath } from "./AnimatedPath";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";

export type CartesianLinePathProps = {
  points: PointsArray;
  animate?: PathAnimationConfig;
} & LinePathOptions &
  Partial<
    Pick<
      PathProps,
      | "color"
      | "strokeWidth"
      | "strokeJoin"
      | "strokeCap"
      | "blendMode"
      | "strokeMiter"
      | "opacity"
      | "antiAlias"
    >
  >;

export function Line({
  points,
  animate,
  curveType,
  ...ops
}: React.PropsWithChildren<CartesianLinePathProps>) {
  const { path } = useLinePath(points, { curveType });

  return React.createElement(animate ? AnimatedPath : Path, {
    path,
    style: "stroke",
    ...ops,
    ...(Boolean(animate) && { animate }),
  });
}
