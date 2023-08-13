import type { SkPoint } from "@shopify/react-native-skia";
import { type SharedValue } from "react-native-reanimated";

export type Point = { x: number; y: number };

export type ViewWindow = {
  xMin: SharedValue<number>;
  xMax: SharedValue<number>;
  yMin: SharedValue<number>;
  yMax: SharedValue<number>;
};

export type InputDatum = Record<string, string | number>;
export type MassagedData = {
  x: number[];
  _x?: (number | string)[];
  y: Record<string, number[]>;
};

/**
 * Used for e.g. padding where you can pass a single value or a sided object
 */
export type SidedNumber =
  | number
  | { left?: number; right?: number; top?: number; bottom?: number };

/**
 * Used as a baseline for Cartesian chart types
 */
export type BaseChartProps = {
  animationDuration: number;
  dataKey: string;
};

/**
 * Base chart type for those that are drawn as shapes with a solid or gradient fill
 */
export type BaseFillChartProps = BaseChartProps & {
  fillColor: string | string[];
  gradientVectors: {
    start: SkPoint;
    end: SkPoint;
  };
};

/**
 * Base chart type for those that are drawn as a path with a stroke
 */
export type BaseStrokeChartProps = BaseChartProps & {
  strokeColor: string;
  strokeWidth: number;
};
