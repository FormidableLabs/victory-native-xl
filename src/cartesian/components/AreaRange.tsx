import * as React from "react";
import { Path, type PathProps } from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { type AreaPathOptions, useAreaPath } from "../hooks/useAreaPath";
import { AnimatedPath } from "./AnimatedPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";

// Extend PointsArray but make y represent upper bound and y0 lower bound
export type AreaRangePointsArray = {
  x: number;
  xValue: PointsArray[number]["xValue"];
  y: number;
  y0: number;
  yValue: PointsArray[number]["yValue"];
}[];

export type AreaRangeProps = {
  points: AreaRangePointsArray;
  animate?: PathAnimationConfig;
} & AreaPathOptions &
  Partial<Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">>;

export function AreaRange({
  points,
  animate,
  curveType,
  connectMissingData,
  ...ops
}: React.PropsWithChildren<AreaRangeProps>) {
  const areaRangePoints = React.useMemo(() => {
    // Create upper bound points going forward
    const upperPoints = points.map((point) => ({
      ...point,
      y: point.y,
    }));

    // Create lower bound points going backward
    const lowerPoints = [...points].reverse().map((point) => ({
      ...point,
      y: point.y0,
    }));

    // Combine into single array that traces a complete path
    return [...upperPoints, ...lowerPoints];
  }, [points]);

  const { path } = useAreaPath(areaRangePoints, 0, {
    curveType,
    connectMissingData,
  });

  return React.createElement(animate ? AnimatedPath : Path, {
    path,
    style: "fill",
    ...ops,
    ...(Boolean(animate) && { animate }),
  });
}
