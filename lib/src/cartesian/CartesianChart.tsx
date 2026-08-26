import * as React from "react";
import { Group, type CanvasRef } from "@shopify/react-native-skia";
import { type SharedValue, useSharedValue } from "react-native-reanimated";
import { type ContextBridge, FiberProvider, useContextBridge } from "its-fine";
import {
  type ComposedGesture,
  Gesture,
  type TouchData,
} from "react-native-gesture-handler";
import { type MutableRefObject } from "react";
import type { ScaleLinear, ScaleLogarithmic } from "d3-scale";
import isEqual from "react-fast-compare";
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
  XAxisPropsWithDefaults,
  YAxisPropsWithDefaults,
  FrameInputProps,
  ChartPressPanConfig,
  Viewport,
  GestureHandlerConfig,
  CartesianChartOrientation,
  AxisLabelRenderer,
} from "../types";
import { transformInputData } from "./utils/transformInputData";
import { transformHorizontalInputData } from "./utils/transformHorizontalInputData";
import { valueFromSidedNumber } from "../utils/valueFromSidedNumber";
import { asNumber } from "../utils/asNumber";
import type {
  ChartPressState,
  ChartPressStateInit,
} from "./hooks/useChartPressState";
import { useFunctionRef } from "../hooks/useFunctionRef";
import { CartesianChartProvider } from "./contexts/CartesianChartContext";
import { XAxis } from "./components/XAxis";
import { YAxis } from "./components/YAxis";
import { CategoryYAxis } from "./components/CategoryYAxis";
import { Frame } from "./components/Frame";
import { useBuildChartAxis } from "./hooks/useBuildChartAxis";
import { type ChartTransformState } from "./hooks/useChartTransformState";
import {
  panTransformGesture,
  type PanTransformGestureConfig,
  pinchTransformGesture,
  type PinchTransformGestureConfig,
} from "./utils/transformGestures";
import {
  CartesianTransformProvider,
  CartesianTransformValueProvider,
  useCartesianTransformContext,
} from "./contexts/CartesianTransformContext";
import { downsampleTicks } from "../utils/tickHelpers";
import { GestureHandler } from "../shared/GestureHandler";
import { type ChartLayoutModeProps } from "../shared/ChartLayoutModeProps";
import { ChartWrapper } from "../shared/ChartWrapper";
import { useChartCanvasSize } from "../shared/useChartCanvasSize";
import { boundsToClip } from "../utils/boundsToClip";
import { normalizeYAxisTicks } from "../utils/normalizeYAxisTicks";
import { applyChartPressPanConfig } from "./utils/applyChartPressPanConfig";
import { createFallbackChartState } from "./utils/createFallbackChartState";
import { getCartesianTouchCoordinates } from "./utils/getCartesianTouchCoordinates";
import { resetChartPressState } from "./utils/resetChartPressState";
import { getClosestDatumIndex } from "./utils/getClosestDatumIndex";
import { getStackedBarTouchSegmentIndex } from "./utils/getStackedBarTouchSegmentIndex";
import {
  type ChartPressBootstrapEntry,
  pruneChartPressBootstrap,
} from "./utils/chartPressBootstrap";
import { createSafeZoomTransform } from "./utils/createSafeZoomTransform";
import { getCartesianChartBounds } from "./utils/getCartesianChartBounds";

export type CartesianActionsHandle<T = undefined> =
  T extends ChartPressState<infer S>
    ? S extends ChartPressStateInit
      ? {
          handleTouch: (v: T, x: number, y: number) => void;
        }
      : never
    : never;

export type CartesianActionsRef<T = undefined> =
  | MutableRefObject<CartesianActionsHandle<T> | null>
  | SharedValue<CartesianActionsHandle<T> | null>;

export type CartesianChartRef<T = undefined> = {
  /**
   * The Skia canvas ref for imperative drawing. This is `null` in headless mode
   * because no `Canvas` is mounted; the host must supply an offscreen surface.
   */
  canvas: CanvasRef | null;
  actions: CartesianActionsHandle<T>;
};

type CartesianChartAxisProps<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
  XLabel,
  YLabel,
