import * as React from "react";
import { Canvas, vec, type Color } from "@shopify/react-native-skia";
import {
  StyleSheet,
  View,
  type ViewStyle,
  type LayoutChangeEvent,
  type StyleProp,
} from "react-native";
import type { ColorFields, InputFields, NumericalFields } from "../types";
import { PieSlice, type PieSliceData } from "./PieSlice";
import {
  PieChartProvider,
  usePieChartContext,
} from "./contexts/PieChartContext";
import { handleTranslateInnerRadius } from "./utils/innerRadius";
import { PieSliceProvider } from "./contexts/PieSliceContext";

const CIRCLE_SWEEP_DEGREES = 360;

type PieChartProps<
  RawData extends Record<string, unknown>,
  LabelKey extends keyof InputFields<RawData>,
  ValueKey extends keyof NumericalFields<RawData>,
  ColorKey extends keyof ColorFields<RawData>,
> = {
  children?: (args: { slice: PieSliceData }) => React.ReactNode;
  colorKey: ColorKey;
  containerStyle?: StyleProp<ViewStyle>;
  canvasStyle?: StyleProp<ViewStyle>;
  data: RawData[];
  labelKey: LabelKey;
  renderLegend?: (data: PieSliceData[]) => React.ReactNode;
  valueKey: ValueKey;
  innerRadius?: number | string;
  onLayout: ({ nativeEvent: { layout } }: LayoutChangeEvent) => void;
  hasMeasuredLayoutSize: boolean;
  canvasSize: { width: number; height: number };
};

const PieChartBase = <
  RawData extends Record<string, unknown>,
  LabelKey extends keyof InputFields<RawData>,
  ValueKey extends keyof NumericalFields<RawData>,
  ColorKey extends keyof ColorFields<RawData>,
>(
  props: PieChartProps<RawData, LabelKey, ValueKey, ColorKey>,
) => {
  const {
    containerStyle,
    data: _data,
    canvasStyle,
    renderLegend,
    children,
    onLayout,
    hasMeasuredLayoutSize,
    canvasSize,
  } = props;
  const { width, height } = canvasSize;

  const { data, position: legendPosition } = usePieChartContext();

  // Determine the container's flexDirection based on the legend's position prop
  const baseFlexDirection =
    legendPosition === "left" || legendPosition === "right" ? "row" : "column";
  const isReverse = legendPosition === "left" || legendPosition === "top";
  const dynamicStyle: ViewStyle = {
    flexDirection: isReverse
      ? `${baseFlexDirection}-reverse`
      : baseFlexDirection,
  };

  return (
    <View style={[styles.baseContainer, dynamicStyle, containerStyle]}>
      <Canvas
        onLayout={onLayout}
        style={[
          styles.canvasContainer,
          hasMeasuredLayoutSize ? { width, height } : null,
          canvasStyle,
        ]}
      >
        {data.map((slice, index) => {
          return (
            <PieSliceProvider key={index} slice={slice}>
              {children ? children({ slice }) : <PieSlice />}
            </PieSliceProvider>
          );
        })}
      </Canvas>
      {renderLegend?.(data)}
    </View>
  );
};

export const PieChart = <
  RawData extends Record<string, unknown>,
  LabelKey extends keyof InputFields<RawData>,
  ValueKey extends keyof NumericalFields<RawData>,
  ColorKey extends keyof ColorFields<RawData>,
>(
  props: Omit<
    PieChartProps<RawData, LabelKey, ValueKey, ColorKey>,
    "canvasSize" | "onLayout" | "hasMeasuredLayoutSize" // omit exposing internal props for calculating canvas layout/size
  >,
) => {
  const { data: _data, labelKey, valueKey, colorKey, innerRadius = 0 } = props;
  const label = labelKey as keyof RawData;

  // The sum all the slices' values
  const totalCircleValue = _data.reduce(
    (sum, entry) => sum + Number(entry[valueKey]),
    0,
  );

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

  const { width, height } = canvasSize; // Get the dynamic canvas size
  const radius = Math.min(width, height) / 2; // Calculate the radius based on canvas size
  const center = vec(width / 2, height / 2);

  const data = React.useMemo(() => {
    let startAngle = 0; // Initialize the start angle for the first slice

    const enhanced = _data.map((datum): PieSliceData => {
      const sliceValue = datum[valueKey] as number;
      const sliceLabel = datum[label] as string;
      const sliceColor = datum[colorKey] as Color;

      const initialStartAngle = startAngle; // grab the initial start angle
      const sweepAngle = (sliceValue / totalCircleValue) * CIRCLE_SWEEP_DEGREES; // Calculate the sweep angle for the slice as a part of the entire pie
      const endAngle = initialStartAngle + sweepAngle; // the sum of sweep + start

      startAngle += sweepAngle; // the next startAngle is the accumulation of each sweep
      return {
        value: sliceValue,
        label: sliceLabel,
        color: sliceColor,
        innerRadius: handleTranslateInnerRadius(innerRadius, radius),
        startAngle: initialStartAngle,
        endAngle: endAngle,
        sweepAngle,
        sliceIsEntireCircle: _data.length === 1,
        radius,
        center,
      };
    });

    return enhanced;
  }, [
    valueKey,
    _data,
    totalCircleValue,
    colorKey,
    label,
    radius,
    center,
    innerRadius,
  ]);

  return (
    <PieChartProvider data={data}>
      <PieChartBase
        {...props}
        onLayout={onLayout}
        hasMeasuredLayoutSize={hasMeasuredLayoutSize}
        canvasSize={canvasSize}
      />
    </PieChartProvider>
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
