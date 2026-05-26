import * as React from "react";
import { Group } from "@shopify/react-native-skia";
import {
  type ViewStyle,
  type StyleProp,
  type LayoutChangeEvent,
} from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { type ContextBridge, FiberProvider, useContextBridge } from "its-fine";
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
import { ChartWrapper } from "../shared/ChartWrapper";
import { useChartCanvasSize } from "../shared/useChartCanvasSize";

type PolarChartBaseProps = {
  onLayout: ({ nativeEvent: { layout } }: LayoutChangeEvent) => void;
  hasMeasuredLayoutSize: boolean;
  canvasSize: { width: number; height: number };
  explicitSize?: ChartExplicitSize;
  containerStyle?: StyleProp<ViewStyle>;
  canvasStyle?: StyleProp<ViewStyle>;
  transformState?: ChartTransformState;
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
    explicitSize,
    transformState,
  } = props;
  const { width, height } = canvasSize;
  const Bridge: ContextBridge = useContextBridge();

  let composed = Gesture.Race();
  if (transformState) {
    composed = Gesture.Race(
      composed,
      pinchTransformGesture(transformState),
      panTransformGesture(transformState),
    );
  }

  return (
    <ChartWrapper
      isHeadless={false}
      explicitSize={explicitSize}
      onLayout={onLayout}
      hasMeasuredLayoutSize={hasMeasuredLayoutSize}
      canvasSize={canvasSize}
      containerVariant="polar"
      containerStyle={containerStyle}
      canvasStyle={canvasStyle}
      chartContent={
        <Group matrix={transformState?.matrix}>
          {hasMeasuredLayoutSize && children}
        </Group>
      }
      wrapCanvasContent={(content) => <Bridge>{content}</Bridge>}
      gestureOverlay={
        <GestureHandler
          gesture={composed}
          dimensions={{ x: 0, y: 0, width, height }}
        />
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
  /**
   * When provided, initializes chart dimensions without waiting for React Native
   * `onLayout`. Required when using `headless`.
   */
  explicitSize?: ChartExplicitSize;
  /**
   * When `true` (with `explicitSize`), renders a Skia-only subtree suitable for
   * headless renderers that cannot mount React Native views.
   */
  headless?: boolean;
} & Omit<
  PolarChartBaseProps,
  "canvasSize" | "onLayout" | "hasMeasuredLayoutSize" | "explicitSize"
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
  const {
    data,
    labelKey,
    colorKey,
    valueKey,
    explicitSize,
    headless,
    transformState,
    children,
    ...rest
  } = props;

  const {
    size: canvasSize,
    hasMeasuredLayoutSize,
    onLayout,
    isHeadless,
  } = useChartCanvasSize({ explicitSize, headless });

  const providerProps = {
    data,
    labelKey: labelKey.toString(),
    colorKey: colorKey.toString(),
    valueKey: valueKey.toString(),
    canvasSize,
  };

  if (isHeadless) {
    return (
      <FiberProvider>
        <PolarChartProvider {...providerProps}>
          <ChartWrapper
            isHeadless
            explicitSize={explicitSize}
            onLayout={onLayout}
            hasMeasuredLayoutSize={hasMeasuredLayoutSize}
            canvasSize={canvasSize}
            containerVariant="polar"
            chartContent={
              <Group matrix={transformState?.matrix}>
                {hasMeasuredLayoutSize && children}
              </Group>
            }
          />
        </PolarChartProvider>
      </FiberProvider>
    );
  }

  return (
    <FiberProvider>
      <PolarChartProvider {...providerProps}>
        <PolarChartBase
          {...rest}
          explicitSize={explicitSize}
          onLayout={onLayout}
          hasMeasuredLayoutSize={hasMeasuredLayoutSize}
          canvasSize={canvasSize}
          transformState={transformState}
        >
          {children}
        </PolarChartBase>
      </PolarChartProvider>
    </FiberProvider>
  );
};
