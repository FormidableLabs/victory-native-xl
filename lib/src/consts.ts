import { vec } from "@shopify/react-native-skia";
import type { BaseFillChartProps, BaseStrokeChartProps } from "./types";

export const BAR_WIDTH = 12;

export const CHART_PADDING = 20;

export const defaultBaseFillChartProps: BaseFillChartProps = {
  animationDuration: 300,
  dataKey: "y",
  fillColor: ["#4f46e5", "#0d9488"],
  gradientVectors: {
    start: vec(0, 0),
    end: vec(0, 256),
  },
};

export const defaultBaseStrokeChartProps: BaseStrokeChartProps = {
  animationDuration: 300,
  dataKey: "y",
  strokeColor: "#4f46e5",
  strokeWidth: 8,
};
