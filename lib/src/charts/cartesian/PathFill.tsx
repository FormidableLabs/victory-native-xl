import * as React from "react";
import { Fill, LinearGradient, vec } from "@shopify/react-native-skia";
import type { BaseCartesianChartProps } from "lib/src/types";

export type PathFillProps = Pick<BaseCartesianChartProps, "fillColor">;

export function PathFill({ fillColor }: PathFillProps) {
  return Array.isArray(fillColor) ? (
    <LinearGradient start={vec(0, 0)} end={vec(0, 256)} colors={fillColor} />
  ) : (
    <Fill color={fillColor} />
  );
}
