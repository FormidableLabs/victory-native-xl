import * as React from "react";
import { type LayoutChangeEvent, Platform } from "react-native";
import {
  Canvas,
  convertToAffineMatrix,
  convertToColumnMajor,
  Group,
  type Matrix4,
  rect,
  type SkRect,
} from "@shopify/react-native-skia";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  type ComposedGesture,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  type GestureType,
  type TouchData,
} from "react-native-gesture-handler";

import { ZoomTransform } from "d3-zoom";
import type {
  AxisProps,
  CartesianChartRenderArg,
  InputFields,
  NumericalFields,
  SidedNumber,
  TransformedData,
  ChartBounds,
  YAxisInputProps,
  XAxisInputProps,
  FrameInputProps,
} from "../types";
import { transformInputData } from "./utils/transformInputData";
import { findClosestPoint } from "../utils/findClosestPoint";
import { valueFromSidedNumber } from "../utils/valueFromSidedNumber";
import { asNumber } from "../utils/asNumber";
import type { ChartPressState } from "./hooks/useChartPressState";
import { useFunctionRef } from "../hooks/useFunctionRef";
import { CartesianChartProvider } from "./contexts/CartesianChartContext";
import { normalizeYAxisTicks } from "../utils/normalizeYAxisTicks";
import { XAxis } from "./components/XAxis";
import { YAxis } from "./components/YAxis";
import { Frame } from "./components/Frame";
import { useBuildChartAxis } from "./hooks/useBuildChartAxis";
import {
  type ChartTransformState,
  identity4,
} from "./hooks/useChartTransformState";
import {
  panTransformGesture,
  pinchTransformGesture,
} from "./utils/transformGestures";
import {
  CartesianTransformProvider,
  useCartesianTransformContext,
} from "./contexts/CartesianTransformContext";

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
  frame?: FrameInputProps;
  transformState?: ChartTransformState;
};

export function CartesianChart<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>({ transformState, children, ...rest }: CartesianChartProps<RawData, XK, YK>) {
  return (
    <CartesianTransformProvider transformState={transformState}>
      <CartesianChartContent {...{ ...rest, transformState }}>
        {children}
      </CartesianChartContent>
    </CartesianTransformProvider>
  );
}

