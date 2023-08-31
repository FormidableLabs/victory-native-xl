import * as React from "react";
import {
  Path,
  type PathProps,
  type SkiaDefaultProps,
} from "@shopify/react-native-skia";
import type { PointsArray } from "victory-native";
import { type LinePathOptions, useLinePath } from "../hooks/useLinePath";
import { AnimatedPath } from "./AnimatedPath";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";

export type CartesianLinePathProps = {
  points: PointsArray;
  animate?: PathAnimationConfig;
} & LinePathOptions &
  SkiaDefaultProps<
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
      | "start"
      | "end"
    >,
    "start" | "end"
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
