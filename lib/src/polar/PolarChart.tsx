import * as React from "react";
import { Group } from "react-native-skia";
import {
  Platform,
  type ViewStyle,
  type StyleProp,
  type LayoutChangeEvent,
} from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { useSharedValue, type SharedValue } from "react-native-reanimated";
import { type ContextBridge, FiberProvider, useContextBridge } from "its-fine";
import {
  PolarChartProvider,
  type PolarHoverPointer,
} from "./contexts/PolarChartContext";
import type {
  ColorFields,
  InputFields,
  NumericalFields,
  StringKeyOf,
  ChartHoverConfig,
  PieHoverState,
} from "../types";
import { type ChartTransformState } from "../cartesian/hooks/useChartTransformState";
import {
  panTransformGesture,
  pinchTransformGesture,
} from "../cartesian/utils/transformGestures";
import { getCartesianTouchCoordinates } from "../cartesian/utils/getCartesianTouchCoordinates";
import { GestureHandler } from "../shared/GestureHandler";
import { applyChartHoverConfig } from "../shared/applyChartHoverConfig";
import { type ChartExplicitSize } from "../shared/ChartExplicitSize";
import { type ChartLayoutModeProps } from "../shared/ChartLayoutModeProps";
import { ChartWrapper } from "../shared/ChartWrapper";
import { useChartCanvasSize } from "../shared/useChartCanvasSize";

type PolarChartBaseProps = {
  onLayout: ({ nativeEvent: { layout } }: LayoutChangeEvent) => void;
  hasMeasuredLayoutSize: boolean;
  canvasSize: { width: number; height: number };
  containerStyle?: StyleProp<ViewStyle>;
  canvasStyle?: StyleProp<ViewStyle>;
  transformState?: ChartTransformState;
  isHeadless: boolean;
  explicitSize?: ChartExplicitSize;
  enableHover?: boolean;
  hoverPointer: SharedValue<PolarHoverPointer>;
  chartHoverConfig?: ChartHoverConfig;
};

const PolarChartBase = (
  props: React.PropsWithChildren<PolarChartBaseProps>,
) => {
  const {
    containerStyle,
    canvasStyle,
    children,
    onLayout,
    hasMeasuredLayoutSize,
    canvasSize,
    transformState,
    isHeadless,
    explicitSize,
    enableHover: enableHoverProp,
    hoverPointer,
    chartHoverConfig,
  } = props;
  // Hover is aimed at pointer devices; it's enabled by default on web, where
  // a mouse or trackpad is the norm. Elsewhere (and when explicitly set to
  // `false` on web) it stays opt-in.
  const enableHover = enableHoverProp ?? Platform.OS === "web";
  const Bridge: ContextBridge = useContextBridge();

  let composed = Gesture.Race();
  if (transformState) {
    composed = Gesture.Race(
      composed,
      pinchTransformGesture(transformState),
      panTransformGesture(transformState),
    );
  }

  const hoverGesture = Gesture.Hover()
    .onStart((e) => {
      hoverPointer.value = getCartesianTouchCoordinates({
        touch: e,
        transform: transformState?.matrix.value,
      });
    })
    .onUpdate((e) => {
      hoverPointer.value = getCartesianTouchCoordinates({
        touch: e,
        transform: transformState?.matrix.value,
      });
    })
    .onEnd(() => {
      hoverPointer.value = null;
    })
    .onFinalize(() => {
      hoverPointer.value = null;
    });

  applyChartHoverConfig({
    gesture: hoverGesture,
    hoverConfig: chartHoverConfig,
  });

  if (enableHover) {
    composed = Gesture.Simultaneous(composed, hoverGesture);
  }

  const chartContent = (
    <Group matrix={transformState?.matrix}>
      {hasMeasuredLayoutSize && children}
    </Group>
  );

  return (
    <ChartWrapper
      isHeadless={isHeadless}
      explicitSize={explicitSize}
      onLayout={onLayout}
      hasMeasuredLayoutSize={hasMeasuredLayoutSize}
      canvasSize={canvasSize}
      containerStyle={containerStyle}
      canvasStyle={canvasStyle}
      chartContent={chartContent}
      wrapCanvasContent={
        isHeadless ? undefined : (content) => <Bridge>{content}</Bridge>
      }
      gestureOverlay={
        isHeadless ? undefined : <GestureHandler gesture={composed} />
      }
    />
  );
};

type PolarChartProps<
  RawData extends Record<string, unknown>,
  LabelKey extends StringKeyOf<InputFields<RawData>>,
  ValueKey extends StringKeyOf<NumericalFields<RawData>>,
  ColorKey extends StringKeyOf<ColorFields<RawData>>,
> = {
  data: RawData[];
  colorKey: ColorKey;
  labelKey: LabelKey;
  valueKey: ValueKey;
  enableHover?: boolean;
  chartHoverState?: PieHoverState;
  chartHoverConfig?: ChartHoverConfig;
} & ChartLayoutModeProps &
  Omit<
    PolarChartBaseProps,
    | "canvasSize"
    | "onLayout"
    | "hasMeasuredLayoutSize"
    | "isHeadless"
    | "hoverPointer"
  >;
export const PolarChart = <
  RawData extends Record<string, unknown>,
  LabelKey extends StringKeyOf<InputFields<RawData>>,
  ValueKey extends StringKeyOf<NumericalFields<RawData>>,
  ColorKey extends StringKeyOf<ColorFields<RawData>>,
>(
  props: React.PropsWithChildren<
    PolarChartProps<RawData, LabelKey, ValueKey, ColorKey>
  >,
) => {
  const { data, labelKey, colorKey, valueKey } = props;

  const {
    size: canvasSize,
    hasMeasuredLayoutSize,
    onLayout,
    isHeadless,
  } = useChartCanvasSize({
    explicitSize: props.explicitSize,
    headless: props.headless,
  });

  const hoverPointer = useSharedValue<PolarHoverPointer>(null);
  // Pie/donut charts always have a hover state to drive; the `chartHoverState`
  // prop only overrides it for consumers that need the value off-thread, e.g.
  // readouts rendered outside the chart. Other consumers read the default
  // through `usePieHoverState()`.
  const defaultHoverIndex = useSharedValue(-1);
  const chartHoverState = props.chartHoverState ?? {
    index: defaultHoverIndex,
  };

  return (
    <FiberProvider>
      <PolarChartProvider
        data={data}
        labelKey={labelKey.toString()}
        colorKey={colorKey.toString()}
        valueKey={valueKey.toString()}
        canvasSize={canvasSize}
        hoverPointer={hoverPointer}
        chartHoverState={chartHoverState}
      >
        <PolarChartBase
          {...props}
          onLayout={onLayout}
          hasMeasuredLayoutSize={hasMeasuredLayoutSize}
          canvasSize={canvasSize}
          isHeadless={isHeadless}
          hoverPointer={hoverPointer}
        />
      </PolarChartProvider>
    </FiberProvider>
  );
};
