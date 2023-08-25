import * as React from "react";
import type { PointsArray } from "victory-native";
import { type CartesianLineOptions } from "../hooks/useCartesianLinePath";
import { Path } from "@shopify/react-native-skia";
import { useCartesianAreaPath } from "../hooks/useCartesianAreaPath";
import type { ScaleLinear } from "d3-scale";
import { AnimatedPath } from "./AnimatedPath";
import { PathAnimationConfig } from "../../hooks/useAnimatedPath";

export type CartesianAreaProps = {
  data: PointsArray;
  yScale: ScaleLinear<number, number>;
  isAnimated?: boolean;
  animationConfig?: PathAnimationConfig;
  color?: string;
  strokeWidth?: number;
} & CartesianLineOptions;

export function CartesianArea({
  data,
  yScale,
  isAnimated,
  animationConfig,
  color = "black",
  ...ops
}: CartesianAreaProps) {
  const path = useCartesianAreaPath(data, yScale, ops);

  return React.createElement(isAnimated ? AnimatedPath : Path, {
    path,
    style: "fill",
    color,
    animationConfig,
  });
}
