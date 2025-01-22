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
import { makeScale } from "./makeScale";

interface TransformParams<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
> {
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
  viewport?: { x?: [number, number]; y?: [number, number] };
  labelRotate?: number;
}

type YAxisTransform = {
  yScale: ScaleLinear<number, number>;
  yTicksNormalized: number[];
  yData: Record<string, { i: MaybeNumber[]; o: MaybeNumber[] }>;
  maxYLabel: number;
};

function isAllNumeric<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
>(data: RawData[], xKey: XK): boolean {
  return data.every((datum) => typeof datum[xKey] === "number");
}

function sortByXKeyIfNumeric<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
>(data: RawData[], xKey: XK) {
  data.sort((a, b) => +a[xKey] - +b[xKey]);
}

function computeYDomain<
  RawData extends Record<string, unknown>,
  YK extends keyof NumericalFields<RawData>,
>(
  data: RawData[],
  yKeys: YK[],
  domain?: [number] | [number, number],
): [number, number] {
  // If domain is partially provided (like [number] or no domain?), handle gracefully
  if (domain && domain.length === 2) {
    // fully specified
    return domain as [number, number];
  }

  // Otherwise compute from data
  const dataMin = Math.min(
    ...yKeys.map((key) => {
      return data.reduce((min, curr) => {
        if (typeof curr[key] !== "number") return min;
        return Math.min(min, curr[key] as number);
      }, Infinity);
    }),
  );

  const dataMax = Math.max(
    ...yKeys.map((key) => {
      return data.reduce((max, curr) => {
        if (typeof curr[key] !== "number") return max;
        return Math.max(max, curr[key] as number);
      }, -Infinity);
    }),
  );

  return [dataMin, dataMax];
}

function buildYScaleAndData<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>(params: {
  data: RawData[];
  yAxis: YAxisPropsWithDefaults<RawData, YK>;
  allYKeys: YK[];
  domain?: { y?: [number] | [number, number] };
  xAxis: XAxisPropsWithDefaults<RawData, XK>;
  outputWindow: PrimitiveViewWindow;
  viewport?: { y?: [number, number] };
  domainPadding?: SidedNumber;
}) {
  const {
    data,
    yAxis,
    allYKeys,
    domain,
    xAxis,
    outputWindow,
    viewport,
    domainPadding,
  } = params;

  const fontHeight = yAxis.font?.getSize?.() ?? 0;
  const yKeysForAxis = yAxis.yKeys ?? allYKeys;

  // If user supplied domain or tick-based domain, use that; otherwise compute from data
  const tickDomainsY = yAxis.domain || getDomainFromTicks(yAxis.tickValues);
  const [rawYMin, rawYMax] = computeYDomain(
    data,
    yKeysForAxis,
    tickDomainsY as [number] | [number, number], // might be partial
  );

  const yMin = domain?.y?.[0] ?? rawYMin;
  const yMax = domain?.y?.[1] ?? rawYMax;

  // If single data point, "pad" domain so scale can render properly
  const yScaleDomain: [number, number] =
    yMax === yMin ? [yMax + 1, yMin - 1] : [yMax, yMin]; // flip for canvas coords

  // Decide how to offset the y-scale range depending on the x-axis position
  const yScaleRange: [number, number] = (() => {
    // We might rely on x-axis settings for bottom or top offsets
    const xTickCount =
      typeof yAxis?.tickCount === "number"
        ? yAxis?.tickCount
        : xAxis?.tickCount;
    const yLabelOffset = yAxis.labelOffset ?? 0;

    if (xAxis.axisSide === "bottom" && xAxis.labelPosition === "outset") {
      return [
        outputWindow.yMin,
        outputWindow.yMax + (xTickCount ? -fontHeight - yLabelOffset * 2 : 0),
      ];
    }
    if (xAxis.axisSide === "top" && xAxis.labelPosition === "outset") {
      return [
        outputWindow.yMin + (xTickCount ? fontHeight + yLabelOffset * 2 : 0),
        outputWindow.yMax,
      ];
    }
    // Inset labels (or anything else) => no special offset
    return [outputWindow.yMin, outputWindow.yMax];
  })();

  const yScale = makeScale({
    inputBounds: yScaleDomain,
    outputBounds: yScaleRange,
    // Reverse viewport y values for canvas coordinates
    viewport: viewport?.y ? [viewport.y[1], viewport.y[0]] : yScaleDomain,
    isNice: true,
    padStart:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.top,
    padEnd:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.bottom,
  });

  // Build the final Y-data sets
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

  // Build tick values
  const yTicks = yAxis.tickCount;
  const yTickValues = yAxis.tickValues;
  const yTicksNormalized = yTickValues
    ? downsampleTicks(yTickValues, yTicks)
    : yScale.ticks(yTicks);

  // Calculate the maximum label width so we can later offset X-range if needed
  const maxYLabel = Math.max(
    ...yTicksNormalized.map((yTick) => {
      const labelString = yAxis?.formatYLabel?.(yTick) ?? String(yTick);
      if (
        !yAxis.font ||
        !yAxis.font.getGlyphIDs ||
        !yAxis.font.getGlyphWidths
      ) {
        return 0;
      }
      const glyphIDs = yAxis.font.getGlyphIDs(labelString);
      const widths = yAxis.font.getGlyphWidths(glyphIDs);
      return widths.reduce((sum, w) => sum + w, 0);
    }),
  );

  return {
    yScale,
    yTicksNormalized,
    yData,
    maxYLabel,
  };
}

