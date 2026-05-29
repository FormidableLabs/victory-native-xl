import { type ScaleLinear } from "d3-scale";
import { getOffsetFromAngle } from "../../utils/getOffsetFromAngle";
import { downsampleTicks, getDomainFromTicks } from "../../utils/tickHelpers";
import type {
  AxisScales,
  InputFields,
  MaybeNumber,
  NonEmptyArray,
  NumericalFields,
  PrimitiveViewWindow,
  SidedNumber,
  TransformedData,
  XAxisPropsWithDefaults,
  YAxisPropsWithDefaults,
} from "../../types";
import { getTextLayout } from "../../utils/textLayout";
import { getXAxisTicks } from "./getXAxisTicks";
import { getYScaleInputBounds } from "./getYScaleInputBounds";
import { makeScale } from "./makeScale";

export const transformHorizontalInputData = <
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
    maxYLabel: number;
  }>;
} => {
  const data = [..._data];
  const { xAxisScale = "linear" } = axisScales || {};

  const isNumericalData = data.every(
    (datum) => typeof datum[xKey as keyof RawData] === "number",
  );

  if (isNumericalData) {
    data.sort((a, b) => +a[xKey as keyof RawData] - +b[xKey as keyof RawData]);
  }

  const y = yKeys.reduce(
    (acc, k) => {
      acc[k] = { i: [], o: [] };
      return acc;
    },
    {} as TransformedData<RawData, XK, YK>["y"],
  );

  const ix = data.map((datum) => datum[xKey]) as InputFields<RawData>[XK][];
  const categoryIndexes = ix.map((_, index) => index);
  const primaryYAxis = yAxes[0]!;
  const yTickValues = primaryYAxis.tickValues;
  const yTickCount = primaryYAxis.tickCount;
  const yTicksNormalized = yTickValues
    ? downsampleTicks(yTickValues, yTickCount)
    : downsampleTicks(categoryIndexes, yTickCount);

  const maxCategoryLabelLayout = yTicksNormalized.reduce(
    (max, tick) => {
      const categoryValue = ix[tick];
      const labelValue = primaryYAxis.formatYLabel
        ? primaryYAxis.formatYLabel(categoryValue as never)
        : String(categoryValue ?? tick);
      const layout = getTextLayout(String(labelValue), primaryYAxis.font);
      return {
        width: Math.max(max.width, layout.width),
        height: Math.max(max.height, layout.height),
      };
    },
    { width: 0, height: 0 },
  );

  const valueTickValues = xAxis.tickValues;
  const valueTickCount = xAxis.tickCount;
  const tickDomainsX = getDomainFromTicks(valueTickValues);
  const valueInputBounds = getHorizontalValueInputBounds({
    data,
    yKeys: yKeys as string[],
    domain: domain?.x,
    tickDomain: tickDomainsX,
    includeZero: !domain?.x && !tickDomainsX,
  });

  const rawChartWidth = outputWindow.xMax - outputWindow.xMin;
  const xTempScale = makeScale({
    inputBounds: valueInputBounds,
    outputBounds: [0, rawChartWidth],
    axisScale: xAxisScale,
  });

  const xTicksForLabelLayout = getXAxisTicks({
    isNumericalData: true,
    ix: [],
    tickCount: valueTickCount,
    tickValues: valueTickValues,
    xScale: xTempScale,
  });
  const maxXLabelLayout = xTicksForLabelLayout.reduce(
    (max, xTick) => {
      const labelValue = xAxis.formatXLabel
        ? xAxis.formatXLabel(xTick as never)
        : String(xTick);
      const layout = getTextLayout(String(labelValue), xAxis.font);
      return {
        width: Math.max(max.width, layout.width),
        height: Math.max(max.height, layout.height),
      };
    },
    { width: 0, height: 0 },
  );

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

  const xRange: [number, number] = (() => {
    let xMinAdjustment = 0;
    let xMaxAdjustment = 0;

    yAxes.forEach((axis) => {
      const labelWidth = maxCategoryLabelLayout.width;
      if (
        axis.axisSide === "left" &&
        axis.labelPosition === "outset" &&
        axis.tickCount > 0 &&
        labelWidth > 0
      ) {
        xMinAdjustment += labelWidth + axis.labelOffset;
      }
      if (
        axis.axisSide === "right" &&
        axis.labelPosition === "outset" &&
        axis.tickCount > 0 &&
        labelWidth > 0
      ) {
        xMaxAdjustment -= labelWidth + axis.labelOffset;
      }
    });

    return [
      adjustedOutputWindow.xMin + xMinAdjustment,
      adjustedOutputWindow.xMax + xMaxAdjustment,
    ];
  })();

  const categoryRange: [number, number] = (() => {
    const xLabelOffset = xAxis.labelOffset ?? 0;
    const xLabelOutset =
      valueTickCount > 0 && maxXLabelLayout.width > 0
        ? maxXLabelLayout.height + xLabelOffset * 2
        : 0;

    if (xAxis.axisSide === "bottom" && xAxis.labelPosition === "outset") {
      return [
        adjustedOutputWindow.yMin,
        adjustedOutputWindow.yMax - xLabelOutset,
      ];
    }
    if (xAxis.axisSide === "top" && xAxis.labelPosition === "outset") {
      return [
        adjustedOutputWindow.yMin + xLabelOutset,
        adjustedOutputWindow.yMax,
      ];
    }

    return [adjustedOutputWindow.yMin, adjustedOutputWindow.yMax];
  })();

  const xScale = makeScale({
    inputBounds: valueInputBounds,
    outputBounds: xRange,
    viewport: viewport?.x,
    padStart:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.left,
    padEnd:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.right,
    axisScale: xAxisScale,
  });

  const categoryInputBounds = getCategoryInputBounds(categoryIndexes);
  const yScale = makeScale({
    inputBounds: categoryInputBounds,
    outputBounds: categoryRange,
    viewport: viewport?.y,
    padStart:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.top,
    padEnd:
      typeof domainPadding === "number" ? domainPadding : domainPadding?.bottom,
  });

  const yData = yKeys.reduce(
    (acc, key) => {
      acc[key as string] = {
        i: data.map((datum) => datum[key] as MaybeNumber),
        o: data.map((datum) =>
          typeof datum[key] === "number"
            ? xScale(datum[key] as number)
            : (datum[key] as number),
        ),
      };
      return acc;
    },
    {} as Record<string, { i: MaybeNumber[]; o: MaybeNumber[] }>,
  );

  yKeys.forEach((yKey) => {
    y[yKey].i = data.map((datum) => datum[yKey] as MaybeNumber);
    y[yKey].o = data.map(
      (datum) =>
        (typeof datum[yKey] === "number"
          ? xScale(datum[yKey] as number)
          : datum[yKey]) as MaybeNumber,
    );
  });

  const ox = categoryIndexes.map((index) => yScale(index)!);
  const xTicksNormalized = getXAxisTicks({
    isNumericalData: true,
    ix: [],
    tickCount: valueTickCount,
    tickValues: valueTickValues,
    xScale,
  });

  const yAxesTransformed = yAxes.map(() => ({
    yScale,
    yTicksNormalized,
    yData,
    maxYLabel: maxCategoryLabelLayout.width,
  }));

  return {
    ix,
    y,
    isNumericalData,
    ox,
    xScale,
    xTicksNormalized,
    yAxes: [yAxesTransformed[0]!, ...yAxesTransformed.slice(1)],
  };
};

const getCategoryInputBounds = (indexes: number[]): [number, number] => {
  const first = indexes.at(0) ?? 0;
  const last = indexes.at(-1) ?? 0;
  return first === last ? [first - 1, last + 1] : [first, last];
};

const getHorizontalValueInputBounds = ({
  data,
  yKeys,
  domain,
  tickDomain,
  includeZero,
}: {
  data: Record<string, unknown>[];
  yKeys: string[];
  domain?: [number] | [number, number];
  tickDomain?: [number, number];
  includeZero: boolean;
}): [number, number] => {
  const { yMin, yMax } = getYScaleInputBounds({
    data,
    yKeys,
    domain,
    tickDomain,
  });

  if (!Number.isFinite(yMin) || !Number.isFinite(yMax)) {
    return [-1, 1];
  }

  const valueMin = includeZero ? Math.min(0, yMin) : yMin;
  const valueMax = includeZero ? Math.max(0, yMax) : yMax;

  return valueMin === valueMax
    ? [valueMin - 1, valueMax + 1]
    : [valueMin, valueMax];
};
