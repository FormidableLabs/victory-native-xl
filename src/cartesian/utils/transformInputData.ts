import { type ScaleLinear } from "d3-scale";
import {
  DEFAULT_TICK_COUNT,
  downsampleTicks,
  getDomainFromTicks,
} from "../../utils/tickHelpers";
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
  xTickLabelsNormalized;
} => {
  const xTickLabelsNormalized: axisOptions?.xTickLabelsNormalized;

  const data = [..._data];
  const tickValues = axisOptions?.tickValues;
  const tickCount = axisOptions?.tickCount ?? DEFAULT_TICK_COUNT;

  const xTickValues =
    tickValues && typeof tickValues === "object" && "x" in tickValues
      ? tickValues.x
      : tickValues;
  const yTickValues =
    tickValues && typeof tickValues === "object" && "y" in tickValues
      ? tickValues.y
      : tickValues;
  const xTicks = typeof tickCount === "number" ? tickCount : tickCount.x;
  const yTicks = typeof tickCount === "number" ? tickCount : tickCount.y;

  console.log(`xTickValues prior to getDomain:: ${xTickValues}`);
  console.log(`yTickValues prior to getDomain: ${yTickValues}`);

  const tickDomainsX = getDomainFromTicks(xTickValues);
  const tickDomainsY = getDomainFromTicks(yTickValues);

  console.log(`xTickDomain: ${xTickValues}`);
  console.log(`tickDomainsX: ${tickDomainsX}`);

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

  // If user provides a domain, use that as our min / max
  // Else if, tickValues are provided, we use that instead
  // Else, we find min / max of y values across all yKeys, and use that for y range instead.
  const yMin =
    domain?.y?.[0] ??
    tickDomainsY?.[0] ??
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
    tickDomainsY?.[1] ??
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
  // Also, if single data point, manually add upper & lower bounds so chart renders properly
  const yScaleDomain = (
    yMax === yMin ? [yMax + 1, yMin - 1] : [yMax, yMin]
  ) as [number, number];
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
    isNice: true,
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

  // Normalize yTicks values either via the d3 scaleLinear ticks() function or our custom downSample function
  // Awkward doing this in the transformInputData function but must be done due to x-scale needing this data
  const yTicksNormalized = yTickValues
    ? downsampleTicks(yTickValues, yTicks)
    : yScale.ticks(yTicks);
  // Calculate all yTicks we're displaying, so we can properly compensate for it in our x-scale
  const maxYLabel = Math.max(
    ...yTicksNormalized.map(
      (yTick) =>
        axisOptions?.font
          ?.getGlyphWidths?.(
            axisOptions.font.getGlyphIDs(
              axisOptions?.formatYLabel?.(yTick as RawData[YK]) ||
                String(yTick),
            ),
          )
          .reduce((sum, value) => sum + value, 0) ?? 0,
    ),
  );

  // Generate our x-scale
  // If user provides a domain, use that as our min / max
  // Else if, tickValues are provided, we use that instead
  // Else, we find min / max of y values across all yKeys, and use that for y range instead.
  const ixMin = asNumber(domain?.x?.[0] ?? tickDomainsX?.[0] ?? ixNum.at(0)),
    ixMax = asNumber(domain?.x?.[1] ?? tickDomainsX?.[1] ?? ixNum.at(-1));
  const topYLabelWidth = maxYLabel;
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
    // if single data point, manually add upper & lower bounds so chart renders properly
    inputBounds: ixMin === ixMax ? [ixMin - 1, ixMax + 1] : [ixMin, ixMax],
    outputBounds: oRange,
    padStart:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.left,
    padEnd:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.right,
  });

  // Normalize xTicks values either via the d3 scaleLinear ticks() function or our custom downSample function
  // For consistency we do it here, so we have both y and x ticks to pass to the axis generator
  //  const xTicksNormalized = xTickValues

  const xTicksNormalized = xTickValues
    ? downsampleTicks(axisOptions.xTickValues, xTicks)
    : xScale.ticks(xTicks);

  const xTickLabels = xTickValues
    ? (downsampleTicks(axisOptions.xTickLabels, xTicks) as string[])
    : [];

  const ox = ixNum.map((x) => xScale(x)!);

  return {
    ix,
    ox,
    y,
    xScale,
    yScale,
    isNumericalData,
    xTickLabelsNormalized,
    xTicksNormalized,
    yTicksNormalized,
  };
};
