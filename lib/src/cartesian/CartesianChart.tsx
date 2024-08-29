import * as React from "react";
import { type LayoutChangeEvent } from "react-native";
import { Canvas, Group, rect, type Color } from "@shopify/react-native-skia";
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
  InputFields,
  NumericalFields,
  SidedNumber,
  TransformedData,
  ChartBounds,
  FrameProps,
  AxisPropWithDefaults,
  OptionalAxisProps,
  YAxisPropsWithDefaults,
  YAxisInputProps,
  XAxisInputProps,
  XAxisPropsWithDefaults,
} from "../types";
import { transformInputData } from "./utils/transformInputData";
import { findClosestPoint } from "../utils/findClosestPoint";
import { valueFromSidedNumber } from "../utils/valueFromSidedNumber";
import { CartesianAxisDefaultProps } from "./components/CartesianAxis";
import { asNumber } from "../utils/asNumber";
import type { ChartPressState } from "./hooks/useChartPressState";
import { useFunctionRef } from "../hooks/useFunctionRef";
import { CartesianChartProvider } from "./contexts/CartesianChartContext";
import { normalizeYAxisTicks } from "../utils/normalizeYAxisTicks";
import { XAxis, XAxisDefaults } from "./components/XAxis";
import { YAxis, YAxisDefaults } from "./components/YAxis";
import { Frame, FrameDefaults } from "./components/Frame";

type CartesianChartProps<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
> = {
  data: RawData[];
  xKey: XK;
  yKeys: YK[];
  padding?: SidedNumber;
  domainPadding?: SidedNumber;
  domain?: { x?: [number] | [number, number]; y?: [number] | [number, number] };
  chartPressState?:
    | ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>
    | ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>[];
  children: (args: CartesianChartRenderArg<RawData, YK>) => React.ReactNode;
  renderOutside?: (
    args: CartesianChartRenderArg<RawData, YK>,
  ) => React.ReactNode;
  axisOptions?: Partial<Omit<AxisProps<RawData, XK, YK>, "xScale" | "yScale">>;

  onChartBoundsChange?: (bounds: ChartBounds) => void;
  gestureLongPressDelay?: number;
  xAxis?: XAxisInputProps<RawData, XK>;
  yAxis?: YAxisInputProps<RawData, YK>[];
  frame?: Omit<FrameProps, "xScale" | "yScale">;
};

