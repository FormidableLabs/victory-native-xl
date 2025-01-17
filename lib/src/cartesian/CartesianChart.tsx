import * as React from "react";
import { StyleSheet, type LayoutChangeEvent } from "react-native";
import { Canvas, Group } from "@shopify/react-native-skia";
import { useSharedValue } from "react-native-reanimated";
import { type ComposedGesture } from "react-native-gesture-handler";
import { type MutableRefObject } from "react";
import { ZoomTransform } from "d3-zoom";
import type { ScaleLinear } from "d3-scale";
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
  FrameInputProps,
  ChartPressPanConfig,
  Viewport,
} from "../types";
import { transformInputData } from "./utils/transformInputData";
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
import { Frame } from "./components/Frame";
import { useBuildChartAxis } from "./hooks/useBuildChartAxis";
import { type ChartTransformState } from "./hooks/useChartTransformState";
import {
  type PanTransformGestureConfig,
  type PinchTransformGestureConfig,
} from "./utils/transformGestures";
import {
  CartesianTransformProvider,
  useCartesianTransformContext,
} from "./contexts/CartesianTransformContext";
import { downsampleTicks } from "../utils/tickHelpers";
import { boundsToClip } from "../utils/boundsToClip";
import { normalizeYAxisTicks } from "../utils/normalizeYAxisTicks";
import { CartesianGestureHandler } from "./components/CartesianGestureHandler";

export type CartesianActionsHandle<T = undefined> =
  T extends ChartPressState<infer S>
    ? S extends ChartPressStateInit
      ? {
          handleTouch: (v: T, x: number, y: number) => void;
        }
      : never
    : never;

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
  viewport?: Viewport;
  chartPressState?:
    | ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>
    | ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>[];
  chartPressConfig?: {
    pan?: ChartPressPanConfig;
  };
  children: (args: CartesianChartRenderArg<RawData, YK>) => React.ReactNode;
  renderOutside?: (
    args: CartesianChartRenderArg<RawData, YK>,
  ) => React.ReactNode;
  axisOptions?: Partial<Omit<AxisProps<RawData, XK, YK>, "xScale" | "yScale">>;
  onChartBoundsChange?: (bounds: ChartBounds) => void;
  onScaleChange?: (
    xScale: ScaleLinear<number, number>,
    yScale: ScaleLinear<number, number>,
  ) => void;
  /**
   * @deprecated This prop will eventually be replaced by the new `chartPressConfig`. For now it's being kept around for backwards compatibility sake.
   */
  gestureLongPressDelay?: number;
  xAxis?: XAxisInputProps<RawData, XK>;
  yAxis?: YAxisInputProps<RawData, YK>[];
  frame?: FrameInputProps;
  transformState?: ChartTransformState;
  transformConfig?: {
    pan?: PanTransformGestureConfig;
    pinch?: PinchTransformGestureConfig;
  };
  customGestures?: ComposedGesture;
  actionsRef?: MutableRefObject<CartesianActionsHandle<
    | ChartPressState<{
        x: InputFields<RawData>[XK];
        y: Record<YK, number>;
      }>
    | undefined
  > | null>;
};

export type CartesianChartPropsType<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
> = CartesianChartProps<RawData, XK, YK>;

export function CartesianChart<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>({
  transformState,
  children,
  ...rest
}: CartesianChartPropsType<RawData, XK, YK>) {
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
  chartPressConfig,
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
}: CartesianChartProps<RawData, XK, YK>) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const chartBoundsRef = React.useRef<ChartBounds | undefined>(undefined);
  const xScaleRef = React.useRef<ScaleLinear<number, number> | undefined>(
    undefined,
  );
  const yScaleRef = React.useRef<ScaleLinear<number, number> | undefined>(
    undefined,
  );
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

  // create a d3-zoom transform object based on the current transform state. This
  // is used for rescaling the X and Y axes.
  const transform = useCartesianTransformContext();
  const zoomX = React.useMemo(
    () => new ZoomTransform(transform.k, transform.tx, transform.ty),
    [transform.k, transform.tx, transform.ty],
  );
  const zoomY = React.useMemo(
    () => new ZoomTransform(transform.ky, transform.tx, transform.ty),
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
        viewport,
        labelRotate: normalizedAxisProps.xAxis.labelRotate,
      });

    const primaryYAxis = yAxes[0];
    const primaryYScale = primaryYAxis.yScale;
    const chartBounds = {
      left: xScale(viewport?.x?.[0] ?? xScale.domain().at(0) ?? 0),
      right: xScale(viewport?.x?.[1] ?? xScale.domain().at(-1) ?? 0),
      top: primaryYScale(
        viewport?.y?.[1] ?? (primaryYScale.domain().at(0) || 0),
      ),
      bottom: primaryYScale(
        viewport?.y?.[0] ?? (primaryYScale.domain().at(-1) || 0),
      ),
    };

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
    viewport,
  ]);

  React.useEffect(() => {
    tData.value = _tData;
  }, [_tData, tData]);

  const primaryYAxis = yAxes[0];
  const primaryYScale = primaryYAxis.yScale;

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
            <YAxis
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
            />
          );
        })
      : null;

  const XAxisComponents =
    hasMeasuredLayoutSize && (axisOptions || xAxis) ? (
      <XAxis
        {...normalizedAxisProps.xAxis}
        xScale={xScale}
        yScale={zoomY.rescaleY(primaryYScale)}
        ix={_tData.ix}
        isNumericalData={isNumericalData}
        chartBounds={chartBounds}
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

  return (
    <CartesianGestureHandler<RawData, XK, YK>
      actionsRef={actionsRef}
      chartBounds={chartBounds}
      chartPressConfig={chartPressConfig}
      chartPressState={chartPressState}
      customGestures={customGestures}
      gestureLongPressDelay={gestureLongPressDelay}
      primaryYAxis={primaryYAxis}
      tData={tData}
      transformConfig={transformConfig}
      transformState={transformState}
      xScale={xScale}
      yKeys={yKeys}
    >
      <Canvas style={styles.canvas} onLayout={onLayout}>
        {YAxisComponents}
        {XAxisComponents}
        {FrameComponent}
        <CartesianChartProvider yScale={primaryYScale} xScale={xScale}>
          <Group clip={clipRect}>
            <Group matrix={transformState?.matrix}>
              {hasMeasuredLayoutSize && children(renderArg)}
            </Group>
          </Group>
        </CartesianChartProvider>
        {hasMeasuredLayoutSize && renderOutside?.(renderArg)}
      </Canvas>
    </CartesianGestureHandler>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});
