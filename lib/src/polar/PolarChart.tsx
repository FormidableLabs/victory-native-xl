import * as React from "react";
import { Canvas } from "@shopify/react-native-skia";
import {
  StyleSheet,
  View,
  type ViewStyle,
  type LayoutChangeEvent,
  type StyleProp,
} from "react-native";
import {
  PolarChartProvider,
  usePolarChartContext,
} from "./contexts/PolarChartContext";
import type {
  ColorFields,
  InputFields,
  NumericalFields,
  StringKeyOf,
} from "../types";

type PolarChartBaseProps = {
  onLayout: ({ nativeEvent: { layout } }: LayoutChangeEvent) => void;
  hasMeasuredLayoutSize: boolean;
  canvasSize: { width: number; height: number };
  containerStyle?: StyleProp<ViewStyle>;
  canvasStyle?: StyleProp<ViewStyle>;
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
  } = props;
  const { width, height } = canvasSize;

  const ctx = usePolarChartContext();

  return (
    <View style={[styles.baseContainer, {}, containerStyle]}>
      <Canvas
        onLayout={onLayout}
        style={[
          styles.canvasContainer,
          hasMeasuredLayoutSize ? { width, height } : null,
          canvasStyle,
        ]}
      >
        {/* https://shopify.github.io/react-native-skia/docs/canvas/contexts/
            we have to re-inject our context to make it available in the skia renderer
         */}
        <PolarChartProvider {...ctx} canvasSize={canvasSize}>
          {children}
        </PolarChartProvider>
      </Canvas>
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

  const onLayout = React.useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setHasMeasuredLayoutSize(true);
      setCanvasSize(layout);
    },
    [],
  );

  return (
    <PolarChartProvider
      data={data}
      labelKey={labelKey}
      colorKey={colorKey}
      valueKey={valueKey}
      canvasSize={canvasSize}
    >
      <PolarChartBase
        {...props}
        onLayout={onLayout}
        hasMeasuredLayoutSize={hasMeasuredLayoutSize}
        canvasSize={canvasSize}
      />
    </PolarChartProvider>
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
