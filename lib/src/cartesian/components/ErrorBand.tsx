import * as React from "react";
import { Path } from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { type AreaProps } from "./Area";
import { useAreaPath } from "../hooks/useAreaPath";
import { AnimatedPath } from "./AnimatedPath";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";

export type ErrorBandProps = {
  points: PointsArray;
  error: number[];
  color?: string;
  animate?: PathAnimationConfig;
  opacity?: number;
} & Omit<AreaProps, "points" | "y0" | "color" | "opacity">;

export function ErrorBand({
  points,
  error,
  animate,
  curveType,
  ...ops
}: ErrorBandProps) {
  // Create a single continuous path that goes around the error band
  const errorBandPoints = React.useMemo(() => {
    // Create upper bound points going forward
    const upperPoints = points.map((point, i) => ({
      ...point,
      y: point.y! + error[i]!,
    }));

    // Create lower bound points going backward
    const lowerPoints = [...points].reverse().map((point, i) => ({
      ...point,
      y: point.y! - error[points.length - 1 - i]!,
    }));

    // Combine into single array that traces a complete path
    return [...upperPoints, ...lowerPoints];
  }, [points, error]);

  // Use useAreaPath to generate the path
  const { path } = useAreaPath(errorBandPoints, errorBandPoints[0]?.y ?? 0, {
    curveType,
  });

  return React.createElement(animate ? AnimatedPath : Path, {
    path,
    style: "fill",
    ...ops,
    ...(Boolean(animate) && { animate }),
  });
}
