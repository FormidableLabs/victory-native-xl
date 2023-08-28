import * as React from "react";
import { Path, type PathProps } from "@shopify/react-native-skia";
import type { PointsArray } from "victory-native";
import {
  type CartesianLineOptions,
  useCartesianLinePath,
} from "../hooks/useCartesianLinePath";
import { AnimatedPath } from "./AnimatedPath";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";

export type CartesianLinePathProps = {
  points: PointsArray;
  animate?: PathAnimationConfig;
  color?: string;
  strokeWidth?: number;
} & CartesianLineOptions &
  Partial<
    Pick<PathProps, "color" | "strokeWidth" | "strokeJoin" | "strokeCap">
  >;

export function CartesianLine({
  points,
  animate,
  curveType,
  ...ops
}: React.PropsWithChildren<CartesianLinePathProps>) {
  const path = useCartesianLinePath(points, { curveType });

  return React.createElement(animate ? AnimatedPath : Path, {
    path,
    style: "stroke",
    ...ops,
    ...(Boolean(animate) && { animate }),
  });
}
