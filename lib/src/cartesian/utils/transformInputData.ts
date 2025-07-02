import { type ScaleLinear } from "d3-scale";
import { getOffsetFromAngle } from "../../utils/getOffsetFromAngle";
import { downsampleTicks, getDomainFromTicks } from "../../utils/tickHelpers";
import type {
  AxisProps,
  NumericalFields,
  PrimitiveViewWindow,
  SidedNumber,
  TransformedData,
  InputFields,
  MaybeNumber,
  NonEmptyArray,
  YAxisPropsWithDefaults,
  XAxisPropsWithDefaults,
} from "../../types";
import { asNumber } from "../../utils/asNumber";
import { makeScale, type AxisScale } from "./makeScale";

export type AxisScaleParam = {
  xAxisScale?: AxisScale;
  yAxisScale?: AxisScale;
};

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
  domain,
  domainPadding,
  xAxis,
  yAxes,
  viewport,
  labelRotate,
  axisScales,
}: {
  data: RawData[];
  xKey: XK;
  yKeys: YK[];
  outputWindow: PrimitiveViewWindow;
  axisOptions?: Partial<
    Omit<AxisProps<RawData, XK, YK>, "xScale" | "yScale">
  >[];
  domain?: { x?: [number] | [number, number]; y?: [number] | [number, number] };
  domainPadding?: SidedNumber;
  xAxis: XAxisPropsWithDefaults<RawData, XK>;
  yAxes: YAxisPropsWithDefaults<RawData, YK>[];
  viewport?: {
    x?: [number, number];
    y?: [number, number];
  };
  labelRotate?: number;
  axisScales?: AxisScaleParam;
}): TransformedData<RawData, XK, YK> & {
  xScale: ScaleLinear<number, number>;
  isNumericalData: boolean;
  xTicksNormalized: number[];
  yAxes: NonEmptyArray<{
    yScale: ScaleLinear<number, number>;
    yTicksNormalized: number[];
    yData: Record<string, { i: MaybeNumber[]; o: MaybeNumber[] }>;
  }>;
} => {
  const data = [..._data];
  const { xAxisScale = "linear", yAxisScale = "linear" } = axisScales || {};

  // Determine if xKey data is numerical
  const isNumericalData = data.every(
    (datum) => typeof datum[xKey as keyof RawData] === "number",
  );
  // and sort if it is
  if (isNumericalData) {
    data.sort((a, b) => +a[xKey as keyof RawData] - +b[xKey as keyof RawData]);
  }
  // // Set up our y-output data structure
  const y = yKeys.reduce(
    (acc, k) => {
      acc[k] = { i: [], o: [] };
      return acc;
    },
    {} as TransformedData<RawData, XK, YK>["y"],
  );

  const rawChartWidth = outputWindow.xMax - outputWindow.xMin;
  const xTickValues = xAxis?.tickValues;
  const xTicks = xAxis?.tickCount;

  const tickDomainsX = getDomainFromTicks(xTickValues);
  const ix = data.map((datum) => datum[xKey]) as InputFields<RawData>[XK][];
  const ixNum = ix.map((val, i) => (isNumericalData ? (val as number) : i));

  // For non‐numeric (ordinal) data, use the index values
  // if user provides a domain- use that as our min/max
  // if tickValues are provided- we use that instead
  // if we find min/max of y values across all yKeys- and use that for yrange instead
  const ixMin = isNumericalData
    ? asNumber(domain?.x?.[0] ?? tickDomainsX?.[0] ?? ixNum.at(0))
    : 0;
  const ixMax = isNumericalData
    ? asNumber(domain?.x?.[1] ?? tickDomainsX?.[1] ?? ixNum.at(-1))
    : ixNum.length - 1;

  const xTempScale = makeScale({
    inputBounds: ixMin === ixMax ? [ixMin - 1, ixMax + 1] : [ixMin, ixMax],
    outputBounds: [0, rawChartWidth],
    axisScale: xAxisScale,
  });

  // normalize xTicks values either via the d3 scaleLinear ticks() function or our custom downSample function
  // 4consistency we do it here- so we have both y and x ticks to pass to the axis generator
  const xTicksNormalized = xTickValues
    ? downsampleTicks(xTickValues, xTicks)
    : xTempScale.ticks(xTicks);

  const maxXLabel = Math.max(
    ...xTicksNormalized.map((xTick) => {
      const labelValue = xAxis.formatXLabel
        ? xAxis.formatXLabel(
            xTick as unknown as Parameters<typeof xAxis.formatXLabel>[0],
          )
        : String(xTick);
      const labelStr = String(labelValue);
      if (!xAxis.font) return 0;
      const glyphIDs = xAxis.font.getGlyphIDs(labelStr);
      const widths = xAxis.font.getGlyphWidths?.(glyphIDs) ?? [];
      return widths.reduce((sum, w) => sum + w, 0);
    }),
  );

  // workt with adjustedoutputwindow isntead of directly
  // working with outpuwidnow
  const adjustedOutputWindow = { ...outputWindow };

  if (labelRotate && xAxis.labelPosition === "outset") {
    const rotateOffset = Math.abs(maxXLabel * getOffsetFromAngle(labelRotate));
    if (xAxis.axisSide === "bottom") {
      adjustedOutputWindow.yMax -= rotateOffset;
    } else if (xAxis.axisSide === "top") {
      adjustedOutputWindow.yMin += rotateOffset;
    }
  }
  // 1. Set up our y axes first...
  // Transform data for each y-axis configuration
  const yAxesTransformed = (yAxes ?? [{}])?.map((yAxis) => {
    const fontHeight = yAxis.font?.getSize?.() ?? 0;

    const yTickValues = yAxis.tickValues;
    const yTicks = yAxis.tickCount;
    const tickDomainsY = yAxis.domain
      ? yAxis.domain
      : getDomainFromTicks(yAxis.tickValues);

    const yKeysForAxis = yAxis.yKeys ?? yKeys;
    const yMin =
      domain?.y?.[0] ??
      tickDomainsY?.[0] ??
      Math.min(
        ...yKeysForAxis.map((key) => {
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
        ...yKeysForAxis.map((key) => {
          return data.reduce((max, curr) => {
            if (typeof curr[key] !== "number") return max;
            return Math.max(max, curr[key] as number);
          }, -Infinity);
        }),
      );
    // Set up our y-scale, notice how domain is "flipped" because
    //  we're moving from cartesian to canvas coordinates
    // Also, if single data point, manually add upper & lower bounds so chart renders properly
    const yScaleDomain = (
      yMax === yMin ? [yMax + 1, yMin - 1] : [yMax, yMin]
    ) as [number, number];

    const yScaleRange: [number, number] = (() => {
      const xTickCount =
        (typeof yAxis?.tickCount === "number"
          ? yAxis?.tickCount
          : xAxis?.tickCount) ?? 0;
      const yLabelOffset = yAxis.labelOffset ?? 0;
      const xAxisSide = xAxis?.axisSide;
      const xLabelPosition = xAxis?.labelPosition;

      if (xAxisSide === "bottom" && xLabelPosition === "outset") {
        return [
          adjustedOutputWindow.yMin,
          adjustedOutputWindow.yMax +
            (xTickCount > 0 ? -fontHeight - yLabelOffset * 2 : 0),
        ];
      }
      if (xAxisSide === "top" && xLabelPosition === "outset") {
        return [
          adjustedOutputWindow.yMin +
            (xTickCount > 0 ? fontHeight + yLabelOffset * 2 : 0),
          adjustedOutputWindow.yMax,
        ];
      }

      return [adjustedOutputWindow.yMin, adjustedOutputWindow.yMax];
    })();

    const yScale = makeScale({
      inputBounds: yScaleDomain,
      outputBounds: yScaleRange,
      // Reverse viewport y values since canvas coordinates increase downward
      viewport: viewport?.y ? [viewport.y[1], viewport.y[0]] : yScaleDomain,
      isNice: true,
      padEnd:
        typeof domainPadding === "number"
          ? domainPadding
          : domainPadding?.bottom,
      padStart:
        typeof domainPadding === "number" ? domainPadding : domainPadding?.top,
      axisScale: yAxisScale,
    });

    const yData = yKeysForAxis.reduce(
      (acc, key) => {
        acc[key] = {
          i: data.map((datum) => datum[key] as MaybeNumber),
          o: data.map((datum) =>
            typeof datum[key] === "number"
              ? yScale(datum[key] as number)
              : (datum[key] as number),
          ),
        };
        return acc;
      },
      {} as Record<string, { i: MaybeNumber[]; o: MaybeNumber[] }>,
    );

    const yTicksNormalized = yTickValues
      ? downsampleTicks(yTickValues, yTicks)
      : yScale.ticks(yTicks);

    yKeys.forEach((yKey) => {
      if (yKeysForAxis.includes(yKey)) {
        y[yKey].i = data.map((datum) => datum[yKey] as MaybeNumber);
        y[yKey].o = data.map(
          (datum) =>
            (typeof datum[yKey] === "number"
              ? yScale(datum[yKey] as number)
              : datum[yKey]) as MaybeNumber,
        );
      }
    });

    const maxYLabel = Math.max(
      ...yTicksNormalized.map(
        (yTick) =>
          yAxis?.font
            ?.getGlyphWidths?.(
              yAxis.font.getGlyphIDs(
                yAxis?.formatYLabel?.(yTick as RawData[YK]) || String(yTick),
              ),
            )
            .reduce((sum, value) => sum + value, 0) ?? 0,
      ),
    );

    return {
      yScale,
      yTicksNormalized,
      yData,
      maxYLabel,
    };
  });

  // 2. Then set up our x axis...
  // Determine the x-output range based on yAxes/label options
  const oRange: [number, number] = (() => {
    let xMinAdjustment = 0;
    let xMaxAdjustment = 0;

    yAxes?.forEach((axis, index) => {
      const yTickCount = axis.tickCount;

      const yLabelPosition = axis.labelPosition;
      const yAxisSide = axis.axisSide;
      const yLabelOffset = axis.labelOffset;

      // Calculate label width for this axis
      const labelWidth = yAxesTransformed[index]?.maxYLabel ?? 0;

      // Adjust xMin or xMax based on the axis side and label position
      // make ajdustments  for label rotation here
      if (yAxisSide === "left" && yLabelPosition === "outset") {
        xMinAdjustment += yTickCount > 0 ? labelWidth + yLabelOffset : 0;
      } else if (yAxisSide === "right" && yLabelPosition === "outset") {
        xMaxAdjustment += yTickCount > 0 ? -labelWidth - yLabelOffset : 0;
      }
    });

    // Return the adjusted output range
    return [
      adjustedOutputWindow.xMin + xMinAdjustment,
      adjustedOutputWindow.xMax + xMaxAdjustment,
    ];
  })();

  const xInputBounds: [number, number] =
    ixMin === ixMax ? [ixMin - 1, ixMax + 1] : [ixMin, ixMax];
  const xScale = makeScale({
    // if single data point, manually add upper & lower bounds so chart renders properly
    inputBounds: xInputBounds,
    outputBounds: oRange,
    viewport: viewport?.x ?? xInputBounds,
    padStart:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.left,
    padEnd:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.right,
    axisScale: xAxisScale,
  });

  // Normalize xTicks values either via the d3 scaleLinear ticks() function or our custom downSample function
  // For consistency we do it here, so we have both y and x ticks to pass to the axis generator
  const finalXTicksNormalized = isNumericalData
    ? xTickValues
      ? downsampleTicks(xTickValues, xTicks)
      : xScale.ticks(xTicks)
    : ixNum;

  const ox = ixNum.map((x) => xScale(x)!);

  return {
    ix,
    y,
    isNumericalData,
    ox,
    xScale,
    xTicksNormalized: finalXTicksNormalized,
    // conform to type NonEmptyArray<T>
    yAxes: [yAxesTransformed[0]!, ...yAxesTransformed.slice(1)],
  };
};
