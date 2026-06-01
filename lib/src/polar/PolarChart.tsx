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
  } = props;
  const Bridge: ContextBridge = useContextBridge();

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

  return (
    <FiberProvider>
      <PolarChartProvider
        data={data}
        labelKey={labelKey.toString()}
        colorKey={colorKey.toString()}
        valueKey={valueKey.toString()}
        canvasSize={canvasSize}
      >
        <PolarChartBase
          {...props}
          onLayout={onLayout}
          hasMeasuredLayoutSize={hasMeasuredLayoutSize}
          canvasSize={canvasSize}
          isHeadless={isHeadless}
        />
      </PolarChartProvider>
    </FiberProvider>
  );
};
