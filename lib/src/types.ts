import { type SharedValue } from "react-native-reanimated";
import { type ScaleLinear } from "d3-scale";
import {
  type Color,
  type DashPathEffect,
  type SkFont,
} from "@shopify/react-native-skia";

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

export type YAxisDomain = [number] | [number, number] | null;

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

/**
 * @deprecated This prop will eventually be replaced by the new, separate x/y/frame props below. For now it's being kept around for backwards compatibility sake.
 */
export type AxisProps<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
> = {
  xTicksNormalized: number[];
  yTicksNormalized: number[];
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  font?: SkFont | null;
  lineColor?: Color | { grid: Color | { x: Color; y: Color }; frame: Color };
  lineWidth?:
    | number
    | { grid: number | { x: number; y: number }; frame: number };
  labelColor?: string | { x: string; y: string };
  tickCount?: number | { x: number; y: number };
  tickValues?: number[] | { x: number[]; y: number[] };
  labelOffset?: number | { x: number; y: number };
  labelPosition?:
    | AxisLabelPosition
    | { x: AxisLabelPosition; y: AxisLabelPosition };
  axisSide?: { x: XAxisSide; y: YAxisSide };
  formatXLabel?: (label: InputFields<RawData>[XK]) => string;
  formatYLabel?: (label: RawData[YK]) => string;
  domain?: YAxisDomain;
  isNumericalData?: boolean;
  ix?: InputFields<RawData>[XK][];
};

// The default prop options we pass in
export type AxisPropWithDefaults<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
> = Omit<
  Required<AxisProps<RawData, XK, YK>>,
  | "xScale"
  | "yScale"
  | "yTicksNormalized"
  | "xTicksNormalized"
  | "font"
  | "tickValues"
  | "isNumericalData"
>;
// The optional remaining props afterwards
export type OptionalAxisProps<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
> = {
  tickValues?: number[] | { x: number[]; y: number[] };
  font?: SkFont | null;
  formatXLabel?: (label: InputFields<RawData>[XK]) => string;
  formatYLabel?: (label: RawData[YK]) => string;
};

type DashPathEffectProps = React.ComponentProps<typeof DashPathEffect>;
type DashPathEffectComponent = React.ReactElement<DashPathEffectProps>;

export type XAxisInputProps<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
> = {
  axisSide?: XAxisSide;
  font?: SkFont | null;
  formatXLabel?: (label: InputFields<RawData>[XK]) => string;
  labelColor?: string;
  labelOffset?: number;
  labelPosition?: AxisLabelPosition;
  lineColor?: Color;
  lineWidth?: number;
  tickCount?: number;
  tickValues?: number[];
  yAxisSide?: YAxisSide;
  linePathEffect?: DashPathEffectComponent;
};

export type XAxisPropsWithDefaults<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
> = Required<
  Omit<XAxisInputProps<RawData, XK>, "font" | "tickValues" | "linePathEffect">
> &
  Partial<
    Pick<XAxisInputProps<RawData, XK>, "font" | "tickValues" | "linePathEffect">
  >;

export type XAxisProps<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
> = XAxisPropsWithDefaults<RawData, XK> & {
  xScale: Scale;
  yScale: Scale;
  isNumericalData: boolean;
  ix: InputFields<RawData>[XK][];
};

export type YAxisInputProps<
  RawData extends Record<string, unknown>,
  YK extends keyof NumericalFields<RawData>,
> = {
  axisSide?: YAxisSide;
  font?: SkFont | null;
  formatYLabel?: (label: RawData[YK]) => string;
  labelColor?: string;
  labelOffset?: number;
  labelPosition?: AxisLabelPosition;
  lineColor?: Color;
  lineWidth?: number;
  tickCount?: number;
  tickValues?: number[];
  yKeys?: YK[];
  domain?: YAxisDomain;
  linePathEffect?: DashPathEffectComponent;
};

export type YAxisPropsWithDefaults<
  RawData extends Record<string, unknown>,
  YK extends keyof NumericalFields<RawData>,
> = Required<
  Omit<YAxisInputProps<RawData, YK>, "font" | "tickValues" | "linePathEffect">
> &
  Partial<
    Pick<YAxisInputProps<RawData, YK>, "font" | "tickValues" | "linePathEffect">
  >;

export type YAxisProps<
  RawData extends Record<string, unknown>,
  YK extends keyof NumericalFields<RawData>,
> = YAxisPropsWithDefaults<RawData, YK> & {
  xScale: Scale;
  yScale: Scale;
  yTicksNormalized: number[];
  yKeys: YK[];
};

export type FrameInputProps = {
  lineWidth?: SidedNumber;
  lineColor?: Color;
  linePathEffect?: DashPathEffectComponent;
};
export type FramePropsWithDefaults = Required<
  Omit<FrameInputProps, "linePathEffect">
> & { linePathEffect?: DashPathEffectComponent };
export type FrameProps = FramePropsWithDefaults & {
  xScale: Scale;
  yScale: Scale;
};

export type NonEmptyArray<T> = [T, ...T[]];
