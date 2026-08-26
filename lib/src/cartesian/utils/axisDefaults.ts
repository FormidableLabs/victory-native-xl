import { StyleSheet } from "react-native";
import type {
  AxisProps,
  InputDatum,
  ValueOf,
  XAxisPropsWithDefaults,
  YAxisPropsWithDefaults,
} from "../../types";

export const CartesianAxisDefaultProps = {
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  lineWidth: StyleSheet.hairlineWidth,
  tickCount: 5,
  labelOffset: { x: 2, y: 4 },
  axisSide: { x: "bottom", y: "left" },
  axisScales: { xAxisScale: "linear", yAxisScale: "linear" },
  labelPosition: "outset",
  formatXLabel: (label: ValueOf<InputDatum>) => String(label),
  formatYLabel: (label: ValueOf<InputDatum>) => String(label),
  labelColor: "#000000",
  ix: [],
  domain: null,
} satisfies Partial<AxisProps<never, never, never>>;

export const XAxisDefaults = {
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  lineWidth: StyleSheet.hairlineWidth,
  tickCount: 5,
  labelOffset: 2,
  axisSide: "bottom",
  yAxisSide: "left",
  labelPosition: "outset",
  formatXLabel: (label: ValueOf<InputDatum>) => String(label),
  labelColor: "#000000",
  labelRotate: 0,
} satisfies XAxisPropsWithDefaults<never, never>;

export const YAxisDefaults = {
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  lineWidth: StyleSheet.hairlineWidth,
  tickCount: 5,
  labelOffset: 4,
  axisSide: "left",
  labelPosition: "outset",
  formatYLabel: (label: ValueOf<InputDatum>) => String(label),
  labelColor: "#000000",
  yKeys: [],
  domain: null,
} satisfies YAxisPropsWithDefaults<never, never>;

export const FrameDefaults = {
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  lineWidth: StyleSheet.hairlineWidth,
};
