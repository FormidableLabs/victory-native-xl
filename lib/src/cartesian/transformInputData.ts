import type {
  NumericalFields,
  PrimitiveViewWindow,
  ScaleType,
  TransformedData,
} from "../types";
import { type ScaleLinear, scaleLinear, scaleLog } from "d3-scale";
import type { GridProps } from "../grid/Grid";
import { Grid } from "../grid/Grid";
import { asNumber } from "../utils/asNumber";
import { makeScale } from "./utils/makeXScale";

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
  RawData extends Record<string, unknown>,
  T extends NumericalFields<RawData>,
  XK extends keyof T,
  YK extends keyof T,
>({
  data: _data,
  xKey,
  yKeys,
  outputWindow,
  xScaleType,
  yScaleType,
  gridOptions,
  domain,
}: {
  data: RawData[];
  xKey: XK;
  yKeys: YK[];
  xScaleType: ScaleType;
  yScaleType: Omit<ScaleType, "band">;
  outputWindow: PrimitiveViewWindow;
  gridOptions?: Partial<
    Omit<GridProps<RawData, T, XK, YK>, "xScale" | "yScale">
  >;
  domain?: { x?: [number] | [number, number]; y?: [number] | [number, number] };
}): TransformedData<RawData, T, YK> & {
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
} => {
  const data = _data as unknown as T[];

  // Take into account Grid component defaultProps
  const _gridOptions = Object.assign(
    {},
    Grid.defaultProps,
    gridOptions,
  ) as typeof gridOptions;
  // Input x is just extracting the xKey from each datum
  const ix = data.map((datum) => asNumber(datum[xKey]));

  // Then we find min/max of y values across all yKeys, use that for y range.
  // (if user provided a domain, use that instead)
  const yMin =
    domain?.y?.[0] ??
    Math.min(
      ...yKeys.map((key) => {
        return Math.min(...data.map((datum) => asNumber(datum[key])));
      }),
    );
  const yMax =
    domain?.y?.[1] ??
    Math.max(
      ...yKeys.map((key) =>
        Math.max(...data.map((datum) => asNumber(datum[key]))),
      ),
    );

  // Set up our y-output data structure
  const y = yKeys.reduce(
    (acc, k) => {
      acc[k] = { i: [], o: [] };
      return acc;
    },
    {} as TransformedData<RawData, T, YK>["y"],
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
    y[yKey].i = data.map((datum) => asNumber(datum[yKey]));
    y[yKey].o = data.map((datum) => yScale(asNumber(datum[yKey])));
  });

  // Measure our top-most y-label if we have grid options so we can
  //  compensate for it in our x-scale.
  const topYLabel =
    gridOptions?.formatYLabel?.(yScale.domain().at(0) as T[YK]) ||
    String(yScale.domain().at(0));

  // Generate our x-scale
  const ixMin = asNumber(domain?.x?.[0] ?? ix.at(0)),
    ixMax = asNumber(domain?.x?.[1] ?? ix.at(-1));
  const topYLabelWidth = gridOptions?.font?.getTextWidth(topYLabel) ?? 0;
  // Determine our x-output range based on yAxis/label options
  const oRange: [number, number] = (() => {
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

  const xScale = makeScale({
    scaleType: xScaleType,
    inputBounds: [ixMin, ixMax],
    outputBounds: oRange,
  });
  const ox = ix.map((x) => xScale(x)!);

  return {
    ix,
    ox,
    y,
    xScale,
    yScale,
  };
};
