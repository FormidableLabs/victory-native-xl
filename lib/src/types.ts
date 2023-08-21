import { type SharedValue } from "react-native-reanimated";
import { type ScaleLinear } from "d3-scale";
import type { SkPath } from "@shopify/react-native-skia";

export type PrimitiveViewWindow = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export type ViewWindow = {
  xMin: SharedValue<number>;
  xMax: SharedValue<number>;
  yMin: SharedValue<number>;
  yMax: SharedValue<number>;
};

export type InputDatum = Record<string, string | number>;

export type XAxisSide = "top" | "bottom";
export type YAxisSide = "left" | "right";
export type AxisLabelPosition = "inset" | "outset";

export type ValueOf<T> = T[keyof T];
export type TransformedData<
  T extends InputDatum,
  XK extends keyof T,
  YK extends keyof T,
> = {
  ix: T[XK][];
  ox: number[];
  y: { [K in YK]: { i: T[K][]; o: number[] } };
};

/**
 * Used for e.g. padding where you can pass a single value or a sided object
 */
export type SidedNumber =
  | number
  | { left?: number; right?: number; top?: number; bottom?: number };

export type ScaleType = "linear" | "log" | "band";

/**
 * Render arg for our line chart.
 */
export type ChartBounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};
export type CartesianChartRenderArg<
  T extends InputDatum,
  XK extends keyof T,
  YK extends keyof T,
> = {
  paths: { [K in YK as `${K & string}.${"line" | "area"}`]: SkPath };
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  isPressActive: boolean;
  activePressX: {
    value: SharedValue<T[XK] | null>;
    position: SharedValue<number>;
  };
  activePressY: {
    [K in YK]: { value: SharedValue<T[K]>; position: SharedValue<number> };
  };
  chartBounds: ChartBounds;
  canvasSize: { width: number; height: number };
};
