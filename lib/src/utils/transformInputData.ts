import type {
  InputDatum,
  PrimitiveViewWindow,
  TransformedData,
} from "../types";
import { type ScaleLinear, scaleLinear, type NumberValue } from "d3-scale";

export const transformInputData = <
  T extends InputDatum,
  XK extends keyof T,
  YK extends keyof T,
>({
  data,
  xKey,
  yKeys,
  outputWindow,
}: {
  data: T[];
  xKey: XK;
  yKeys: YK[];
  outputWindow: PrimitiveViewWindow;
}): TransformedData<T, XK, YK> & {
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
} => {
  const ix = data.map((datum) => datum[xKey]);
  const xScale = scaleLinear()
    .domain(<NumberValue[]>[ix.at(0) ?? 0, ix.at(-1) ?? 0])
    .range([outputWindow.xMin, outputWindow.xMax]);
  const ox = ix.map((x) => xScale(<number>x));

  const y = yKeys.reduce(
    (acc, k) => {
      acc[k] = { i: [], o: [] };
      return acc;
    },
    {} as TransformedData<T, XK, YK>["y"],
  );

  // TODO: These ain't right...
  const yMin = Math.min(
    ...yKeys.map((key) => Math.min(...data.map((datum) => <number>datum[key]))),
  );
  const yMax = Math.max(
    ...yKeys.map((key) => Math.max(...data.map((datum) => <number>datum[key]))),
  );
  const yScale = scaleLinear()
    .domain([yMin, yMax])
    .range([outputWindow.yMin, outputWindow.yMax]);

  yKeys.forEach((yKey) => {
    y[yKey].i = data.map((datum) => datum[yKey]);
    y[yKey].o = data.map((datum) => yScale(<number>datum[yKey]));
  });

  return {
    ix,
    ox,
    y,
    xScale,
    yScale,
  };
};
