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
import {
  useChartCanvasSize,
  type ChartCanvasSize,
} from "../shared/useChartCanvasSize";

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
  containerStyle?: StyleProp<ViewStyle>;
  canvasStyle?: StyleProp<ViewStyle>;
  transformState?: ChartTransformState;
} & ChartLayoutModeProps;

type PolarChartBaseProps = {
  isHeadless: boolean;
  explicitSize?: ChartExplicitSize;
  onLayout: (e: LayoutChangeEvent) => void;
  hasMeasuredLayoutSize: boolean;
  canvasSize: ChartCanvasSize;
  containerStyle?: StyleProp<ViewStyle>;
  canvasStyle?: StyleProp<ViewStyle>;
  transformState?: ChartTransformState;
  children: React.ReactNode;
};

/** Renders chart shell; must be a child of {@link FiberProvider} for context bridge. */
const PolarChartBase = ({
  isHeadless,
  explicitSize,
  onLayout,
  hasMeasuredLayoutSize,
  canvasSize,
  containerStyle,
  canvasStyle,
  transformState,
  children,
}: PolarChartBaseProps) => {
  const { width, height } = canvasSize;
  const Bridge: ContextBridge = useContextBridge();

  const chartContent = (
    <Group matrix={transformState?.matrix}>
      {hasMeasuredLayoutSize && children}
    </Group>
  );

  let gestureOverlay: React.ReactNode;
  if (!isHeadless) {
    let composed = Gesture.Race();
    if (transformState) {
      composed = Gesture.Race(
        composed,
        pinchTransformGesture(transformState),
        panTransformGesture(transformState),
      );
    }

    gestureOverlay = (
      <GestureHandler
        gesture={composed}
        dimensions={{ x: 0, y: 0, width, height }}
      />
    );
  }

  return (
    <ChartWrapper
      isHeadless={isHeadless}
      explicitSize={explicitSize}
      onLayout={onLayout}
      hasMeasuredLayoutSize={hasMeasuredLayoutSize}
      canvasSize={canvasSize}
      containerVariant="polar"
      containerStyle={containerStyle}
      canvasStyle={canvasStyle}
      chartContent={chartContent}
      wrapCanvasContent={
        isHeadless ? undefined : (content) => <Bridge>{content}</Bridge>
      }
      gestureOverlay={gestureOverlay}
    />
  );
};

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
    containerStyle,
    canvasStyle,
    children,
  } = props;

  const {
    size: canvasSize,
    hasMeasuredLayoutSize,
    onLayout,
    isHeadless,
  } = useChartCanvasSize({ explicitSize, headless });

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
          isHeadless={isHeadless}
          explicitSize={explicitSize}
          onLayout={onLayout}
          hasMeasuredLayoutSize={hasMeasuredLayoutSize}
          canvasSize={canvasSize}
          containerStyle={containerStyle}
          canvasStyle={canvasStyle}
          transformState={transformState}
        >
          {children}
        </PolarChartBase>
      </PolarChartProvider>
    </FiberProvider>
  );
};
