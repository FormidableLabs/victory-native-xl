export {
  type InputDatum,
  type CartesianChartRenderArg,
  type ChartBounds,
} from "./types";
export type { CurveType } from "./cartesian/makeCartesianPath";

export { CartesianChart } from "./cartesian/CartesianChart";

/**
 * Utility hooks
 */
export { useAnimatedPath } from "./hooks/useAnimatedPath";
