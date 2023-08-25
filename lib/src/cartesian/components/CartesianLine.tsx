import * as React from "react";
import type { PointsArray } from "victory-native";
import {
  type CartesianLineOptions,
  useCartesianLinePath,
} from "../hooks/useCartesianLinePath";
import { Path, type PathProps } from "@shopify/react-native-skia";
import { AnimatedPath } from "./AnimatedPath";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";

export type CartesianLinePathProps = {
  data: PointsArray;
  isAnimated?: boolean;
  animationConfig?: PathAnimationConfig;
  color?: string;
  strokeWidth?: number;
} & CartesianLineOptions &
  Partial<
    Pick<PathProps, "color" | "strokeWidth" | "strokeJoin" | "strokeCap">
  >;

export function CartesianLine({
  data,
  isAnimated,
  animationConfig,
  curveType,
  ...ops
}: React.PropsWithChildren<CartesianLinePathProps>) {
  const path = useCartesianLinePath(data, { curveType });

  return React.createElement(isAnimated ? AnimatedPath : Path, {
    path,
    style: "stroke",
    ...ops,
    ...(isAnimated && { animationConfig }),
  });
}
