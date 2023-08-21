import type { SkFont } from "@shopify/react-native-skia";
import type {
  InputDatum,
  PrimitiveViewWindow,
  ScaleType,
  TransformedData,
} from "../types";
import { scaleBand, type ScaleLinear, scaleLinear, scaleLog } from "d3-scale";
import type { GridProps } from "../grid/Grid";
import { Grid } from "../grid/Grid";

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
  domain,
}: {
  data: T[];
  xKey: XK;
  yKeys: YK[];
  xScaleType: ScaleType;
  yScaleType: Omit<ScaleType, "band">;
  outputWindow: PrimitiveViewWindow;
  gridOptions?: Partial<Omit<GridProps<T, XK, YK>, "xScale" | "yScale">>;
  domain?: { x?: [number] | [number, number]; y?: [number] | [number, number] };
}): TransformedData<T, XK, YK> & {
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
} => {
  // Take into account Grid component defaultProps
  const _gridOptions = Object.assign(
    {},
    Grid.defaultProps,
    gridOptions,
  ) as typeof gridOptions;
  // Input x is just extracting the xKey from each datum
  const ix = data.map((datum) => datum[xKey]);

  // Then we find min/max of y values across all yKeys, use that for y range.
  // (if user provided a domain, use that instead)
  const yMin =
    domain?.y?.[0] ??
    Math.min(
      ...yKeys.map((key) => Math.min(...data.map((datum) => datum[key]))),
    );
  const yMax =
    domain?.y?.[1] ??
    Math.max(
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

  // Set up our y-scale, notice how domain is "flipped" because
  //  we're moving from cartesian to canvas coordinates
  const yScaleDomain = [yMax, yMin];
  const fontHeight = gridOptions?.font?.getSize?.() ?? 0;
  // Our yScaleRange is impacted by our grid options
  const yScaleRange = (() => {
    const yLabelPosition =
      typeof _gridOptions?.labelPosition === "string"
        ? _gridOptions.labelPosition
        : _gridOptions?.labelPosition?.x;
    const xAxisSide = _gridOptions?.axisSide?.x;
    const yLabelOffset =
      (typeof _gridOptions?.labelOffset === "number"
        ? _gridOptions.labelOffset
        : _gridOptions?.labelOffset?.y) ?? 0;
    // bottom, outset
    if (xAxisSide === "bottom" && yLabelPosition === "outset") {
      return [
        outputWindow.yMin,
        outputWindow.yMax - fontHeight - yLabelOffset * 2,
      ];
    }
    // Top outset
    if (xAxisSide === "top" && yLabelPosition === "outset") {
      return [
        outputWindow.yMin + fontHeight + yLabelOffset * 2,
        outputWindow.yMax,
      ];
    }
    // Inset labels don't need added offsets
    return [outputWindow.yMin, outputWindow.yMax];
  })();

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
  const topYLabel =
    gridOptions?.formatYLabel?.(yScale.domain().at(0)) ||
    String(yScale.domain().at(0));

  // Generate our x-scale
  const ixMin = domain?.x?.[0] ?? ix.at(0),
    ixMax = domain?.x?.[1] ?? ix.at(-1);
  const topYLabelWidth = gridOptions?.font?.getTextWidth(topYLabel) ?? 0;
  // Determine our x-output range based on yAxis/label options
  const oRange = (() => {
    const yLabelPosition =
      typeof _gridOptions?.labelPosition === "string"
        ? _gridOptions.labelPosition
        : _gridOptions?.labelPosition?.y;
    const yAxisSide = _gridOptions?.axisSide?.y;
    const yLabelOffset =
      (typeof _gridOptions?.labelOffset === "number"
        ? _gridOptions.labelOffset
        : _gridOptions?.labelOffset?.y) ?? 0;

    // Left axes, outset label
    if (yAxisSide === "left" && yLabelPosition === "outset") {
      return [
        outputWindow.xMin + topYLabelWidth + yLabelOffset,
        outputWindow.xMax,
      ];
    }
    // Right axes, outset label
    if (yAxisSide === "right" && yLabelPosition === "outset") {
      return [
        outputWindow.xMin,
        outputWindow.xMax - topYLabelWidth - yLabelOffset,
      ];
    }
    // Inset labels don't need added offsets
    return [outputWindow.xMin, outputWindow.xMax];
  })();

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
