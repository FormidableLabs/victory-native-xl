import * as React from "react";
import type { PointsArray } from "victory-native";
import {
  type CartesianLineOptions,
  useCartesianLinePath,
} from "../hooks/useCartesianLinePath";
import { Path } from "@shopify/react-native-skia";

export type CartesianLinePathProps = {
  data: PointsArray;
  color?: string;
  strokeWidth?: number;
} & CartesianLineOptions;

/**
 * TODO: Option for isAnimated
 */
export function CartesianLine({
  data,
  color = "black",
  strokeWidth = 1,
  ...ops
}: CartesianLinePathProps) {
  const path = useCartesianLinePath(data, ops);
  return (
    <Path path={path} style="stroke" color={color} strokeWidth={strokeWidth} />
  );
}