/**
 * For each Y-axis, we might need to push the X-min or X-max
 * to make room for out-of-bounds Y-labels if they're on the left/right.
 */
function computeXRangeAdjustmentsFromYAxes<
  RawData extends Record<string, unknown>,
  YK extends keyof NumericalFields<RawData>,
>(
  yAxes: YAxisPropsWithDefaults<RawData, YK>[],
  yAxesTransformed: (YAxisTransform | undefined)[],
  outputWindow: PrimitiveViewWindow,
) {
  let xMinAdjustment = 0;
  let xMaxAdjustment = 0;

  yAxes.forEach((axis, index) => {
    const yTickCount = axis.tickCount;
    const { labelPosition, axisSide, labelOffset } = axis;
    const labelWidth = yAxesTransformed[index]?.maxYLabel ?? 0;

    if (axisSide === "left" && labelPosition === "outset") {
      if (yTickCount) {
        xMinAdjustment += labelWidth + (labelOffset ?? 0);
      }
    } else if (axisSide === "right" && labelPosition === "outset") {
      if (yTickCount) {
        xMaxAdjustment -= labelWidth + (labelOffset ?? 0);
      }
    }
  });

  return [
    outputWindow.xMin + xMinAdjustment,
    outputWindow.xMax + xMaxAdjustment,
  ] as [number, number];
}

function buildXScaleAndData<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>(params: {
  data: RawData[];
  xKey: XK;
  isNumericalData: boolean;
  domain?: { x?: [number] | [number, number] };
  xAxis: XAxisPropsWithDefaults<RawData, XK>;
  domainPadding?: SidedNumber;
  viewport?: { x?: [number, number] };
  xRange: [number, number];
}) {
  const {
    data,
    xKey,
    isNumericalData,
    domain,
    xAxis,
    domainPadding,
    viewport,
    xRange,
  } = params;

  // If user provided domain or tick domain, use it. Otherwise derive from data.
  const xTickValues = xAxis?.tickValues;
  const tickDomainsX = getDomainFromTicks(xTickValues);
  const ix = data.map((datum) => datum[xKey]) as InputFields<RawData>[XK][];
  // For categorical data, we treat indexes as numeric
  const ixNum = ix.map((val, i) => (isNumericalData ? (val as number) : i));

  const ixMin = asNumber(domain?.x?.[0] ?? tickDomainsX?.[0] ?? ixNum.at(0));
  const ixMax = asNumber(domain?.x?.[1] ?? tickDomainsX?.[1] ?? ixNum.at(-1));
  const xInputBounds: [number, number] =
    ixMin === ixMax ? [ixMin - 1, ixMax + 1] : [ixMin, ixMax];

  const xScale = makeScale({
    inputBounds: xInputBounds,
    outputBounds: xRange,
    viewport: viewport?.x ?? xInputBounds,
    padStart:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.left,
    padEnd:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.right,
  });

  // If no custom tickValues, generate from scale
  const xTicks = xAxis?.tickCount;
  const xTicksNormalized = xTickValues
    ? downsampleTicks(xTickValues, xTicks)
    : xScale.ticks(xTicks);

  // Build the output coordinates (ox)
  const ox = ixNum.map((val) => xScale(val) ?? NaN);

  return { ix, ox, xScale, xTicksNormalized };
}

