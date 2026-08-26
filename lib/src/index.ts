/**
 * Cartesian chart exports (including useful types)
 */
export {
  CartesianChart,
  type CartesianActionsHandle,
  type CartesianActionsRef,
  type CartesianChartRef,
} from "./cartesian/CartesianChart";
export { type ChartExplicitSize } from "./shared/ChartExplicitSize";
export { type ChartLayoutModeProps } from "./shared/ChartLayoutModeProps";

export {
  type InputDatum,
  type CartesianChartRenderArg,
  type Viewport,
  type ChartBounds,
  type ChartPressPanConfig,
  type CartesianChartOrientation,
  type YAxisSide,
  type XAxisSide,
  type AxisTitle,
  type AxisTitlePosition,
  type AxisLabelMeasureArgs,
  type AxisLabelMeasurement,
  type AxisLabelRenderer,
  type AxisLabelRenderArgs,
  type PointsArray,
  type Scale,
  type MaybeNumber,
} from "./types";
export { type CurveType } from "./cartesian/utils/curves";
export {
  createRoundedRectPath,
  type RoundedCorners,
} from "./utils/createRoundedRectPath";

export { useAnimatedPath } from "./hooks/useAnimatedPath";
export { AnimatedPath } from "./cartesian/components/AnimatedPath";
export { usePrevious } from "./utils/usePrevious";
export {
  useChartPressState,
  type ChartPressState,
} from "./cartesian/hooks/useChartPressState";

export { useChartTransformState } from "./cartesian/hooks/useChartTransformState";
export {
  useCartesianChartContext,
  type CartesianChartContextValue,
} from "./cartesian/contexts/CartesianChartContext";
export {
  useCartesianTransformContext,
  type CartesianTransformContextValue,
} from "./cartesian/contexts/CartesianTransformContext";
export {
  getTransformComponents,
  setScale,
  setTranslate,
  invert4,
} from "./utils/transform";

// Line
export { useLinePath } from "./cartesian/hooks/useLinePath";
export { Line } from "./cartesian/components/Line";

// Bar
export { useBarPath } from "./cartesian/hooks/useBarPath";
export { useHorizontalBarPath } from "./cartesian/hooks/useHorizontalBarPath";
export {
  useBarWidth,
  type UseBarWidthOptions,
} from "./cartesian/hooks/useBarWidth";
export {
  getBarWidth,
  type GetBarWidthArgs,
} from "./cartesian/utils/getBarWidth";
export { Bar } from "./cartesian/components/Bar";
export { HorizontalBar } from "./cartesian/components/HorizontalBar";

// StackedBar
export {
  useStackedBarPaths,
  type StackedBarOptions,
  type StackedBarOptionsContext,
  type StackedBarOptionsFn,
  type StackedBarPath,
} from "./cartesian/hooks/useStackedBarPaths";
export { StackedBar } from "./cartesian/components/StackedBar";
export {
  useHorizontalStackedBarPaths,
  type HorizontalStackedBarOptions,
  type HorizontalStackedBarOptionsContext,
  type HorizontalStackedBarOptionsFn,
  type HorizontalStackedBarPath,
} from "./cartesian/hooks/useHorizontalStackedBarPaths";
export { HorizontalStackedBar } from "./cartesian/components/HorizontalStackedBar";

// Bar group
export { useBarGroupPaths } from "./cartesian/hooks/useBarGroupPaths";
export { useHorizontalBarGroupPaths } from "./cartesian/hooks/useHorizontalBarGroupPaths";
export { BarGroup } from "./cartesian/components/BarGroup";
export { HorizontalBarGroup } from "./cartesian/components/HorizontalBarGroup";

// Area
export { useAreaPath } from "./cartesian/hooks/useAreaPath";
export { Area } from "./cartesian/components/Area";
export { StackedArea } from "./cartesian/components/StackedArea";
export { AreaRange } from "./cartesian/components/AreaRange";
export { useStackedAreaPaths } from "./cartesian/hooks/useStackedAreaPaths";

// Scatter
export { Scatter, type ScatterShape } from "./cartesian/components/Scatter";

// Candlestick
export {
  Candlestick,
  type CandlestickProps,
} from "./cartesian/components/Candlestick";
export {
  useCandlestickPaths,
  type CandlestickBodyPathOptions,
  type CandlestickColors,
  type CandlestickOptions,
  type CandlestickOptionsContext,
  type CandlestickOptionsFn,
  type CandlestickPathGroup,
  type CandlestickWickPathOptions,
  type CustomCandlestickPath,
  type UseCandlestickPathsArgs,
  type UseCandlestickPathsResult,
} from "./cartesian/hooks/useCandlestickPaths";
export {
  getCandlestickGeometry,
  type CandlestickGeometry,
  type CandlestickLine,
  type CandlestickRect,
  type CandlestickStatus,
  type GetCandlestickGeometryArgs,
} from "./cartesian/utils/getCandlestickGeometry";

// Grid and Axis
export { CartesianAxis } from "./cartesian/components/CartesianAxis";
export {
  createParagraphLabelRenderer,
  type CreateParagraphLabelRendererOptions,
} from "./cartesian/utils/createParagraphLabelRenderer";

/**
 * Polar chart exports
 */
export { PolarChart } from "./polar/PolarChart";

/**
 * Pie chart exports (including useful types)
 */
export { Pie, type PieSliceData } from "./pie";

export { useSlicePath } from "./pie/hooks/useSlicePath";
export { useSliceAngularInsetPath } from "./pie/hooks/useSliceAngularInsetPath";
