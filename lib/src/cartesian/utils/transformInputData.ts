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
  AxisScales,
} from "../../types";
import {
  getAxisLabelLayout,
  getMaxAxisLabelLayout,
} from "./getAxisLabelLayout";
import { getAxisTitleLayout } from "./getAxisTitleLayout";
import { getXScaleInputBounds } from "./getXScaleInputBounds";
import { getXAxisTicks } from "./getXAxisTicks";
import { getYScaleInputBounds } from "./getYScaleInputBounds";
import { getYScaleDomain } from "./getYScaleDomain";
import { makeScale } from "./makeScale";

const getYOutputValue = (
  value: MaybeNumber,
  yScale: ScaleLinear<number, number>,
  yAxisScale: AxisScales["yAxisScale"],
): MaybeNumber => {
  if (typeof value !== "number") return value;
  if (yAxisScale === "log" && value <= 0) return null;

  const output = yScale(value);
  return Number.isFinite(output) ? output : null;
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
  axisScales?: AxisScales;
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

  const xInputBounds = getXScaleInputBounds({
    isNumericalData,
    ixNum,
    domain: domain?.x,
    tickDomain: tickDomainsX,
  });

  const xTempScale = makeScale({
    inputBounds: xInputBounds,
    outputBounds: [0, rawChartWidth],
    axisScale: xAxisScale,
  });

  const xTicksForLabelLayout = getXAxisTicks({
    isNumericalData,
    ix,
    tickCount: xTicks,
    tickValues: xTickValues,
    xScale: xTempScale,
  });
  const xAxisLabelLayouts = xTicksForLabelLayout.map((xTick, index) => {
    const labelInput = (
      isNumericalData ? xTick : ix[xTick]
    ) as InputFields<RawData>[XK];
    const labelValue = xAxis.formatXLabel
      ? xAxis.formatXLabel(
          labelInput as unknown as Parameters<typeof xAxis.formatXLabel>[0],
        )
      : String(labelInput ?? xTick);
    return getAxisLabelLayout({
      axis: "x",
      orientation: "vertical",
      value: labelInput,
      text: String(labelValue),
      index,
      font: xAxis.font,
      labelRenderer: xAxis.labelRenderer,
    });
  });
  const maxXLabelLayout = getMaxAxisLabelLayout(xAxisLabelLayouts);
  const xAxisTitleLayout = getAxisTitleLayout({
    title: xAxis.title,
    font: xAxis.font,
  });
  const xAxisTitleOutset = xAxisTitleLayout.hasContent
    ? xAxisTitleLayout.height + xAxisTitleLayout.offset
    : 0;

  // workt with adjustedoutputwindow isntead of directly
  // working with outpuwidnow
  const adjustedOutputWindow = { ...outputWindow };

  if (labelRotate && xAxis.labelPosition === "outset") {
    const rotateOffset = Math.abs(
      maxXLabelLayout.width * getOffsetFromAngle(labelRotate),
    );
    if (xAxis.axisSide === "bottom") {
      adjustedOutputWindow.yMax -= rotateOffset;
    } else if (xAxis.axisSide === "top") {
      adjustedOutputWindow.yMin += rotateOffset;
    }
  }
  // 1. Set up our y axes first...
  // Transform data for each y-axis configuration
  const yAxesTransformed = (yAxes ?? [{}])?.map((yAxis) => {
    const yTickValues = yAxis.tickValues;
    const yTicks = yAxis.tickCount;
    const tickDomainsY = yAxis.domain
      ? yAxis.domain
      : getDomainFromTicks(yAxis.tickValues);

    const yKeysForAxis = yAxis.yKeys ?? yKeys;
    const { yMin, yMax } = getYScaleInputBounds({
      data,
      yKeys: yKeysForAxis as string[],
      domain: domain?.y,
      tickDomain: tickDomainsY,
    });
    const yScaleDomain = getYScaleDomain({ yMin, yMax, yAxisScale });

    const yScaleRange: [number, number] = (() => {
      const xTickCount = xAxis?.tickCount ?? 0;
      const xLabelOffset = xAxis?.labelOffset ?? 0;
      const xAxisSide = xAxis?.axisSide;
      const xLabelPosition = xAxis?.labelPosition;
      const xLabelOutset =
        xTickCount > 0 && maxXLabelLayout.width > 0
          ? maxXLabelLayout.height + xLabelOffset * 2
          : 0;
      const xAxisOutset =
        xAxisTitleOutset + (xLabelPosition === "outset" ? xLabelOutset : 0);

      if (xAxisSide === "bottom") {
        return [
          adjustedOutputWindow.yMin,
          adjustedOutputWindow.yMax - xAxisOutset,
        ];
      }
      if (xAxisSide === "top") {
        return [
          adjustedOutputWindow.yMin + xAxisOutset,
          adjustedOutputWindow.yMax,
        ];
      }

      return [adjustedOutputWindow.yMin, adjustedOutputWindow.yMax];
    })();

    const yScale = makeScale({
      inputBounds: yScaleDomain,
      outputBounds: yScaleRange,
      // Reverse viewport y values since canvas coordinates increase downward
      viewport: viewport?.y ? [viewport.y[1], viewport.y[0]] : undefined,
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
            getYOutputValue(datum[key] as MaybeNumber, yScale, yAxisScale),
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
        y[yKey].o = data.map((datum) =>
          getYOutputValue(datum[yKey] as MaybeNumber, yScale, yAxisScale),
        );
      }
    });

    const yAxisLabelLayouts = yTicksNormalized.map((yTick, index) => {
      const labelInput = yTick as RawData[YK];
      const label = yAxis?.formatYLabel?.(labelInput) ?? String(yTick);
      return getAxisLabelLayout({
        axis: "y",
        orientation: "vertical",
        value: labelInput,
        text: String(label),
        index,
        font: yAxis.font,
        labelRenderer: yAxis.labelRenderer,
      });
    });
    const maxYLabel = getMaxAxisLabelLayout(yAxisLabelLayouts).width;
    const yAxisTitleLayout = getAxisTitleLayout({
      title: yAxis.title,
      font: yAxis.font,
    });
    const yAxisTitleOutset = yAxisTitleLayout.hasContent
      ? yAxisTitleLayout.height + yAxisTitleLayout.offset
      : 0;

    return {
      yScale,
      yTicksNormalized,
      yData,
      maxYLabel,
      yAxisTitleOutset,
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
      const yAxisTitleOutset = yAxesTransformed[index]?.yAxisTitleOutset ?? 0;

      // Adjust xMin or xMax based on the axis side and label position
      // make ajdustments  for label rotation here
      if (yAxisSide === "left") {
        xMinAdjustment += yAxisTitleOutset;
        if (yLabelPosition === "outset") {
          xMinAdjustment +=
            yTickCount > 0 && labelWidth > 0 ? labelWidth + yLabelOffset : 0;
        }
      } else if (yAxisSide === "right") {
        xMaxAdjustment -= yAxisTitleOutset;
        if (yLabelPosition === "outset") {
          xMaxAdjustment +=
            yTickCount > 0 && labelWidth > 0 ? -labelWidth - yLabelOffset : 0;
        }
      }
    });

    // Return the adjusted output range
    return [
      adjustedOutputWindow.xMin + xMinAdjustment,
      adjustedOutputWindow.xMax + xMaxAdjustment,
    ];
  })();

  const xScale = makeScale({
    // if single data point, manually add upper & lower bounds so chart renders properly
    inputBounds: xInputBounds,
    outputBounds: oRange,
    viewport: viewport?.x,
    padStart:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.left,
    padEnd:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.right,
    axisScale: xAxisScale,
  });

  // Normalize xTicks values either via the d3 scaleLinear ticks() function or our custom downSample function
  // For consistency we do it here, so we have both y and x ticks to pass to the axis generator
  const finalXTicksNormalized = getXAxisTicks({
    isNumericalData,
    ix,
    tickCount: xTicks,
    tickValues: xTickValues,
    xScale,
  });

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