function applyLabelRotationAdjustment<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
>(
  labelRotate: number,
  xAxis: XAxisPropsWithDefaults<RawData, XK>,
  xTicksNormalized: number[],
  yAxesTransformed: YAxisTransform[] | undefined,
) {
  if (!xAxis?.axisSide || !xAxis?.labelPosition || !yAxesTransformed?.length) {
    return;
  }
  const primaryYAxis = yAxesTransformed[0];
  if (!primaryYAxis) {
    return;
  }
  // measure the widest X label
  const maxXLabelWidth = Math.max(
    ...xTicksNormalized.map((tick) => {
      if (!xAxis.font?.getGlyphIDs || !xAxis.font?.getGlyphWidths) return 0;
      const labelString = xAxis?.formatXLabel?.(tick as never) ?? String(tick);
      const glyphIDs = xAxis.font.getGlyphIDs(labelString);
      const widths = xAxis.font.getGlyphWidths(glyphIDs);
      return widths.reduce((sum, w) => sum + w, 0);
    }),
  );

  // calculate how far that label extends if we rotate it
  const rotateLabelOffset = Math.abs(
    maxXLabelWidth * getOffsetFromAngle(labelRotate),
  );

  const [range0, range1] = primaryYAxis.yScale.range();
  // bottom, outset
  if (xAxis.axisSide === "bottom" && xAxis.labelPosition === "outset") {
    primaryYAxis.yScale.range([range0!, range1! - rotateLabelOffset]);
  }
  // top, outset
  if (xAxis.axisSide === "top" && xAxis.labelPosition === "outset") {
    primaryYAxis.yScale.range([range0! + rotateLabelOffset, range1!]);
  }
}

/**
 *  Takes raw user input data and transforms it for chart consumption:
 *  {
 *    ix: [...],    // input x values (potentially numeric or categorical indexes)
 *    ox: [...],    // mapped x values in canvas coords
 *    y: {
 *      key1: { i: [...], o: [...] },
 *      key2: { i: [...], o: [...] }
 *    }
 *  }
 *  Also returns xScale, yAxes info, etc.
 */
export function transformInputData<
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
}: TransformParams<RawData, XK, YK>): TransformedData<RawData, XK, YK> & {
  xScale: ScaleLinear<number, number>;
  isNumericalData: boolean;
  xTicksNormalized: number[];
  yAxes: NonEmptyArray<{
    yScale: ScaleLinear<number, number>;
    yTicksNormalized: number[];
    yData: Record<string, { i: MaybeNumber[]; o: MaybeNumber[] }>;
  }>;
} {
  // 1. Copy and check numeric
  const data = [..._data];
  const isNumericalData = isAllNumeric(data, xKey);
  if (isNumericalData) {
    sortByXKeyIfNumeric(data, xKey);
  }

  // 2. Prepare our final y = { yKey: {i: [], o: []}, ... }
  //    We'll fill these arrays as we go along
  const y = yKeys.reduce(
    (acc, k) => {
      acc[k] = { i: [], o: [] };
      return acc;
    },
    {} as TransformedData<RawData, XK, YK>["y"],
  );

  // 3. Build Y-axes transformations
  const yAxesTransformed = yAxes.map((axis) =>
    buildYScaleAndData({
      data,
      yAxis: axis,
      allYKeys: yKeys,
      domain,
      xAxis,
      outputWindow,
      viewport,
      domainPadding,
    }),
  );

  // 4. Copy each axis’s data back into the `y` object for universal access
  yAxesTransformed.forEach((ya, idx) => {
    const axis = yAxes[idx];
    const yKeysForAxis = axis.yKeys ?? yKeys;
    yKeysForAxis.forEach((key) => {
      y[key].i = ya.yData[key].i;
      y[key].o = ya.yData[key].o;
    });
  });

  // 5. Compute any left/right offsets for the x-range
  const xRange = computeXRangeAdjustmentsFromYAxes(
    yAxes,
    yAxesTransformed,
    outputWindow,
  );

  // 6. Build the X-scale and x-data
  const { ix, ox, xScale, xTicksNormalized } = buildXScaleAndData({
    data,
    xKey,
    isNumericalData,
    domain,
    xAxis,
    domainPadding,
    viewport,
    xRange,
  });

  // 7. If we’re rotating X labels, adjust the primary Y-scale range
  //    so they don't overlap.
  if (labelRotate) {
    applyLabelRotationAdjustment(
      labelRotate,
      xAxis,
      xTicksNormalized,
      yAxesTransformed,
    );
  }

  // 8. Return the final data
  return {
    ix,
    y,
    isNumericalData,
    ox,
    xScale,
    xTicksNormalized,
    // “NonEmptyArray”: we cast since we know yAxes is at least one axis
    yAxes: [yAxesTransformed[0]!, ...yAxesTransformed.slice(1)],
  };
}
