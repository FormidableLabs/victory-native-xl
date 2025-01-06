/**
 * Cartesian chart exports (including useful types)
 */
export {
  CartesianChart,
  type CartesianActionsHandle,
} from "./cartesian/CartesianChart";

export {
  type InputDatum,
  type CartesianChartRenderArg,
  type Viewport,
  type ChartBounds,
  type YAxisSide,
  type XAxisSide,
  type PointsArray,
  type Scale,
  type MaybeNumber,
} from "./types";
export { type CurveType } from "./cartesian/utils/curves";
export { type RoundedCorners } from "./utils/createRoundedRectPath";

export { useAnimatedPath } from "./hooks/useAnimatedPath";
export { AnimatedPath } from "./cartesian/components/AnimatedPath";
export { usePrevious } from "./utils/usePrevious";
export {
  useChartPressState,
  type ChartPressState,
} from "./cartesian/hooks/useChartPressState";

export { useChartTransformState } from "./cartesian/hooks/useChartTransformState";
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
export { Bar } from "./cartesian/components/Bar";

// StackedBar
export { useStackedBarPaths } from "./cartesian/hooks/useStackedBarPaths";
export { StackedBar } from "./cartesian/components/StackedBar";

// Bar group
export { useBarGroupPaths } from "./cartesian/hooks/useBarGroupPaths";
export { BarGroup } from "./cartesian/components/BarGroup";

// Area
export { useAreaPath } from "./cartesian/hooks/useAreaPath";
export { Area } from "./cartesian/components/Area";
export { StackedArea } from "./cartesian/components/StackedArea";
export { AreaRange } from "./cartesian/components/AreaRange";
export { useStackedAreaPaths } from "./cartesian/hooks/useStackedAreaPaths";

// Scatter
export { Scatter, type ScatterShape } from "./cartesian/components/Scatter";

// Grid and Axis
export { CartesianAxis } from "./cartesian/components/CartesianAxis";

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
