import * as React from "react";
import { type LayoutChangeEvent } from "react-native";
import { Canvas, Group, rect } from "@shopify/react-native-skia";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import type {
  AxisProps,
  CartesianChartRenderArg,
  GridProps,
  NumericalFields,
  SidedNumber,
  TransformedData,
} from "../types";
import { transformInputData } from "./utils/transformInputData";
import { findClosestPoint } from "../utils/findClosestPoint";
import { valueFromSidedNumber } from "../utils/valueFromSidedNumber";
import { CartesianAxis } from "./components/CartesianAxis";
import { CartesianGrid } from "./components/CartesianGrid";
import { asNumber } from "../utils/asNumber";
import type { CurveType } from "./utils/curves";
import type { ChartPressValue } from "./hooks/useChartPressSharedValue";

type CartesianChartProps<
  RawData extends Record<string, unknown>,
  T extends NumericalFields<RawData>,
  XK extends keyof T,
  YK extends keyof T,
> = {
  data: RawData[];
  xKey: XK;
  yKeys: YK[];
  curve: CurveType | { [K in YK]: CurveType };
  padding?: SidedNumber;
  domainPadding?: SidedNumber;
  domain?: { x?: [number] | [number, number]; y?: [number] | [number, number] };
  isPressEnabled?: boolean;
  onPressActiveStart?: () => void;
  onPressActiveEnd?: () => void;
  onPressActiveChange?: (isPressActive: boolean) => void;
  onPressValueChange?: (args: {
    x: { value: number; position: number };
    y: { [K in YK]: { value: number; position: number } };
  }) => void;
  activePressSharedValue?: ChartPressValue<YK & string>;
  children: (args: CartesianChartRenderArg<RawData, T, YK>) => React.ReactNode;
  renderOutside: (
    args: CartesianChartRenderArg<RawData, T, YK>,
  ) => React.ReactNode;
  /** Grid props */
  gridOptions?: Partial<Omit<GridProps, "xScale" | "yScale">>;
  axisOptions?: Partial<
    Omit<AxisProps<RawData, T, XK, YK>, "xScale" | "yScale">
  >;
};

export function CartesianChart<
  RawData extends Record<string, unknown>,
  T extends NumericalFields<RawData>,
  XK extends keyof T,
  YK extends keyof T,