> = {
  axisOptions?: Partial<
    Omit<AxisProps<RawData, XK, YK, XLabel, YLabel>, "xScale" | "yScale">
  >;
  xAxis?: XAxisInputProps<RawData, XK, XLabel>;
  yAxis?: YAxisInputProps<RawData, YK, YLabel>[];
};

type CartesianChartBaseProps<
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
  viewport?: Viewport;
  chartPressState?:
    | ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>
    | ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>[];
  chartPressConfig?: {
    pan?: ChartPressPanConfig;
  };
  gestureHandlerConfig?: GestureHandlerConfig;
  children: (args: CartesianChartRenderArg<RawData, YK>) => React.ReactNode;
  renderOutside?: (
    args: CartesianChartRenderArg<RawData, YK>,
  ) => React.ReactNode;
  onChartBoundsChange?: (bounds: ChartBounds) => void;
  onScaleChange?: (
    xScale: ScaleLinear<number, number>,
    yScale: ScaleLinear<number, number>,
  ) => void;
  /**
   * @deprecated This prop will eventually be replaced by the new `chartPressConfig`. For now it's being kept around for backwards compatibility sake.
   */
  gestureLongPressDelay?: number;
  frame?: FrameInputProps;
  transformState?: ChartTransformState;
  transformConfig?: {
    pan?: PanTransformGestureConfig;
    pinch?: PinchTransformGestureConfig;
  };
  customGestures?: ComposedGesture;
  actionsRef?: CartesianActionsRef<
    | ChartPressState<{
        x: InputFields<RawData>[XK];
        y: Record<YK, number>;
      }>
    | undefined
  >;
  ref?: React.Ref<
    CartesianChartRef<
      | ChartPressState<{
          x: InputFields<RawData>[XK];
          y: Record<YK, number>;
        }>
      | undefined
    >
  >;
} & ChartLayoutModeProps;

type CartesianChartVerticalProps<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
> = CartesianChartBaseProps<RawData, XK, YK> &
  CartesianChartAxisProps<
    RawData,
    XK,
    YK,
    InputFields<RawData>[XK],
    RawData[YK]
  > & {
    orientation?: "vertical";
  };

type CartesianChartHorizontalProps<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
> = CartesianChartBaseProps<RawData, XK, YK> &
  CartesianChartAxisProps<RawData, XK, YK, number, InputFields<RawData>[XK]> & {
    orientation: "horizontal";
  };

type CartesianChartDynamicOrientationProps<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
> = CartesianChartBaseProps<RawData, XK, YK> &
  CartesianChartAxisProps<
    RawData,
    XK,
    YK,
    InputFields<RawData>[XK] | number,
    RawData[YK] | InputFields<RawData>[XK]
  > & {
    orientation: CartesianChartOrientation;
  };

type CartesianChartProps<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
> =
  | CartesianChartVerticalProps<RawData, XK, YK>
  | CartesianChartHorizontalProps<RawData, XK, YK>
  | CartesianChartDynamicOrientationProps<RawData, XK, YK>;

export function CartesianChart<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>(props: CartesianChartHorizontalProps<RawData, XK, YK>): React.ReactElement;
export function CartesianChart<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>(props: CartesianChartVerticalProps<RawData, XK, YK>): React.ReactElement;
export function CartesianChart<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>(
  props: CartesianChartDynamicOrientationProps<RawData, XK, YK>,
): React.ReactElement;
export function CartesianChart<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>({
  transformState,
  children,
  ref,
  ...rest
}: CartesianChartProps<RawData, XK, YK>) {
  return (
    <FiberProvider>
      <CartesianTransformProvider transformState={transformState}>
        <CartesianChartContent {...{ ...rest, transformState }} ref={ref}>
          {children}
        </CartesianChartContent>
      </CartesianTransformProvider>
    </FiberProvider>
  );
}

