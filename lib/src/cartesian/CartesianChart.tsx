import * as React from "react";
import { type LayoutChangeEvent } from "react-native";
import { Canvas, Group, rect } from "@shopify/react-native-skia";
import { useSharedValue } from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  type TouchData,
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
  activePressSharedValue?:
    | ChartPressValue<YK & string>
    | ChartPressValue<YK & string>[];
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

  /**
   * Pan gesture handling
   */
  const lastIdx = useSharedValue(null as null | number);
  /**
   * Take a "press value" and an x-value and update the shared values accordingly.
   */
  const handleTouch = (v: ChartPressValue<YK & string>, x: number) => {
    "worklet";
    const idx = findClosestPoint(tData.value.ox, x);
    if (typeof idx !== "number") return;

    const isInYs = (yk: string): yk is YK & string => yKeys.includes(yk as YK);
    // Shared value
    if (v) {
      try {
        v.x.value.value = asNumber(tData.value.ix[idx]);
        v.x.position.value = asNumber(tData.value.ox[idx]);
        for (const yk in v.y) {
          if (isInYs(yk)) {
            v.y[yk].value.value = asNumber(tData.value.y[yk].i[idx]);
            v.y[yk].position.value = asNumber(tData.value.y[yk].o[idx]);
          }
        }
      } catch (err) {
        // no-op
      }
    }

    lastIdx.value = idx;
  };

  /**
   * Touch gesture is a modified Pan gesture handler that allows for multiple presses:
   * - Using Pan Gesture handler effectively _just_ for the .activateAfterLongPress functionality.
   * - Tracking the finger is handled with .onTouchesMove instead of .onUpdate, because
   *    .onTouchesMove gives us access to each individual finger.
   * - The activation gets a bit complicated because we want to wait til "start" state before updating Press Value
   *    which gives time for the gesture to get cancelled before we start updating the shared values.
   *    Therefore we use gestureState.bootstrap to store some "bootstrap" information if gesture isn't active when finger goes down.
   */
  // touch ID -> value index mapping to keep track of which finger updates which value
  const touchMap = useSharedValue({} as Record<number, number | undefined>);
  const activePressSharedValues = Array.isArray(activePressSharedValue)
    ? activePressSharedValue
    : [activePressSharedValue];
  const gestureState = useSharedValue({
    isGestureActive: false,
    bootstrap: [] as [ChartPressValue<YK & string>, TouchData][],
  });

  const touchGesture = Gesture.Pan()
    .manualActivation(true)
    /**
     * When a finger goes down, either update the state or store in the bootstrap array.
     */
    .onTouchesDown((e, manager) => {
      const vals = activePressSharedValues || [];
      if (!vals.length || e.numberOfTouches === 0) return;

      for (let i = 0; i < Math.min(e.allTouches.length, vals.length); i++) {
        const touch = e.allTouches[i];
        const v = vals[i];
        if (!v || !touch) continue;

        if (gestureState.value.isGestureActive) {
          // Update the mapping
          if (typeof touchMap.value[touch.id] !== "number")
            touchMap.value[touch.id] = i;

          v.isActive.value = true;
          handleTouch(v, touch.x);
        } else {
          gestureState.value.bootstrap.push([v, touch]);
        }
      }

      if (gestureState.value.isGestureActive) manager.activate();
    })
    /**
     * On start, check if we have any bootstraped updates we need to apply.
     */
    .onBegin(() => {
      gestureState.value.isGestureActive = true;
      for (let i = 0; i < gestureState.value.bootstrap.length; i++) {
        const [v, touch] = gestureState.value.bootstrap[i]!;
        // Update the mapping
        if (typeof touchMap.value[touch.id] !== "number")
          touchMap.value[touch.id] = i;

        v.isActive.value = true;
        handleTouch(v, touch.x);
      }
    })
    /**
     * Clear gesture state on gesture end.
     */
    .onFinalize(() => {
      gestureState.value.isGestureActive = false;
      gestureState.value.bootstrap = [];
    })
    /**
     * As fingers move, update the shared values accordingly.
     */
    .onTouchesMove((e) => {
      const vals = activePressSharedValues || [];
      if (!vals.length || e.numberOfTouches === 0) return;

      for (let i = 0; i < Math.min(e.allTouches.length, vals.length); i++) {
        const touch = e.allTouches[i];
        const touchId = touch?.id;
        const idx = typeof touchId === "number" && touchMap.value[touchId];
        const v = typeof idx === "number" && vals?.[idx];

        if (!v || !touch) continue;
        if (!v.isActive.value) v.isActive.value = true;
        handleTouch(v, touch.x);
      }
    })
    /**
     * On each finger up, start to update values and "free up" the touch map.
     */
    .onTouchesUp((e, manager) => {
      for (const touch of e.changedTouches) {
        const vals = activePressSharedValues || [];

        // Set active state to false
        const touchId = touch?.id;
        const idx = typeof touchId === "number" && touchMap.value[touchId];
        const val = typeof idx === "number" && vals[idx];
        if (val) {
          val.isActive.value = false;
        }

        // Free up touch map for this touch
        touchMap.value[touch.id] = undefined;
      }

      // All fingers up, end the gesture
      if (e.numberOfTouches === 0) {
        manager.end();
      }
    })
    /**
     * Activate after a long press, which helps with preventing all touch hijacking.
     * This is important if this chart is inside of some sort of scrollable container.
     */
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
      <GestureDetector gesture={touchGesture}>{body}</GestureDetector>
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
