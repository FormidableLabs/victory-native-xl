import type { SkFont } from "@shopify/react-native-skia";
import type {
  InputDatum,
  PrimitiveViewWindow,
  ScaleType,
  TransformedData,
} from "../types";
import { scaleBand, type ScaleLinear, scaleLinear, scaleLog } from "d3-scale";

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
  const ix = data.map((datum) => datum[xKey]);

  const yMin = Math.min(
    ...yKeys.map((key) => Math.min(...data.map((datum) => datum[key]))),
  );
  const yMax = Math.max(
    ...yKeys.map((key) => Math.max(...data.map((datum) => datum[key]))),
  );

  const xMinGridCompensation =
    (gridOptions?.font?.getTextWidth(gridOptions.formatYLabel?.(yMax) ?? "") ??
      0) + (gridOptions?.labelOffset ?? 0);

  const ixMin = ix.at(0),
    ixMax = ix.at(-1),
    oRange = [outputWindow.xMin + xMinGridCompensation, outputWindow.xMax];

  // TODO: Types...
  const xScale =
    xScaleType === "linear"
      ? scaleLinear().domain([ixMin, ixMax]).range(oRange)
      : xScaleType === "log"
      ? scaleLog().domain([ixMin, ixMax]).range(oRange)
      : scaleBand().domain(ix).range(oRange);
  const ox = ix.map((x) => xScale(x));

  const y = yKeys.reduce(
    (acc, k) => {
      acc[k] = { i: [], o: [] };
      return acc;
    },
    {} as TransformedData<T, XK, YK>["y"],
  );

  const yMaxGridCompensation =
    -(gridOptions?.font?.getSize?.() ?? 0) -
    (gridOptions?.labelOffset ?? 0) * 2;

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

  return {
    ix,
    ox,
    y,
    xScale,
    yScale,
  };
};
