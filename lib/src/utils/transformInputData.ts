import type { SkFont } from "@shopify/react-native-skia";
import type {
  InputDatum,
  PrimitiveViewWindow,
  ScaleType,
  TransformedData,
} from "../types";
import { scaleBand, type ScaleLinear, scaleLinear, scaleLog } from "d3-scale";

/**
 * This is a fatty. Takes raw user input data, and transforms it into a format
 *  that's easier for us to consume. End result looks something like:
 *  {
 *    ix: [1, 2, 3], // input x values
 *    ox: [10, 20, 30], // canvas x values
 *    y: {
 *      high: { i: [3, 4, 5], o: [30, 40, 50] },
 *      low: { ... }
 *    }
 *  }
 *  This form allows us to easily e.g. do a binary search to find closest output x index
 *   and then map that into each of the other value lists.
 */
export const transformInputData = <
  T extends InputDatum,
  XK extends keyof T,
  YK extends keyof T,
>({
  data,
  xKey,
  yKeys,
  outputWindow,
  xScaleType,
  yScaleType,
  gridOptions,
}: {
  data: T[];
  xKey: XK;
  yKeys: YK[];
  xScaleType: ScaleType;
  yScaleType: Omit<ScaleType, "band">;
  outputWindow: PrimitiveViewWindow;
  gridOptions?: {
    font?: SkFont | null;
    labelOffset?: number;
    formatYLabel?: (label: T[YK]) => string;
  };
}): TransformedData<T, XK, YK> & {
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
} => {
  // Input x is just extracting the xKey from each datum
  const ix = data.map((datum) => datum[xKey]);

  // Then we find min/max of y values across all yKeys, use that for y range.
  const yMin = Math.min(
    ...yKeys.map((key) => Math.min(...data.map((datum) => datum[key]))),
  );
  const yMax = Math.max(
    ...yKeys.map((key) => Math.max(...data.map((datum) => datum[key]))),
  );

  // Set up our y-output data structure
  const y = yKeys.reduce(
    (acc, k) => {
      acc[k] = { i: [], o: [] };
      return acc;
    },
    {} as TransformedData<T, XK, YK>["y"],
  );

  // If grid options present, we need to compensate for the grid labels
  const yMaxGridCompensation =
    -(gridOptions?.font?.getSize?.() ?? 0) -
    (gridOptions?.labelOffset ?? 0) * 2;

  // Set up our y-scale, notice how domain is "flipped" because
  //  we're moving from cartesian to canvas coordinates
  const yScaleDomain = [yMax, yMin],
    yScaleRange = [outputWindow.yMin, outputWindow.yMax + yMaxGridCompensation];
  const yScale =
    yScaleType === "linear"
      ? scaleLinear().domain(yScaleDomain).range(yScaleRange).nice()
      : scaleLog().domain(yScaleDomain).range(yScaleRange);

  yKeys.forEach((yKey) => {
    y[yKey].i = data.map((datum) => datum[yKey]);
    y[yKey].o = data.map((datum) => yScale(datum[yKey]));
  });

  // Measure our top-most y-label if we have grid options so we can
  //  compensate for it in our x-scale.
  const topYLabel = gridOptions?.formatYLabel?.(yScale.domain().at(-1)) || "";
  const xMinGridCompensation =
    (gridOptions?.font?.getTextWidth(topYLabel) ?? 0) +
    (gridOptions?.labelOffset ?? 0);

  // Generate our x-scale
  const ixMin = ix.at(0),
    ixMax = ix.at(-1),
    oRange = [outputWindow.xMin + xMinGridCompensation, outputWindow.xMax];

  const xScale =
    xScaleType === "linear"
      ? scaleLinear().domain([ixMin, ixMax]).range(oRange)
      : xScaleType === "log"
      ? scaleLog().domain([ixMin, ixMax]).range(oRange)
      : scaleBand().domain(ix).range(oRange);
  const ox = ix.map((x) => xScale(x));

  return {
    ix,
    ox,
    y,
    xScale,
    yScale,
  };
};
