import { type SharedValue } from "react-native-reanimated";
import { type ScaleLinear } from "d3-scale";
import { type SkFont } from "@shopify/react-native-skia";

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

export type InputDatum = Record<string, unknown>;

export type XAxisSide = "top" | "bottom";
export type YAxisSide = "left" | "right";
export type AxisLabelPosition = "inset" | "outset";

export type ScatterOptions = {
  radius: number;
};

export type ValueOf<T> = T[keyof T];
export type TransformedData<
  RawData extends Record<string, unknown>,
  T extends NumericalFields<RawData>,
  YK extends keyof T,
> = {
  ix: number[];
  ox: number[];
  y: { [K in YK]: { i: number[]; o: number[] } };
};

/**
 * Used for e.g. padding where you can pass a single value or a sided object
 */
export type SidedNumber =
  | number
  | { left?: number; right?: number; top?: number; bottom?: number };

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
  RawData extends Record<string, unknown>,
  T extends NumericalFields<RawData>,
  YK extends keyof T,
> = {
  xScale: Scale;
  yScale: Scale;
  isPressActive: boolean;
  chartBounds: ChartBounds;
  canvasSize: { width: number; height: number };
  points: {
    [K in YK]: PointsArray;
  };
};

export type Scale = ScaleLinear<number, number>;

export type PointsArray = {
  x: number;
  xValue: number;
  y: number;
  yValue: number;
}[];

export type NumericalFields<T> = {
  [K in keyof T as T[K] extends number ? K : never]: T[K];
};

export type GridProps = {
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  lineColor: string;
};

export type AxisProps<
  RawData extends Record<string, unknown>,
  T extends NumericalFields<RawData>,
  XK extends keyof T,
  YK extends keyof T,
> = {
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  font?: SkFont | null;
  lineColor: string;
  labelColor: string | { x: string; y: string };
  tickCount: number | { x: number; y: number };
  labelOffset: number | { x: number; y: number };
  labelPosition:
    | AxisLabelPosition
    | { x: AxisLabelPosition; y: AxisLabelPosition };
  axisSide: { x: XAxisSide; y: YAxisSide };
  formatXLabel: (label: T[XK]) => string;
  formatYLabel: (label: T[YK]) => string;
};
