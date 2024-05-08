import { type SharedValue } from "react-native-reanimated";
import { type ScaleLinear } from "d3-scale";
import { type Color, type SkFont } from "@shopify/react-native-skia";

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

export type MaybeNumber = number | null | undefined;

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
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
> = {
  ix: InputFields<RawData>[XK][];
  ox: number[];
  y: { [K in YK]: { i: MaybeNumber[]; o: MaybeNumber[] } };
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
  YK extends keyof NumericalFields<RawData>,
> = {
  xScale: Scale;
  yScale: Scale;
  chartBounds: ChartBounds;
  canvasSize: { width: number; height: number };
  points: {
    [K in YK]: PointsArray;
  };
};

export type Scale = ScaleLinear<number, number>;

export type PointsArray = {
  x: number;
  xValue: InputFieldType;
  y: MaybeNumber;
  yValue: MaybeNumber;
}[];

export type InputFieldType = number | string;
export type InputFields<T> = {
  [K in keyof T as T[K] extends InputFieldType
    ? K
    : never]: T[K] extends InputFieldType ? T[K] : never;
};
export type NumericalFields<T> = {
  [K in keyof T as T[K] extends MaybeNumber ? K : never]: T[K];
};

export type ColorFields<T> = {
  [K in keyof T as T[K] extends Color ? K : never]: T[K];
};

export type StringKeyOf<T> = Extract<keyof T, string>;

export type AxisProps<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
> = {
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  font?: SkFont | null;
  lineColor: Color | { grid: Color | { x: Color; y: Color }; frame: Color };
  lineWidth:
    | number
    | { grid: number | { x: number; y: number }; frame: number };
  labelColor: string | { x: string; y: string };
  tickCount: number | { x: number; y: number };
  tickValues?: number[] | { x: number[]; y: number[] };
  labelOffset: number | { x: number; y: number };
  labelPosition:
    | AxisLabelPosition
    | { x: AxisLabelPosition; y: AxisLabelPosition };
  axisSide: { x: XAxisSide; y: YAxisSide };
  formatXLabel: (label: InputFields<RawData>[XK]) => string;
  formatYLabel: (label: RawData[YK]) => string;
  isNumericalData?: boolean;
  ix: InputFields<RawData>[XK][];
};
