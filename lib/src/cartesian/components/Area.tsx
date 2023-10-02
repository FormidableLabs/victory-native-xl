import * as React from "react";
import { Path, type PathProps } from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { type AreaPathOptions, useAreaPath } from "../hooks/useAreaPath";
import { AnimatedPath } from "./AnimatedPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";

export type AreaProps = {
  points: PointsArray;
  y0: number;
  animate?: PathAnimationConfig;
} & AreaPathOptions &
  Partial<Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">>;

export function Area({
  points,
  y0,
  animate,
  curveType,
  interpolateMissingData,
  ...ops
}: React.PropsWithChildren<AreaProps>) {
  const { path } = useAreaPath(points, y0, {
    curveType,
    interpolateMissingData,
  });

  return React.createElement(animate ? AnimatedPath : Path, {
    path,
    style: "fill",
    ...ops,
    ...(Boolean(animate) && { animate }),
  });
}
