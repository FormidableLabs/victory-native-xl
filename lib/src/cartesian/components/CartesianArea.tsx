import * as React from "react";
import type { PointsArray, Scale } from "../../types";
import { type CartesianLineOptions } from "../hooks/useCartesianLinePath";
import { Path } from "@shopify/react-native-skia";
import { useCartesianAreaPath } from "../hooks/useCartesianAreaPath";
import { AnimatedPath } from "./AnimatedPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";

export type CartesianAreaProps = {
  points: PointsArray;
  yScale: Scale;
  animate?: PathAnimationConfig;
  color?: string;
  strokeWidth?: number;
} & CartesianLineOptions;

export function CartesianArea({
  points,
  yScale,
  animate,
  curveType,
  ...ops
}: React.PropsWithChildren<CartesianAreaProps>) {
  const path = useCartesianAreaPath(points, yScale, { curveType });

  return React.createElement(animate ? AnimatedPath : Path, {
    path,
    style: "fill",
    ...ops,
    ...(Boolean(animate) && { animate }),
  });
}
