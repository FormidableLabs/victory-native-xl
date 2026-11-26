import * as React from "react";
import { Group } from "react-native-skia";
import {
  type ViewStyle,
  type StyleProp,
  type LayoutChangeEvent,
} from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { PolarChartProvider } from "./contexts/PolarChartContext";
import type {
  ColorFields,
  InputFields,
  NumericalFields,
  StringKeyOf,
} from "../types";
import { type ChartTransformState } from "../cartesian/hooks/useChartTransformState";
import {
  panTransformGesture,
  pinchTransformGesture,
} from "../cartesian/utils/transformGestures";
import { GestureHandler } from "../shared/GestureHandler";
import { type ChartExplicitSize } from "../shared/ChartExplicitSize";
import { type ChartLayoutModeProps } from "../shared/ChartLayoutModeProps";
import { ChartWrapper } from "../shared/ChartWrapper";
import { useChartCanvasSize } from "../shared/useChartCanvasSize";
import {
  type BridgedContext,
  useContextBridge,
} from "../shared/useContextBridge";

type PolarChartBaseProps = {
  onLayout: ({ nativeEvent: { layout } }: LayoutChangeEvent) => void;
  hasMeasuredLayoutSize: boolean;
  canvasSize: { width: number; height: number };
  containerStyle?: StyleProp<ViewStyle>;
  canvasStyle?: StyleProp<ViewStyle>;
  transformState?: ChartTransformState;
  /**
   * React contexts to make available to the components rendered inside the
   * chart. The canvas is rendered by a separate React renderer, so the
   * contexts of your app are not visible inside the chart unless they are
   * listed here.
   */
  contexts?: readonly BridgedContext[];
  isHeadless: boolean;
  explicitSize?: ChartExplicitSize;
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
    contexts,
    isHeadless,
    explicitSize,
  } = props;
  const bridge = useContextBridge(contexts);

  let composed = Gesture.Race();
  if (transformState) {
    composed = Gesture.Race(
      composed,
      pinchTransformGesture(transformState),
      panTransformGesture(transformState),
    );
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
      chartContent={bridge(chartContent)}
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
} & ChartLayoutModeProps &
  Omit<
    PolarChartBaseProps,
    "canvasSize" | "onLayout" | "hasMeasuredLayoutSize" | "isHeadless"
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

  // The chart's own context is provided inside the canvas, where it is read:
  // context does not cross from the app's renderer into the canvas.
  return (
    <PolarChartBase
      {...props}
      onLayout={onLayout}
      hasMeasuredLayoutSize={hasMeasuredLayoutSize}
      canvasSize={canvasSize}
      isHeadless={isHeadless}
    >
      <PolarChartProvider
        data={data}
        labelKey={labelKey.toString()}
        colorKey={colorKey.toString()}
        valueKey={valueKey.toString()}
        canvasSize={canvasSize}
      >
        {props.children}
      </PolarChartProvider>
    </PolarChartBase>
  );
};
