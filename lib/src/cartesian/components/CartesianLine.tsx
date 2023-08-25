import * as React from "react";
import type { PointsArray } from "victory-native";
import {
  type CartesianLineOptions,
  useCartesianLinePath,
} from "../hooks/useCartesianLinePath";
import { Path } from "@shopify/react-native-skia";
import { AnimatedPath } from "./AnimatedPath";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";

export type CartesianLinePathProps = {
  data: PointsArray;
  isAnimated?: boolean;
  animationConfig?: PathAnimationConfig;
  color?: string;
  strokeWidth?: number;
} & CartesianLineOptions;

export function CartesianLine({
  data,
  isAnimated,
  animationConfig,
  color = "black",
  strokeWidth = 1,
  ...ops
}: CartesianLinePathProps) {
  const path = useCartesianLinePath(data, ops);

  return React.createElement(isAnimated ? AnimatedPath : Path, {
    path,
    style: "stroke",
    color,
    strokeWidth,
    animationConfig,
  });
}
