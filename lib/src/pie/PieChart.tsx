import * as React from "react";
import { vec, type Color } from "@shopify/react-native-skia";
import { PieSlice, type PieSliceData } from "./PieSlice";
import { handleTranslateInnerRadius } from "./utils/innerRadius";
import { PieSliceProvider } from "./contexts/PieSliceContext";
import { usePolarChartContext } from "../polar/contexts/PolarChartContext";

const CIRCLE_SWEEP_DEGREES = 360;

type PieChartProps = {
  children?: (args: { slice: PieSliceData }) => React.ReactNode;
  innerRadius?: number | string;
  circleSweepDegrees?: number;
  startAngle?: number;
  size?: number;
};

export const PieChart = (props: PieChartProps) => {
  const {
    innerRadius = 0,
    circleSweepDegrees = CIRCLE_SWEEP_DEGREES,
    startAngle: _startAngle = 0,
    children,
    size,
  } = props;
  const {
    canvasSize,
    data: _data,
    labelKey,
    valueKey,
    colorKey,
  } = usePolarChartContext();

  // The sum all the slices' values
  const totalCircleValue = _data.reduce(
    (sum, entry) => sum + Number(entry[valueKey]),
    0,
  );

  const width = size ?? canvasSize.width; // Get the dynamic canvas size
  const height = size ?? canvasSize.height; // Get the dynamic canvas size

  // The size of the chart will need to be adjusted if the labels are positioned outside the chart.
  // ie we need to decrease the Pie Charts radius to account for the labels so the labels don't get cut off.
  const radius = Math.min(width, height) / 2; // Calculate the radius based on canvas size
  const center = vec(canvasSize.width / 2, canvasSize.height / 2);

  const data = React.useMemo(() => {
    let startAngle = _startAngle; // Initialize the start angle for the first slice

    const enhanced = _data.map((datum): PieSliceData => {
      const sliceValue = datum[valueKey] as number;
      const sliceLabel = datum[labelKey] as string;
      const sliceColor = datum[colorKey] as Color;

      const initialStartAngle = startAngle; // grab the initial start angle
      const sweepAngle = (sliceValue / totalCircleValue) * circleSweepDegrees; // Calculate the sweep angle for the slice as a part of the entire pie
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
        sliceIsEntireCircle:
          sweepAngle === CIRCLE_SWEEP_DEGREES || _data.length === 1,
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
    labelKey,
    radius,
    center,
    innerRadius,
    circleSweepDegrees,
    _startAngle,
  ]);

  return data.map((slice, index) => {
    return (
      <PieSliceProvider key={index} slice={slice}>
        {children ? children({ slice }) : <PieSlice />}
      </PieSliceProvider>
    );
  });
};
