import * as React from "react";
import { Canvas, type Color } from "@shopify/react-native-skia";
import { StyleSheet, useWindowDimensions } from "react-native";
import type { ColorFields, InputFields, NumericalFields } from "../types";
import { type PieSliceData } from "./PieSlice";

const CIRCLE_SWEEP_DEGREES = 360;

type PieChartProps<
  RawData extends Record<string, unknown>,
  LabelKey extends keyof InputFields<RawData>,
  ValueKey extends keyof NumericalFields<RawData>,
  ColorKey extends keyof ColorFields<RawData>,
> = {
  data: RawData[];
  labelKey: LabelKey;
  valueKey: ValueKey;
  colorKey: ColorKey;
  size?: number;
  children: (args: { slice: PieSliceData; size: number }) => React.ReactNode;
};

export const PieChart = <
  RawData extends Record<string, unknown>,
  LabelKey extends keyof InputFields<RawData>,
  ValueKey extends keyof NumericalFields<RawData>,
  ColorKey extends keyof ColorFields<RawData>,
>(
  props: PieChartProps<RawData, LabelKey, ValueKey, ColorKey>,
) => {
  const { width } = useWindowDimensions();

  const {
    size = width * 0.8,
    data: _data,
    labelKey,
    valueKey,
    colorKey,
    children,
  } = props;

  const label = labelKey as keyof RawData;

  const totalCircleValue = _data.reduce(
    (sum, entry) => sum + Number(entry[valueKey]),
    0,
  ); // The sum all the slices' values

  const data = React.useMemo(() => {
    let startAngle = 0; // Initialize the start angle for the first slice

    const enhanced: PieSliceData[] = _data.map((datum) => {
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
        startAngle: initialStartAngle,
        endAngle: endAngle,
        sweepAngle,
        sliceIsEntireCircle: _data.length === 1,
      };
    });

    return enhanced;
  }, [valueKey, _data, totalCircleValue, colorKey, label]);

  return (
    <Canvas style={[styles.container, { width: size, height: size }]}>
      {data.map((slice, index) => {
        return (
          <React.Fragment key={index}>
            {children({ size, slice })}
          </React.Fragment>
        );
      })}
    </Canvas>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