function CartesianCanvas({
  children,
  ...props
}: React.PropsWithChildren<
  Pick<
    React.ComponentProps<typeof ChartWrapper>,
    | "isHeadless"
    | "explicitSize"
    | "onLayout"
    | "hasMeasuredLayoutSize"
    | "canvasSize"
    | "canvasRef"
    | "gestureOverlay"
  >
>) {
  const Bridge: ContextBridge = useContextBridge();

  return (
    <ChartWrapper
      {...props}
      chartContent={children}
      wrapCanvasContent={(content) => <Bridge>{content}</Bridge>}
    />
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
  orientation = "vertical",
  padding,
  domainPadding,
  children,
  renderOutside = () => null,
  axisOptions,
  domain,
  chartPressState,
  chartPressConfig,
  gestureHandlerConfig,
  onChartBoundsChange,
  onScaleChange,
  gestureLongPressDelay = 100,
  xAxis,
  yAxis,
  frame,
  transformState,
  transformConfig,
  customGestures,
  actionsRef,
  viewport,
  ref,
  explicitSize,
  headless,
}: CartesianChartProps<RawData, XK, YK>) {
  const { size, hasMeasuredLayoutSize, onLayout, isHeadless } =
    useChartCanvasSize({ explicitSize, headless });
  const chartBoundsRef = React.useRef<ChartBounds | undefined>(undefined);
  const xScaleRef = React.useRef<
    ScaleLogarithmic<number, number> | ScaleLinear<number, number> | undefined
  >(undefined);

  const yScaleRef = React.useRef<ScaleLinear<number, number> | undefined>(
    undefined,
  );
  const canvasRef = React.useRef<CanvasRef | null>(null);
  const chartPressStateRef = React.useRef(chartPressState);
  chartPressStateRef.current = chartPressState;
  const yKeysKey = yKeys.join("\u0000");
  const normalizedAxisProps = useBuildChartAxis<RawData, XK, YK, never, never>({
    xAxis: xAxis as XAxisInputProps<RawData, XK, never> | undefined,
    yAxis: yAxis as YAxisInputProps<RawData, YK, never>[] | undefined,
    frame,
    yKeys,
    axisOptions: axisOptions as
      | Partial<
          Omit<AxisProps<RawData, XK, YK, never, never>, "xScale" | "yScale">
        >
      | undefined,
  });
  const axisScales = axisOptions?.axisScales;

  // create a d3-zoom transform object based on the current transform state. This
  // is used for rescaling the X and Y axes.
  const transform = useCartesianTransformContext();
  const zoomX = React.useMemo(
    () => createSafeZoomTransform(transform.k, transform.tx, transform.ty),
    [transform.k, transform.tx, transform.ty],
  );
  const zoomY = React.useMemo(
    () => createSafeZoomTransform(transform.ky, transform.tx, transform.ty),
    [transform.ky, transform.tx, transform.ty],
  );

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

  const {
    yAxes,
    xScale,
    chartBounds,
    isNumericalData,
    xTicksNormalized,
    _tData,
  } = React.useMemo(() => {
    if (!data.length) {
      return createFallbackChartState<RawData, XK, YK>(yKeys);
    }
    const transformArgs = {
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
      viewport,
      labelRotate: normalizedAxisProps.xAxis.labelRotate,
      axisScales,
    };

    const transformed =
      orientation === "horizontal"
        ? transformHorizontalInputData({
            ...transformArgs,
            xAxis: normalizedAxisProps.xAxis as XAxisPropsWithDefaults<
              RawData,
              XK,
              number
            >,
            yAxes: normalizedAxisProps.yAxes as YAxisPropsWithDefaults<
              RawData,
              YK,
              InputFields<RawData>[XK]
            >[],
          })
        : transformInputData({
            ...transformArgs,
            xAxis: normalizedAxisProps.xAxis as XAxisPropsWithDefaults<
              RawData,
              XK
            >,
            yAxes: normalizedAxisProps.yAxes as YAxisPropsWithDefaults<
              RawData,
              YK
            >[],
          });
    const { xScale, yAxes, isNumericalData, xTicksNormalized, ..._tData } =
      transformed;

    const primaryYAxis = yAxes[0];
    const primaryYScale = primaryYAxis.yScale;
    const chartBounds = getCartesianChartBounds({
      xScale,
      yScale: primaryYScale,
      viewport,
      domainPadding,
      orientation,
    });

    return {
      xTicksNormalized,
      yAxes,
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
    normalizedAxisProps,
    axisScales,
    viewport,
    orientation,
  ]);

  React.useEffect(() => {
    tData.value = _tData;
  }, [_tData, tData]);

  const primaryYAxis = yAxes[0];
  const primaryYScale = primaryYAxis.yScale;
  // stacked bar values
  const chartHeight = chartBounds.bottom;
  const yScaleTop = primaryYAxis.yScale.domain().at(0);
  const yScaleBottom = primaryYAxis.yScale.domain().at(-1);
  const chartWidth = chartBounds.right - chartBounds.left;
  const xScaleLeft = xScale.invert(chartBounds.left);
  const xScaleRight = xScale.invert(chartBounds.right);
  // end stacked bar values

  /**
   * Pan gesture handling
   */
  const lastIdx = useSharedValue(null as null | number);
  /**
   * Take a "press value" and an x-value and update the shared values accordingly.
   */
  const handleTouch = React.useCallback(
    (
      v: ChartPressState<{
        x: InputFields<RawData>[XK];
        y: Record<YK, number>;
      }>,
      x: number,
      y: number,
    ) => {
      "worklet";
      const idx = getClosestDatumIndex({
        orientation,
        categoryPositions: tData.value.ox,
        touchX: x,
        touchY: y,
      });

      if (typeof idx !== "number") return;

      const isInYs = (yk: string): yk is YK & string =>
        yKeys.includes(yk as YK);
      // begin stacked bar handling:
      // store the heights of each bar segment
      const barHeights: number[] = [];
      for (const yk in v.y) {
        if (isInYs(yk)) {
          const height = asNumber(tData.value.y[yk].i[idx]);
          barHeights.push(height);
        }
      }

      if (orientation === "horizontal") {
        const chartXPressed = x - chartBounds.left;
        const xDomainValue =
          chartWidth > 0 &&
          xScaleLeft !== undefined &&
          xScaleRight !== undefined
            ? (chartXPressed / chartWidth) * (xScaleRight - xScaleLeft) +
              xScaleLeft
            : NaN;

        v.yIndex.value = getStackedBarTouchSegmentIndex({
          values: barHeights,
          touchValue: xDomainValue,
        });
      } else {
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
      }
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
    },
    [
      chartBounds.left,
      chartHeight,
      chartWidth,
      lastIdx,
      orientation,
      tData,
      xScaleLeft,
      xScaleRight,
      yKeys,
      yScaleBottom,
      yScaleTop,
    ],
  );

  React.useImperativeHandle(
    ref,
    () => ({
      canvas: canvasRef.current,
      actions: {
        handleTouch,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canvasRef],
  );

  const handleTouchRef = useFunctionRef(handleTouch);
  const mutableActionsRef =
    actionsRef && "current" in actionsRef ? actionsRef : undefined;
  const sharedActionsRef =
    actionsRef && "value" in actionsRef ? actionsRef : undefined;

  React.useImperativeHandle(
    mutableActionsRef,
    () => ({
      handleTouch: (value, x, y) => {
        handleTouchRef.current?.(value, x, y);
      },
    }),
    [handleTouchRef],
  );

  React.useEffect(() => {
    if (!sharedActionsRef) return;

    sharedActionsRef.value = {
      handleTouch,
    };

    return () => {
      sharedActionsRef.value = null;
    };
  }, [handleTouch, sharedActionsRef]);

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
    bootstrap: [] as ChartPressBootstrapEntry<
      ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>,
      TouchData
    >[],
  });

  React.useEffect(() => {
    const vals = chartPressStateRef.current;
    const states = Array.isArray(vals) ? vals : [vals];

    for (const state of states) {
      if (state) resetChartPressState(state);
    }

    touchMap.value = {};
    gestureState.value = {
      isGestureActive: false,
      bootstrap: [],
    };
    lastIdx.value = null;
  }, [data, gestureState, lastIdx, touchMap, xKey, yKeysKey]);

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

          const touchPoint = getCartesianTouchCoordinates({
            touch,
            transform: transformState?.matrix.value,
          });

          handleTouch(v, touchPoint.x, touchPoint.y);
        } else {
          gestureState.value.bootstrap.push({
            pressIndex: i,
            state: v,
            touch,
          });
        }
      }
    })
    /**
     * On start, check if we have any bootstrapped updates we need to apply.
     */
    .onStart(() => {
      gestureState.value.isGestureActive = true;
      const bootstrap = gestureState.value.bootstrap.slice(0);
      gestureState.value.bootstrap = [];

      for (let i = 0; i < bootstrap.length; i++) {
        const { pressIndex, state: v, touch } = bootstrap[i]!;
        // Update the mapping
        if (typeof touchMap.value[touch.id] !== "number")
          touchMap.value[touch.id] = pressIndex;

        v.isActive.value = true;

        const touchPoint = getCartesianTouchCoordinates({
          touch,
          transform: transformState?.matrix.value,
        });

        handleTouch(v, touchPoint.x, touchPoint.y);
      }
    })
    /**
     * Clear gesture state on gesture end.
     */
    .onFinalize(() => {
      const vals = activePressSharedValues || [];
      for (const val of vals) {
        if (val) {
          val.isActive.value = false;
        }
      }

      touchMap.value = {};
      gestureState.value = {
        isGestureActive: false,
        bootstrap: [],
      };
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

        const touchPoint = getCartesianTouchCoordinates({
          touch,
          transform: transformState?.matrix.value,
        });

        handleTouch(v, touchPoint.x, touchPoint.y);
      }
    })
    /**
     * On each finger up, start to update values and "free up" the touch map.
     */
    .onTouchesUp((e) => {
      gestureState.value.bootstrap = pruneChartPressBootstrap({
        bootstrap: gestureState.value.bootstrap,
        changedTouches: e.changedTouches,
        numberOfTouches: e.numberOfTouches,
      });

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
    });

  applyChartPressPanConfig({
    panGesture,
    panConfig: chartPressConfig?.pan,
    gestureLongPressDelay,
  });

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
            x:
              orientation === "horizontal"
                ? asNumber(_tData.y[key].o[i])
                : asNumber(_tData.ox[i]),
            xValue: x,
            y:
              orientation === "horizontal"
                ? asNumber(_tData.ox[i])
                : _tData.y[key].o[i],
            yValue: _tData.y[key].i[i],
          }));

          return cache[key];
        },
      },
    ) as PointsArg;
  }, [_tData, orientation, yKeys]);

  // On bounds change, emit
  const onChartBoundsRef = useFunctionRef(onChartBoundsChange);
  React.useEffect(() => {
    if (!isEqual(chartBounds, chartBoundsRef.current)) {
      chartBoundsRef.current = chartBounds;
      onChartBoundsRef.current?.(chartBounds);
    }
  }, [chartBounds, onChartBoundsRef]);

  const onScaleRef = useFunctionRef(onScaleChange);
  React.useEffect(() => {
    const rescaledX = zoomX.rescaleX(xScale);
    const rescaledY = zoomY.rescaleY(primaryYScale);
    if (
      !isEqual(xScaleRef.current?.domain(), rescaledX.domain()) ||
      !isEqual(yScaleRef.current?.domain(), rescaledY.domain()) ||
      !isEqual(xScaleRef.current?.range(), rescaledX.range()) ||
      !isEqual(yScaleRef.current?.range(), rescaledY.range())
    ) {
      xScaleRef.current = xScale;
      yScaleRef.current = primaryYScale;
      onScaleRef.current?.(rescaledX, rescaledY);
    }
  }, [onScaleChange, onScaleRef, xScale, zoomX, zoomY, primaryYScale]);

  const renderArg: CartesianChartRenderArg<RawData, YK> = {
    xScale,
    xTicks: xTicksNormalized,
    yScale: primaryYScale,
    yTicks: primaryYAxis.yTicksNormalized,
    chartBounds,
    canvasSize: size,
    points,
  };

  const clipRect = boundsToClip(chartBounds);
  const YAxisComponents =
    hasMeasuredLayoutSize && (axisOptions || yAxes)
      ? normalizedAxisProps.yAxes?.map((axis, index) => {
          const yAxis = yAxes[index];

          if (!yAxis) return null;

          if (orientation === "horizontal") {
            return (
              <CategoryYAxis<RawData, XK>
                key={index}
                {...axis}
                formatYLabel={
                  axis.formatYLabel as
                    | ((label: InputFields<RawData>[XK]) => string)
                    | undefined
                }
                labelRenderer={
                  axis.labelRenderer as
                    | AxisLabelRenderer<InputFields<RawData>[XK]>
                    | undefined
                }
                xScale={zoomX.rescaleX(xScale)}
                yScale={zoomY.rescaleY(yAxis.yScale)}
                yTicksNormalized={yAxis.yTicksNormalized}
                ix={_tData.ix}
                chartBounds={chartBounds}
              />
            );
          }

          const primaryAxisProps = normalizedAxisProps.yAxes[0]!;
          const primaryRescaled = zoomY.rescaleY(primaryYScale);
          const rescaled = zoomY.rescaleY(yAxis.yScale);

          const rescaledTicks = axis.tickValues
            ? downsampleTicks(axis.tickValues, axis.tickCount)
            : axis.enableRescaling
              ? rescaled.ticks(axis.tickCount)
              : yAxis.yScale.ticks(axis.tickCount);

          const primaryTicksRescaled = primaryAxisProps.tickValues
            ? downsampleTicks(
                primaryAxisProps.tickValues,
                primaryAxisProps.tickCount,
              )
            : primaryAxisProps.enableRescaling
              ? primaryRescaled.ticks(primaryAxisProps.tickCount)
              : primaryYScale.ticks(primaryAxisProps.tickCount);

          return (
            <YAxis<RawData, YK, never>
              key={index}
              {...axis}
              xScale={zoomX.rescaleX(xScale)}
              yScale={rescaled}
              yTicksNormalized={
                index > 0 && !axis.tickValues
                  ? normalizeYAxisTicks(
                      primaryTicksRescaled,
                      primaryRescaled,
                      rescaled,
                    )
                  : rescaledTicks
              }
              chartBounds={chartBounds}
              orientation={orientation}
            />
          );
        })
      : null;

  const XAxisComponents =
    hasMeasuredLayoutSize && (axisOptions || xAxis) ? (
      <XAxis<RawData, XK, never>
        {...normalizedAxisProps.xAxis}
        xScale={xScale}
        yScale={zoomY.rescaleY(primaryYScale)}
        ix={_tData.ix}
        isNumericalData={orientation === "horizontal" ? true : isNumericalData}
        chartBounds={chartBounds}
        orientation={orientation}
        zoom={zoomX}
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

  const chartContent = (
    <>
      {YAxisComponents}
      {XAxisComponents}
      {FrameComponent}
      <Group clip={clipRect}>
        <Group matrix={transformState?.matrix}>
          {hasMeasuredLayoutSize && children(renderArg)}
        </Group>
      </Group>
      {hasMeasuredLayoutSize && renderOutside?.(renderArg)}
    </>
  );

  let gestureOverlay: React.ReactNode;
  if (!isHeadless) {
    let composed = customGestures ?? Gesture.Race();
    if (transformState) {
      let gestures = Gesture.Simultaneous();

      if (transformConfig?.pinch?.enabled ?? true) {
        gestures = Gesture.Simultaneous(
          gestures,
          pinchTransformGesture(transformState, transformConfig?.pinch),
        );
      }

      if (transformConfig?.pan?.enabled ?? true) {
        gestures = Gesture.Simultaneous(
          gestures,
          panTransformGesture(transformState, transformConfig?.pan),
        );
      }

      composed = Gesture.Race(composed, Gesture.Simultaneous(gestures));
    }
    if (chartPressState) {
      composed = Gesture.Race(composed, panGesture);
    }

    gestureOverlay = (
      <GestureHandler config={gestureHandlerConfig} gesture={composed} />
    );
  }

  return (
    <CartesianTransformValueProvider value={transform}>
      <CartesianChartProvider
        yScale={primaryYScale}
        xScale={xScale}
        orientation={orientation}
      >
        <CartesianCanvas
          isHeadless={isHeadless}
          explicitSize={explicitSize}
          onLayout={onLayout}
          hasMeasuredLayoutSize={hasMeasuredLayoutSize}
          canvasSize={size}
          canvasRef={canvasRef}
          gestureOverlay={gestureOverlay}
        >
          {chartContent}
        </CartesianCanvas>
      </CartesianChartProvider>
    </CartesianTransformValueProvider>
  );
}
