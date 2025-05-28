import * as React from "react";
import { Canvas, Group } from "@shopify/react-native-skia";
import {
  StyleSheet,
  View,
  type ViewStyle,
  type LayoutChangeEvent,
  type StyleProp,
} from "react-native";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
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

type PolarChartBaseProps = {
  onLayout: ({ nativeEvent: { layout } }: LayoutChangeEvent) => void;
  hasMeasuredLayoutSize: boolean;
  canvasSize: { width: number; height: number };
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
    <View style={[styles.baseContainer, containerStyle]}>
      <GestureHandlerRootView style={{ flex: 1, overflow: "hidden" }}>
        <Canvas
          onLayout={onLayout}
          style={StyleSheet.flatten([
            styles.canvasContainer,
            hasMeasuredLayoutSize ? { width, height } : null,
            canvasStyle,
          ])}
        >
          <Bridge>
            <Group matrix={transformState?.matrix}>{children}</Group>
          </Bridge>
        </Canvas>
        <GestureHandler
          gesture={composed}
          dimensions={{ x: 0, y: 0, width: width, height: height }}
        />
      </GestureHandlerRootView>
    </View>
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
} & Omit<
  PolarChartBaseProps,
  "canvasSize" | "onLayout" | "hasMeasuredLayoutSize" // omit exposing internal props for calculating canvas layout/size
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

  const [canvasSize, setCanvasSize] = React.useState({ width: 0, height: 0 });

  const [hasMeasuredLayoutSize, setHasMeasuredLayoutSize] =
    React.useState(false);
  const [_, setIsCanvasReady] = React.useState(false);

  // This is a hack to ensure the canvas is ready before the chart is rendered. It seems like it started somewhere with skia 2.0.0+ or RN 79+. This could periodically be removed and see if works without it.

  React.useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    if (hasMeasuredLayoutSize) {
      timerId = setTimeout(() => {
        setIsCanvasReady(true);
      }, 100);
    }
    return () => {
      if (timerId !== null) {
        clearTimeout(timerId);
      }
    };
  }, [hasMeasuredLayoutSize]);

  const onLayout = React.useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setHasMeasuredLayoutSize(true);
      setCanvasSize(layout);
    },
    [],
  );

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
        />
      </PolarChartProvider>
    </FiberProvider>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
  },
});
