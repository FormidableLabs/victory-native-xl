import * as React from "react";
import { transformInputData } from "./transformInputData";
import { type LayoutChangeEvent } from "react-native";
import { Canvas, Group, rect, type SkPath } from "@shopify/react-native-skia";
import { type CurveType, makeCartesianPath } from "./makeCartesianPath";
import {
  makeMutable,
  runOnJS,
  type SharedValue,
  useSharedValue,
} from "react-native-reanimated";
import type {
  CartesianChartRenderArg,
  NumericalFields,
  ScaleType,
  SidedNumber,
  TransformedData,
  PathType,
  ScatterOptions,
} from "../types";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { findClosestPoint } from "../utils/findClosestPoint";
import { valueFromSidedNumber } from "../utils/valueFromSidedNumber";
import { Grid, type GridProps } from "../grid/Grid";
import { pathTypes } from "../types";

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
  xScaleType: ScaleType;
  yScaleType: ScaleType;
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
  activePressX?: {
    value?: SharedValue<number>;
    position?: SharedValue<number>;
  };
  activePressY?: {
    [K in YK]?: { value?: SharedValue<number>; position?: SharedValue<number> };
  };
  children: (args: CartesianChartRenderArg<RawData, T, YK>) => React.ReactNode;
  renderOutside: (
    args: CartesianChartRenderArg<RawData, T, YK>,
  ) => React.ReactNode;
  /** Grid props */
  gridOptions?: Partial<
    Omit<GridProps<RawData, T, XK, YK>, "xScale" | "yScale">
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
  xScaleType,
  yScaleType,
  curve,
  padding,
  domainPadding,
  isPressEnabled,
  onPressActiveChange,
  onPressValueChange,
  onPressActiveStart,
  onPressActiveEnd,
  activePressX: incomingActivePressX,
  activePressY: incomingActivePressY,
  children,
  renderOutside,
  gridOptions,
  domain,
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

  const { paths, xScale, yScale, chartBounds, _tData } = React.useMemo(() => {
    const { xScale, yScale, ..._tData } = transformInputData({
      data,
      xKey,
      yKeys,
      xScaleType,
      yScaleType,
      gridOptions,
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
    /**
     * Creates a proxy object that will lazily create paths.
     * Consumer accesses e.g. paths["high.line"] or paths["low.area"]
     * and the proxy will create the path if it doesn't exist.
     */
    const makePaths = () => {
      const cache = {} as Record<string, SkPath>;
      return new Proxy(
        {},
        {
          get(_, property: string) {
            const [key, chartType] = property.split(".") as [YK, PathType];
            const getPath = (options: Record<string, unknown> = {}) => {
              if (!yKeys.includes(key) || !pathTypes.includes(chartType))
                return "";

              if (cache[property]) return cache[property];

              const path = makeCartesianPath(_tData.ox, _tData.y[key].o, {
                options,
                curveType:
                  typeof curve === "string" ? curve : curve[key] || "linear",
                pathType: chartType,
                y0: yScale.range()[1] || 0,
              });

              cache[property] = path;
              return path;
            };
            switch (chartType) {
              case "scatter":
                return (options: ScatterOptions) => getPath(options);
              default:
                return getPath();
            }
          },
        },
      ) as CartesianChartRenderArg<RawData, T, YK>["paths"];
    };

    const paths = makePaths();

    const chartBounds = {
      left: xScale(xScale.domain().at(0) || 0),
      right: xScale(xScale.domain().at(-1) || 0),
      top: yScale(yScale.domain().at(0) || 0),
      bottom: yScale(yScale.domain().at(-1) || 0),
    };

    return { tData, paths, xScale, yScale, chartBounds, _tData };
  }, [data, xKey, yKeys, size, curve, domain]);

  const [isPressActive, setIsPressActive] = React.useState(false);
  const changePressActive = React.useCallback(
    (val: boolean) => {
      setIsPressActive(val);
      onPressActiveChange?.(val);
    },
    [onPressActiveChange],
  );
  const internalActivePressX = React.useRef({
    value: makeMutable(0),
    position: makeMutable(0),
  });
  const activePressX = {
    value: incomingActivePressX?.value || internalActivePressX.current.value,
    position:
      incomingActivePressX?.position || internalActivePressX.current.position,
  };

  const internalActivePressY = React.useRef(
    yKeys.reduce(
      (acc, key) => {
        acc[key] = {
          value: makeMutable(0),
          position: makeMutable(0),
        };
        return acc;
      },
      {} as CartesianChartRenderArg<RawData, T, YK>["activePressY"],
    ),
  );
  const activePressY = yKeys.reduce(
    (acc, key) => {
      acc[key] = {
        value:
          incomingActivePressY?.[key]?.value ||
          internalActivePressY.current[key].value,
        position:
          incomingActivePressY?.[key]?.position ||
          internalActivePressY.current[key].position,
      };
      return acc;
    },
    {} as CartesianChartRenderArg<RawData, T, YK>["activePressY"],
  );

  /**
   * Pan gesture handling
   */
  const lastIdx = useSharedValue(null as null | number);
  const handleTouch = (x: number) => {
    "worklet";
    const idx = findClosestPoint(tData.value.ox, x);
    if (typeof idx !== "number") return;

    activePressX.value.value = tData.value.ix[idx]!;
    activePressX.position.value = tData.value.ox[idx]!;

    yKeys.forEach((key) => {
      activePressY[key].value.value = tData.value.y[key].i[idx]!;
      activePressY[key].position.value = tData.value.y[key].o[idx]!;
    });

    onPressValueChange &&
      lastIdx.value !== idx &&
      runOnJS(onPressValueChange)({
        x: {
          value: activePressX.value.value,
          position: activePressX.position.value,
        },
        y: yKeys.reduce(
          (acc, key) => {
            acc[key] = {
              value: activePressY[key].value.value,
              position: activePressY[key].position.value,
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

  const transformedData = React.useMemo(
    () => ({
      x: _tData.ox,
      y: (() => {
        const cache = {} as Record<YK, number[]>;
        return new Proxy(
          {},
          {
            get(_, property: string) {
              const key = property as YK;
              if (!yKeys.includes(key)) return undefined;
              if (cache[key]) return cache[key];
              cache[key] = _tData.y[key].o;
              return cache[key];
            },
          },
        ) as Record<YK, number[]>;
      })(),
    }),
    [_tData],
  );

  const renderArg: CartesianChartRenderArg<RawData, T, YK> = {
    paths,
    isPressActive,
    activePressX,
    activePressY,
    xScale,
    yScale,
    chartBounds,
    canvasSize: size,
    transformedData,
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
      {hasMeasuredLayoutSize && renderOutside?.(renderArg)}
      <Group clip={clipRect}>
        {hasMeasuredLayoutSize && children(renderArg)}
      </Group>
      {gridOptions && hasMeasuredLayoutSize && (
        <Grid xScale={xScale} yScale={yScale} {...gridOptions} />
      )}
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
