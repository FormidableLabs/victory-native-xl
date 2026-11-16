import * as React from "react";
import { type Color } from "react-native-skia";
import { useAnimatedReaction } from "react-native-reanimated";
import { PieSlice, type PieSliceData } from "./PieSlice";
import { handleTranslateInnerRadius } from "./utils/innerRadius";
import { getHoveredPieSliceIndex } from "./utils/getHoveredPieSliceIndex";
import { getPieLayout } from "./utils/pieLayout";
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

  const { center, radius } = getPieLayout({ canvasSize, size });

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

  const { hoverPointer, chartHoverState } = usePolarChartContext();
  // The pointer may sit over stale geometry after a data change; reset the hover index.
  React.useEffect(() => {
    chartHoverState.index.value = -1;
    // Keyed only on data: `chartHoverState` is commonly inline (`{{ index }}`)
    // and would reset hover on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_data]);
  useAnimatedReaction(
    () => hoverPointer?.value ?? null,
    (pointer) => {
      "worklet";
      chartHoverState.index.value = getHoveredPieSliceIndex({
        pointer,
        center,
        radius,
        circleSweepDegrees,
        startAngle: _startAngle,
        slices: data,
      });
    },
  );

  return (
    <>
      {data.map((slice, index) => {
        return (
          <PieSliceProvider key={index} slice={slice}>
            {children ? children({ slice }) : <PieSlice />}
          </PieSliceProvider>
        );
      })}
    </>
  );
};