>({
  data,
  xKey,
  yKeys,
  padding,
  domainPadding,
  isPressEnabled,
  onPressActiveChange,
  onPressValueChange,
  onPressActiveStart,
  onPressActiveEnd,
  children,
  renderOutside,
  gridOptions,
  axisOptions,
  domain,
  activePressSharedValue,
}: CartesianChartProps<RawData, T, XK, YK>) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const [hasMeasuredLayoutSize, setHasMeasuredLayoutSize] =
    React.useState(false);
  const onLayout = React.useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setHasMeasuredLayoutSize(true);
      setSize(layout);
    },
    [],
  );

  const tData = useSharedValue<TransformedData<RawData, T, YK>>({
    ix: [],
    ox: [],
    y: yKeys.reduce(
      (acc, key) => {
        acc[key] = { i: [], o: [] };
        return acc;
      },
      {} as TransformedData<RawData, T, YK>["y"],
    ),
  });

  const { xScale, yScale, chartBounds, _tData } = React.useMemo(() => {
    const { xScale, yScale, ..._tData } = transformInputData({
      data,
      xKey,
      yKeys,
      axisOptions: Object.assign({}, CartesianAxis.defaultProps, axisOptions),
      outputWindow: {
        xMin: valueFromSidedNumber(padding, "left"),
        xMax: size.width - valueFromSidedNumber(padding, "right"),
        yMin: valueFromSidedNumber(padding, "top"),
        yMax: size.height - valueFromSidedNumber(padding, "bottom"),
      },
      domain,
      domainPadding,
    });
    tData.value = _tData;

    const chartBounds = {
      left: xScale(xScale.domain().at(0) || 0),
      right: xScale(xScale.domain().at(-1) || 0),
      top: yScale(yScale.domain().at(0) || 0),
      bottom: yScale(yScale.domain().at(-1) || 0),
    };

    return { tData, xScale, yScale, chartBounds, _tData };
  }, [
    data,
    xKey,
    yKeys,
    axisOptions,
    padding,
    size.width,
    size.height,
    domain,
    domainPadding,
    tData,
  ]);

  const [isPressActive, setIsPressActive] = React.useState(false);
  const changePressActive = React.useCallback(
    (val: boolean) => {
      setIsPressActive(val);
      onPressActiveChange?.(val);
    },
    [onPressActiveChange],
  );

  /**
   * Pan gesture handling
   */
  const lastIdx = useSharedValue(null as null | number);
  const handleTouch = (x: number) => {
    "worklet";
    const idx = findClosestPoint(tData.value.ox, x);
    if (typeof idx !== "number") return;

    const isInYs = (yk: string): yk is YK & string => yKeys.includes(yk as YK);
    // Shared value
    if (activePressSharedValue) {
      try {
        activePressSharedValue.x.value.value = asNumber(tData.value.ix[idx]);
        activePressSharedValue.x.position.value = asNumber(tData.value.ox[idx]);
        for (const yk in activePressSharedValue.y) {
          if (isInYs(yk)) {
            activePressSharedValue.y[yk].value.value = asNumber(
              tData.value.y[yk].i[idx],
            );
            activePressSharedValue.y[yk].position.value = asNumber(
              tData.value.y[yk].o[idx],
            );
          }
        }
      } catch {
        // no-op
      }
    }

    // JS-thread callback
    onPressValueChange &&
      lastIdx.value !== idx &&
      runOnJS(onPressValueChange)({
        x: {
          value: asNumber(tData.value.ix[idx]),
          position: asNumber(tData.value.ox[idx]),
        },
        y: yKeys.reduce(
          (acc, key) => {
            acc[key] = {
              value: asNumber(tData.value.y[key].i[idx]),
              position: asNumber(tData.value.y[key].o[idx]),
            };
            return acc;
          },
          {} as { [K in YK]: { value: number; position: number } },
        ),
      });

    lastIdx.value = idx;
  };
  const pan = Gesture.Pan()
    .onStart((evt) => {
      onPressActiveStart && runOnJS(onPressActiveStart)();
      runOnJS(changePressActive)(true);
      handleTouch(evt.x);
    })
    .onUpdate((evt) => {
      handleTouch(evt.x);
    })
    .onEnd(() => {
      onPressActiveEnd && runOnJS(onPressActiveEnd)();
      runOnJS(changePressActive)(false);
    })
    .activateAfterLongPress(100);

  /**
   * Allow end-user to request "raw-ish" data for a given yKey.
   * Generate this on demand using a proxy.
   */
  type PointsArg = CartesianChartRenderArg<RawData, T, YK>["points"];
  const points = React.useMemo<PointsArg>(() => {
    const cache = {} as Record<YK, PointsArg[keyof PointsArg]>;
    return new Proxy(
      {},
      {
        get(_, property: string): PointsArg[keyof PointsArg] | undefined {
          const key = property as YK;
          if (!yKeys.includes(key)) return undefined;
          if (cache[key]) return cache[key];

          cache[key] = _tData.ix.map((x, i) => ({
            x: asNumber(_tData.ox[i]),
            xValue: asNumber(x),
            y: asNumber(_tData.y[key].o[i]),
            yValue: asNumber(_tData.y[key].i[i]),
          }));

          return cache[key];
        },
      },
    ) as PointsArg;
  }, [_tData, yKeys]);

  const renderArg: CartesianChartRenderArg<RawData, T, YK> = {
    isPressActive,
    xScale,
    yScale,
    chartBounds,
    canvasSize: size,
    points,
  };
  const clipRect = rect(
    chartBounds.left,
    chartBounds.top,
    chartBounds.right - chartBounds.left,
    chartBounds.bottom - chartBounds.top,
  );

  // Body of the chart.
  const body = (
    <Canvas style={{ flex: 1 }} onLayout={onLayout}>
      {hasMeasuredLayoutSize && (
        <>
          {gridOptions ? (
            <CartesianGrid {...{ ...gridOptions, xScale, yScale }} />
          ) : null}
          {axisOptions ? (
            <CartesianAxis {...{ ...axisOptions, xScale, yScale }} />
          ) : null}
        </>
      )}
      <Group clip={clipRect}>
        {hasMeasuredLayoutSize && children(renderArg)}
      </Group>
      {hasMeasuredLayoutSize && renderOutside?.(renderArg)}
    </Canvas>
  );

  // Conditionally wrap the body in gesture handler based on isPressEnabled
  return isPressEnabled ? (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={pan}>{body}</GestureDetector>
    </GestureHandlerRootView>
  ) : (
    body
  );
}

CartesianChart.defaultProps = {
  isPressEnabled: false,
  curve: "linear",
  chartType: "line",
  xScaleType: "linear",
  yScaleType: "linear",
  renderOutside: () => null,
};
