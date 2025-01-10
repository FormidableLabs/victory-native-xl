import { type ScaleLinear } from "d3-scale";
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
import { makeScale } from "./makeScale";
import { getOffsetFromAngle } from "lib/src/utils/getOffsetFromAngle";

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

      // bottom, outset
      if (xAxisSide === "bottom" && xLabelPosition === "outset") {
        return [
          outputWindow.yMin,
          outputWindow.yMax +
            (xTickCount > 0 ? -fontHeight - yLabelOffset * 2 : 0),
        ];
      }
      // Top outset
      if (xAxisSide === "top" && xLabelPosition === "outset") {
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
      // Reverse viewport y values since canvas coordinates increase downward
      viewport: viewport?.y ? [viewport.y[1], viewport.y[0]] : yScaleDomain,
      isNice: true,
      padEnd:
        typeof domainPadding === "number"
          ? domainPadding
          : domainPadding?.bottom,
      padStart:
        typeof domainPadding === "number" ? domainPadding : domainPadding?.top,
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
      if (yAxisSide === "left" && yLabelPosition === "outset") {
        xMinAdjustment += yTickCount > 0 ? labelWidth + yLabelOffset : 0;
      } else if (yAxisSide === "right" && yLabelPosition === "outset") {
        xMaxAdjustment += yTickCount > 0 ? -labelWidth - yLabelOffset : 0;
      }
    });

    // Return the adjusted output range
    return [
      outputWindow.xMin + xMinAdjustment,
      outputWindow.xMax + xMaxAdjustment,
    ];
  })();

  const xTickValues = xAxis?.tickValues;

  // The user can specify either:
  // custom X tick values

  // OR
  // custom X tick count
  const xTicks = xAxis?.tickCount;
  // x tick domain of [number, number]
  const tickDomainsX = getDomainFromTicks(xTickValues);

  // Input x is just extracting the xKey from each datum
  const ix = data.map((datum) => datum[xKey]) as InputFields<RawData>[XK][];
  const ixNum = ix.map((val, i) => (isNumericalData ? (val as number) : i));

  // Generate our x-scale
  // If user provides a domain, use that as our min / max
  // Else if, tickValues are provided, we use that instead
  // Else, we find min / max of y values across all yKeys, and use that for y range instead.
  const ixMin = asNumber(domain?.x?.[0] ?? tickDomainsX?.[0] ?? ixNum.at(0)),
    ixMax = asNumber(domain?.x?.[1] ?? tickDomainsX?.[1] ?? ixNum.at(-1));

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
  });

  // Normalize xTicks values either via the d3 scaleLinear ticks() function or our custom downSample function
  // For consistency we do it here, so we have both y and x ticks to pass to the axis generator
  const xTicksNormalized = xTickValues
    ? downsampleTicks(xTickValues, xTicks)
    : xScale.ticks(xTicks);

  /** DONE ---- TODO: If rotated, rescale yAxesTransformed[0].yScale output range HERE based on derived maxXLabel value */
  /** TODO: dynamically calclate "shift by" number based on sin/cos/tan * maxXLabel */
  /** TODO: check how Victory web handles origin rotation */

  // If labelRotate is true, dynamically adjust yScale range to accommodate the maximum label width
  if (labelRotate) {
    const maxXLabel = Math.max(
      ...xTicksNormalized.map(
        (xTick) =>
          xAxis?.font
            ?.getGlyphWidths?.(
              xAxis.font.getGlyphIDs(
                xAxis?.formatXLabel?.(xTick as never) || String(xTick),
              ),
            )
            .reduce((sum, value) => sum + value, 0) ?? 0,
      ),
    );

    // First, we pass labelRotate as radian to Math.sin to get labelOffset multiplier based on maxLabel width
    // We then use this multiplier to calculate labelOffset for rotated labels
    const rotateLabelOffset = Math.abs(
      maxXLabel * getOffsetFromAngle(labelRotate),
    );

    const yScaleRange0 = yAxesTransformed[0]?.yScale.range().at(0) as number;
    const yScaleRange1 = yAxesTransformed[0]?.yScale.range().at(-1) as number;

    // bottom, outset
    if (xAxis?.axisSide === "bottom" && xAxis?.labelPosition === "outset") {
      yAxesTransformed[0]?.yScale.range([
        yScaleRange0,
        yScaleRange1 - rotateLabelOffset,
      ]);
    }

    // top, outset
    if (xAxis?.axisSide === "top" && xAxis?.labelPosition === "outset") {
      yAxesTransformed[0]?.yScale.range([
        yScaleRange0 + rotateLabelOffset,
        yScaleRange1,
      ]);
    }
  }

  const ox = ixNum.map((x) => xScale(x)!);

  return {
    ix,
    y,
    isNumericalData,
    ox,
    xScale,
    xTicksNormalized,
    // conform to type NonEmptyArray<T>
    yAxes: [yAxesTransformed[0]!, ...yAxesTransformed.slice(1)],
  };
};
