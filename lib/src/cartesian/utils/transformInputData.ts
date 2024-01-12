import { type ScaleLinear } from "d3-scale";
import type {
  AxisProps,
  NumericalFields,
  PrimitiveViewWindow,
  SidedNumber,
  TransformedData,
  InputFields,
  MaybeNumber,
} from "../../types";
import { asNumber } from "../../utils/asNumber";
import { makeScale } from "./makeScale";

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
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>({
  data: _data,
  xKey,
  yKeys,
  outputWindow,
  axisOptions,
  domain,
  domainPadding,
}: {
  data: RawData[];
  xKey: XK;
  yKeys: YK[];
  outputWindow: PrimitiveViewWindow;
  axisOptions?: Partial<Omit<AxisProps<RawData, XK, YK>, "xScale" | "yScale">>;
  domain?: { x?: [number] | [number, number]; y?: [number] | [number, number] };
  domainPadding?: SidedNumber;
}): TransformedData<RawData, XK, YK> & {
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  isNumericalData: boolean;
} => {
  const data = [..._data];
  const isNumericalData = data.every(
    (datum) => typeof datum[xKey as keyof RawData] === "number",
  );
  if (isNumericalData) {
    data.sort((a, b) => +a[xKey as keyof RawData] - +b[xKey as keyof RawData]);
  }

  // Input x is just extracting the xKey from each datum
  const ix = data.map(
    (datum) => datum[xKey as keyof RawData],
  ) as InputFields<RawData>[XK][];
  const ixNum = ix.map((val, i) => (isNumericalData ? (val as number) : i));

  // Then we find min/max of y values across all yKeys, use that for y range.
  // (if user provided a domain, use that instead)
  const yMin =
    domain?.y?.[0] ??
    Math.min(
      ...yKeys.map((key) => {
        return data.reduce((min, curr) => {
          if (typeof curr[key] !== "number") return min;
          return Math.min(min, curr[key] as number);
        }, Infinity);
      }),
    );
  const yMax =
    domain?.y?.[1] ??
    Math.max(
      ...yKeys.map((key) => {
        return data.reduce((max, curr) => {
          if (typeof curr[key] !== "number") return max;
          return Math.max(max, curr[key] as number);
        }, -Infinity);
      }),
    );

  // Set up our y-output data structure
  const y = yKeys.reduce(
    (acc, k) => {
      acc[k] = { i: [], o: [] };
      return acc;
    },
    {} as TransformedData<RawData, XK, YK>["y"],
  );

  // Set up our y-scale, notice how domain is "flipped" because
  //  we're moving from cartesian to canvas coordinates
  const yScaleDomain = [yMax, yMin] as [number, number];
  const fontHeight = axisOptions?.font?.getSize?.() ?? 0;
  // Our yScaleRange is impacted by our grid options
  const yScaleRange: [number, number] = (() => {
    const xTickCount =
      (typeof axisOptions?.tickCount === "number"
        ? axisOptions?.tickCount
        : axisOptions?.tickCount?.x) ?? 0;
    const yLabelPosition =
      typeof axisOptions?.labelPosition === "string"
        ? axisOptions.labelPosition
        : axisOptions?.labelPosition?.x;
    const xAxisSide = axisOptions?.axisSide?.x;
    const yLabelOffset =
      (typeof axisOptions?.labelOffset === "number"
        ? axisOptions.labelOffset
        : axisOptions?.labelOffset?.y) ?? 0;
    // bottom, outset
    if (xAxisSide === "bottom" && yLabelPosition === "outset") {
      return [
        outputWindow.yMin,
        outputWindow.yMax +
          (xTickCount > 0 ? -fontHeight - yLabelOffset * 2 : 0),
      ];
    }
    // Top outset
    if (xAxisSide === "top" && yLabelPosition === "outset") {
      return [
        outputWindow.yMin +
          (xTickCount > 0 ? fontHeight + yLabelOffset * 2 : 0),
        outputWindow.yMax,
      ];
    }
    // Inset labels don't need added offsets
    return [outputWindow.yMin, outputWindow.yMax];
  })();

  const yScale = makeScale({
    inputBounds: yScaleDomain,
    outputBounds: yScaleRange,
    // If user provided a domain, don't modify it
    isNice: domain?.y?.[1] ? false : true,
    padEnd:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.bottom,
    padStart:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.top,
  });

  yKeys.forEach((yKey) => {
    y[yKey].i = data.map((datum) => datum[yKey] as MaybeNumber);
    y[yKey].o = data.map(
      (datum) =>
        (typeof datum[yKey] === "number"
          ? yScale(datum[yKey] as number)
          : datum[yKey]) as MaybeNumber,
    );
  });

  // Measure our top-most y-label if we have grid options so we can
  //  compensate for it in our x-scale.
  const topYLabel =
    axisOptions?.formatYLabel?.(yScale.domain().at(0) as RawData[YK]) ||
    String(yScale.domain().at(0));

  // Generate our x-scale
  const ixMin = asNumber(domain?.x?.[0] ?? ixNum.at(0)),
    ixMax = asNumber(domain?.x?.[1] ?? ixNum.at(-1));
  const topYLabelWidth = axisOptions?.font?.getTextWidth(topYLabel) ?? 0;
  // Determine our x-output range based on yAxis/label options
  const oRange: [number, number] = (() => {
    const yTickCount =
      (typeof axisOptions?.tickCount === "number"
        ? axisOptions?.tickCount
        : axisOptions?.tickCount?.y) ?? 0;
    const yLabelPosition =
      typeof axisOptions?.labelPosition === "string"
        ? axisOptions.labelPosition
        : axisOptions?.labelPosition?.y;
    const yAxisSide = axisOptions?.axisSide?.y;
    const yLabelOffset =
      (typeof axisOptions?.labelOffset === "number"
        ? axisOptions.labelOffset
        : axisOptions?.labelOffset?.y) ?? 0;

    // Left axes, outset label
    if (yAxisSide === "left" && yLabelPosition === "outset") {
      return [
        outputWindow.xMin +
          (yTickCount > 0 ? topYLabelWidth + yLabelOffset : 0),
        outputWindow.xMax,
      ];
    }
    // Right axes, outset label
    if (yAxisSide === "right" && yLabelPosition === "outset") {
      return [
        outputWindow.xMin,
        outputWindow.xMax +
          (yTickCount > 0 ? -topYLabelWidth - yLabelOffset : 0),
      ];
    }
    // Inset labels don't need added offsets
    return [outputWindow.xMin, outputWindow.xMax];
  })();

  const xScale = makeScale({
    inputBounds: [ixMin, ixMax],
    outputBounds: oRange,
    padStart:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.left,
    padEnd:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.right,
  });
  const ox = ixNum.map((x) => xScale(x)!);

  return {
    ix,
    ox,
    y,
    xScale,
    yScale,
    isNumericalData,
  };
};
