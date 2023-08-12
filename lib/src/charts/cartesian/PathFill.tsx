import * as React from "react";
import { Fill, LinearGradient } from "@shopify/react-native-skia";
import type { BaseFillChartProps } from "lib/src/types";

export type PathFillProps = Pick<
  BaseFillChartProps,
  "fillColor" | "gradientVectors"
>;

export function PathFill({ fillColor, gradientVectors }: PathFillProps) {
  if (Array.isArray(fillColor))
    return (
      <LinearGradient
        start={gradientVectors.start}
        end={gradientVectors.end}
        colors={fillColor}
      />
    );
  else if (typeof fillColor === "string") return <Fill color={"fillColor"} />;
  return null;
}