export function CartesianChart<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>({
  data,
  xKey,
  yKeys,
  padding,
  domainPadding,
  children,
  renderOutside = () => null,
  axisOptions,
  domain,
  chartPressState,
  onChartBoundsChange,
  gestureLongPressDelay = 100,
  xAxis,
  yAxis,
  frame,
}: CartesianChartProps<RawData, XK, YK>) {
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
  const normalizeAxisProps = React.useMemo(() => {
    // Helper functions to pick only the relevant properties for each prop type
    const pickXAxisProps = (
      axisProp: AxisPropWithDefaults<RawData, XK, YK> &
        OptionalAxisProps<RawData, XK, YK>,
    ): XAxisPropsWithDefaults<RawData, XK> => ({
      axisSide: axisProp.axisSide.x,
      yAxisSide: axisProp.axisSide.y,
      tickCount:
        typeof axisProp.tickCount === "number"
          ? axisProp.tickCount
          : axisProp.tickCount.x,
      tickValues:
        axisProp.tickValues &&
        typeof axisProp.tickValues === "object" &&
        "x" in axisProp.tickValues
          ? axisProp.tickValues.x
          : axisProp.tickValues,
      formatXLabel: axisProp.formatXLabel,
      labelPosition:
        typeof axisProp.labelPosition === "string"
          ? axisProp.labelPosition
          : axisProp.labelPosition.x,
      labelOffset:
        typeof axisProp.labelOffset === "number"
          ? axisProp.labelOffset
          : axisProp.labelOffset.x,
      labelColor:
        typeof axisProp.labelColor === "string"
          ? axisProp.labelColor
          : axisProp.labelColor.x,
      lineWidth:
        typeof axisProp.lineWidth === "object" && "grid" in axisProp.lineWidth
          ? typeof axisProp.lineWidth.grid === "object" &&
            "x" in axisProp.lineWidth.grid
            ? axisProp.lineWidth.grid.x
            : axisProp.lineWidth.grid
          : axisProp.lineWidth,
      lineColor: (typeof axisProp.lineColor === "object" &&
      "grid" in axisProp.lineColor
        ? typeof axisProp.lineColor.grid === "object" &&
          "x" in axisProp.lineColor.grid
          ? axisProp.lineColor.grid.x
          : axisProp.lineColor.grid
        : axisProp.lineColor) as Color,
      font: axisProp.font,
    });

    const pickYAxisProps = (
      axisProp: AxisPropWithDefaults<RawData, XK, YK> &
        OptionalAxisProps<RawData, XK, YK>,
    ): YAxisPropsWithDefaults<RawData, YK> => {
      return {
        axisSide: axisProp.axisSide.y,
        formatYLabel: axisProp.formatYLabel,
        tickValues:
          axisProp.tickValues &&
          typeof axisProp.tickValues === "object" &&
          "y" in axisProp.tickValues
            ? axisProp.tickValues.y
            : axisProp.tickValues,
        tickCount:
          typeof axisProp.tickCount === "number"
            ? axisProp.tickCount
            : axisProp.tickCount.y,
        labelPosition:
          typeof axisProp.labelPosition === "string"
            ? axisProp.labelPosition
            : axisProp.labelPosition.y,
        labelOffset:
          typeof axisProp.labelOffset === "number"
            ? axisProp.labelOffset
            : axisProp.labelOffset.y,
        labelColor:
          typeof axisProp.labelColor === "string"
            ? axisProp.labelColor
            : axisProp.labelColor.y,
        lineWidth:
          typeof axisProp.lineWidth === "object" && "grid" in axisProp.lineWidth
            ? typeof axisProp.lineWidth.grid === "object" &&
              "y" in axisProp.lineWidth.grid
              ? axisProp.lineWidth.grid.y
              : axisProp.lineWidth.grid
            : axisProp.lineWidth,
        lineColor: (typeof axisProp.lineColor === "object" &&
        "grid" in axisProp.lineColor
          ? typeof axisProp.lineColor.grid === "object" &&
            "y" in axisProp.lineColor.grid
            ? axisProp.lineColor.grid.y
            : axisProp.lineColor.grid
          : axisProp.lineColor) as Color,
        font: axisProp.font,
        yKeys: yKeys,
      };
    };

    const pickFrameProps = (
      axisProp: AxisPropWithDefaults<RawData, XK, YK> &
        OptionalAxisProps<RawData, XK, YK>,
    ): Required<CartesianChartProps<RawData, XK, YK>["frame"]> => ({
      lineColor:
        typeof axisProp.lineColor === "object" && "frame" in axisProp.lineColor
          ? axisProp.lineColor.frame
          : axisProp.lineColor,
      lineWidth:
        typeof axisProp.lineWidth === "object" && "frame" in axisProp.lineWidth
          ? axisProp.lineWidth.frame
          : axisProp.lineWidth,
    });

    const defaultAxisOptions: AxisPropWithDefaults<RawData, XK, YK> &
      OptionalAxisProps<RawData, XK, YK> = {
      ...CartesianAxisDefaultProps,
      ...axisOptions,
    };
    const xAxisWithDefaults: XAxisPropsWithDefaults<RawData, XK> = {
      ...XAxisDefaults,
      ...xAxis,
    };
    const yAxisWithDefaults: YAxisPropsWithDefaults<RawData, YK>[] = yAxis
      ? yAxis.map((axis) => ({ ...YAxisDefaults, ...axis }))
      : [{ ...YAxisDefaults, yKeys }];
    const frameWithDefaults = frame
      ? { ...FrameDefaults, frame }
      : FrameDefaults;

    return {
      xAxis: xAxis ? xAxisWithDefaults : pickXAxisProps(defaultAxisOptions),
      yAxes: yAxis ? yAxisWithDefaults : [pickYAxisProps(defaultAxisOptions)],
      frame: frameWithDefaults ?? pickFrameProps(defaultAxisOptions),
    };
  }, [axisOptions, xAxis, yAxis, frame, yKeys]);

  const tData = useSharedValue<TransformedData<RawData, XK, YK>>({
    ix: [],
    ox: [],
    y: yKeys.reduce(
      (acc, key) => {
        acc[key] = { i: [], o: [] };
        return acc;
      },
      {} as TransformedData<RawData, XK, YK>["y"],
    ),
  });

  const { yAxes, xScale, chartBounds, isNumericalData, _tData } =
    React.useMemo(() => {
      const { xScale, yAxes, isNumericalData, xTicksNormalized, ..._tData } =
        transformInputData({
          data,
          xKey,
          yKeys,
          outputWindow: {
            xMin: valueFromSidedNumber(padding, "left"),
            xMax: size.width - valueFromSidedNumber(padding, "right"),
            yMin: valueFromSidedNumber(padding, "top"),
            yMax: size.height - valueFromSidedNumber(padding, "bottom"),
          },
          domain,
          domainPadding,
          xAxis: normalizeAxisProps.xAxis,
          yAxes: normalizeAxisProps.yAxes,
          frame: normalizeAxisProps.frame,
        });
      tData.value = _tData;

      const primaryYAxis = yAxes[0];
      const primaryYScale = primaryYAxis.yScale;
      const chartBounds = {
        left: xScale(xScale.domain().at(0) || 0),
        right: xScale(xScale.domain().at(-1) || 0),
        top: primaryYScale(primaryYScale.domain().at(0) || 0),
        bottom: primaryYScale(primaryYScale.domain().at(-1) || 0),
      };

      return {
        xTicksNormalized,
        yAxes,
        tData,
        xScale,
        chartBounds,
        isNumericalData,
        _tData,
      };
    }, [
      data,
      xKey,
      yKeys,
      padding,
      size.width,
      size.height,
      domain,
      domainPadding,
      tData,
      normalizeAxisProps,
    ]);

  /**
   * Pan gesture handling
   */
  const lastIdx = useSharedValue(null as null | number);
  /**
   * Take a "press value" and an x-value and update the shared values accordingly.
   */
  const handleTouch = (
    v: ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>,
    x: number,
  ) => {
    "worklet";
    const idx = findClosestPoint(tData.value.ox, x);
    if (typeof idx !== "number") return;

    const isInYs = (yk: string): yk is YK & string => yKeys.includes(yk as YK);
    // Shared value
    if (v) {
      try {
        v.x.value.value = tData.value.ix[idx]!;
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
  const activePressSharedValues = Array.isArray(chartPressState)
    ? chartPressState
    : [chartPressState];
  const gestureState = useSharedValue({
    isGestureActive: false,
    bootstrap: [] as [
      ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>,
      TouchData,
    ][],
  });

  const panGesture = Gesture.Pan()
    /**
     * When a finger goes down, either update the state or store in the bootstrap array.
     */
    .onTouchesDown((e) => {
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
    })
    /**
     * On start, check if we have any bootstraped updates we need to apply.
     */
    .onStart(() => {
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
    .onTouchesUp((e) => {
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
    })
    /**
     * Once the gesture ends, ensure all active values are falsified.
     */
    .onEnd(() => {
      const vals = activePressSharedValues || [];
      // Set active state to false for all vals
      for (const val of vals) {
        if (val) {
          val.isActive.value = false;
        }
      }
    })
    /**
     * Activate after a long press, which helps with preventing all touch hijacking.
     * This is important if this chart is inside of some sort of scrollable container.
     */
    .activateAfterLongPress(gestureLongPressDelay);

  /**
   * Allow end-user to request "raw-ish" data for a given yKey.
   * Generate this on demand using a proxy.
   */
  type PointsArg = CartesianChartRenderArg<RawData, YK>["points"];
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
            xValue: x,
            y: _tData.y[key].o[i],
            yValue: _tData.y[key].i[i],
          }));

          return cache[key];
        },
      },
    ) as PointsArg;
  }, [_tData, yKeys]);

  // On bounds change, emit
  const onChartBoundsRef = useFunctionRef(onChartBoundsChange);
  React.useEffect(() => {
    onChartBoundsRef.current?.(chartBounds);
  }, [chartBounds, onChartBoundsRef]);

  const primaryYAxis = yAxes[0];
  const primaryYScale = primaryYAxis.yScale;

  const renderArg: CartesianChartRenderArg<RawData, YK> = {
    xScale,
    yScale: primaryYScale,
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

  const YAxisComponents =
    hasMeasuredLayoutSize && (axisOptions || yAxes)
      ? normalizeAxisProps.yAxes?.map((axis, index) => {
          const yAxis = yAxes[index];

          if (!yAxis) return null;
          return (
            <YAxis
              key={index}
              {...axis}
              xScale={xScale}
              yScale={yAxis.yScale}
              yTicksNormalized={
                // Since we treat the first yAxis as the primary yAxis, we normalize the other Y ticks against it so the ticks line up nicely
                index > 0
                  ? normalizeYAxisTicks(
                      primaryYAxis.yTicksNormalized,
                      primaryYScale,
                      yAxis.yScale,
                    )
                  : yAxis.yTicksNormalized
              }
            />
          );
        })
      : null;
  const XAxisComponents =
    hasMeasuredLayoutSize && (axisOptions || xAxis) ? (
      <XAxis
        {...normalizeAxisProps.xAxis}
        xScale={xScale}
        yScale={primaryYScale}
        ix={_tData.ix}
        isNumericalData={isNumericalData}
      />
    ) : null;

  // Body of the chart.
  const body = (
    <Canvas style={{ flex: 1 }} onLayout={onLayout}>
      {YAxisComponents}
      {XAxisComponents}

      {frame && <Frame {...frame} xScale={xScale} yScale={primaryYScale} />}
      <CartesianChartProvider yScale={primaryYScale} xScale={xScale}>
        <Group clip={clipRect}>
          {hasMeasuredLayoutSize && children(renderArg)}
        </Group>
      </CartesianChartProvider>
      {hasMeasuredLayoutSize && renderOutside?.(renderArg)}
    </Canvas>
  );

  // Conditionally wrap the body in gesture handler based on activePressSharedValue
  return chartPressState ? (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={panGesture}>{body}</GestureDetector>
    </GestureHandlerRootView>
  ) : (
    body
  );
}
