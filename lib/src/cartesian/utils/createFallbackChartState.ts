import type {
  InputFields,
  NumericalFields,
  TransformedData,
} from "../../types";
import { makeScale } from "./makeScale";

/**
 * Helper for creating "fallback" chart state if there's no data.
 * Prevents crashes due to null/empty scales & arrays.
 */
export function createFallbackChartState<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>(yKeys: YK[]) {
  const fallbackScale = makeScale({
    inputBounds: [0, 1],
    outputBounds: [0, 1],
  });

  return {
    yAxes: [
      {
        yScale: fallbackScale,
        yTicksNormalized: [],
      },
    ],
    xScale: fallbackScale,
    chartBounds: { left: 0, right: 0, top: 0, bottom: 0 },
    isNumericalData: false,
    xTicksNormalized: [] as number[],
    _tData: {
      ix: [],
      ox: [],
      y: yKeys.reduce(
        (acc, key) => {
          acc[key] = { i: [], o: [] };
          return acc;
        },
        {} as TransformedData<RawData, XK, YK>["y"],
      ),
    },
  };
}