function CartesianChartContent<
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
  transformState,
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
  const normalizedAxisProps = useBuildChartAxis({
    xAxis,
    yAxis,
    frame,
    yKeys,
    axisOptions,
  });
  const transform = useCartesianTransformContext();
  const zoom = new ZoomTransform(transform.k, transform.tx, transform.ty);

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
          xAxis: normalizedAxisProps.xAxis,
          yAxes: normalizedAxisProps.yAxes,
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
      normalizedAxisProps,
    ]);

  const primaryYAxis = yAxes[0];
  const primaryYScale = primaryYAxis.yScale;

  // stacked bar values
  const chartHeight = chartBounds.bottom;
  const yScaleTop = primaryYAxis.yScale.domain().at(0);
  const yScaleBottom = primaryYAxis.yScale.domain().at(-1);
  // end stacked bar values

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
    y: number,
  ) => {
    "worklet";
    const idx = findClosestPoint(tData.value.ox, x);

    if (typeof idx !== "number") return;

    const isInYs = (yk: string): yk is YK & string => yKeys.includes(yk as YK);

    // begin stacked bar handling:
    // store the heights of each bar segment
    const barHeights: number[] = [];
    for (const yk in v.y) {
      if (isInYs(yk)) {
        const height = asNumber(tData.value.y[yk].i[idx]);
        barHeights.push(height);
      }
    }

    const chartYPressed = chartHeight - y; // Invert y-coordinate, since RNGH gives us the absolute Y, and we want to know where in the chart they clicked
    // Calculate the actual yValue of the touch within the domain of the yScale
    const yDomainValue =
      (chartYPressed / chartHeight) * (yScaleTop! - yScaleBottom!);

    // track the cumulative height and the y-index of the touched segment
    let cumulativeHeight = 0;
    let yIndex = -1;

    // loop through the bar heights to find which bar was touched
    for (let i = 0; i < barHeights.length; i++) {
      // Accumulate the height as we go along
      cumulativeHeight += barHeights[i]!;
      // Check if the y-value touched falls within the current segment
      if (yDomainValue <= cumulativeHeight) {
        // If it does, set yIndex to the current segment index and break
        yIndex = i;
        break;
      }
    }

    // Update the yIndex value in the state or context
    v.yIndex.value = yIndex;
    // end stacked bar handling

    if (v) {
      try {
        v.matchedIndex.value = idx;
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
          handleTouch(v, touch.x, touch.y);
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
        handleTouch(v, touch.x, touch.y);
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
        handleTouch(v, touch.x, touch.y);
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
      ? normalizedAxisProps.yAxes?.map((axis, index) => {
          const yAxis = yAxes[index];
          if (!yAxis) return null;
          const rescaled = zoom.rescaleY(yAxis.yScale);
          return (
            <YAxis
              key={index}
              {...axis}
              xScale={zoom.rescaleX(xScale)}
              yScale={rescaled}
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
        {...normalizedAxisProps.xAxis}
        xScale={zoom.rescaleX(xScale)}
        yScale={zoom.rescaleY(primaryYScale)}
        ix={_tData.ix}
        isNumericalData={isNumericalData}
      />
    ) : null;

  const FrameComponent =
    hasMeasuredLayoutSize && (axisOptions || frame) ? (
      <Frame
        {...normalizedAxisProps.frame}
        xScale={xScale}
        yScale={primaryYScale}
      />
    ) : null;

  // Body of the chart.
  const body = (
    <Canvas style={{ flex: 1 }} onLayout={onLayout}>
      {YAxisComponents}
      {XAxisComponents}
      {FrameComponent}
      <CartesianChartProvider yScale={primaryYScale} xScale={xScale}>
        <Group clip={clipRect}>
          <Group matrix={transformState?.transformMatrix}>
            {hasMeasuredLayoutSize && children(renderArg)}
          </Group>
        </Group>
      </CartesianChartProvider>
      {hasMeasuredLayoutSize && renderOutside?.(renderArg)}
    </Canvas>
  );

  let composed = Gesture.Race();
  if (transformState) {
    composed = Gesture.Race(
      composed,
      pinchTransformGesture(transformState),
      panTransformGesture(transformState),
    );
  }
  // if (chartPressState) {
  //   composed = Gesture.Race(composed, panGesture);
  // }

  return (
    <GestureHandlerRootView style={{ flex: 1, overflow: "hidden" }}>
      {body}
      <GestureHandler
        debug={true}
        gesture={composed}
        transformState={transformState}
        dimensions={{ x: 0, y: 0, width: size.width, height: size.height }}
      />
    </GestureHandlerRootView>
  );
}

type GestureHandlerProps = {
  gesture: ComposedGesture | GestureType;
  dimensions: SkRect;
  transformState?: ChartTransformState;
  debug?: boolean;
};
const GestureHandler = ({
  gesture,
  dimensions,
  transformState,
  debug = false,
}: GestureHandlerProps) => {
  const { x, y, width, height } = dimensions;
  const style = useAnimatedStyle(() => {
    let m4: Matrix4 = identity4;
    if (transformState?.matrix.value) {
      m4 = convertToColumnMajor(transformState.matrix.value);
    }
    return {
      position: "absolute",
      backgroundColor: debug ? "rgba(100, 200, 300, 0.4)" : "transparent",
      x,
      y,
      width,
      height,
      transform: [
        { translateX: -width / 2 },
        { translateY: -height / 2 },
        {
          matrix: m4
            ? Platform.OS === "web"
              ? convertToAffineMatrix(m4)
              : (m4 as unknown as number[])
            : [],
        },
        { translateX: width / 2 },
        { translateY: height / 2 },
      ],
    };
  });
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={style} />
    </GestureDetector>
  );
};
