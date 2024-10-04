import * as React from "react";
import { Path, type Color, type PathProps } from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { type AreaPathOptions } from "../hooks/useAreaPath";
import { AnimatedPath } from "./AnimatedPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";
import { useStackedAreaPaths } from "../hooks/useStackedAreaPaths";
type CustomizablePathProps = Partial<
  Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">
>;

export type StackedAreaProps = {
  points: PointsArray[];
  y0: number;
  animate?: PathAnimationConfig;
  colors?: Color[];
  areaOptions?: ({
    rowIndex,
    lowestY,
    highestY,
  }: {
    rowIndex: number;
    lowestY: number;
    highestY: number;
  }) => CustomizablePathProps & {
    children?: React.ReactNode;
  };
} & AreaPathOptions;

const DEFAULT_COLORS = ["red", "orange", "yellow", "green", "blue", "purple"];

export function StackedArea({
  points,
  y0,
  animate,
  curveType,
  colors = DEFAULT_COLORS,
  areaOptions,
}: React.PropsWithChildren<StackedAreaProps>) {
  const paths = useStackedAreaPaths({
    pointsArray: points,
    colors,
    y0,
    curveType,
    areaOptions,
  });

  return paths.map((p) => {
    return React.createElement(animate ? AnimatedPath : Path, {
      ...p,
      ...(Boolean(animate) && { animate }),
    });
  });
}
