import React from "react";
import { CartesianChart, Line } from "victory-native-skia";
import { SimpleData } from "../components/SimpleData";
import { useChartOptions } from "../components/useChartOptions";
import { useChartOptionsContext } from "../components/OptionsProvider";

export default function LinePage() {
  const { state } = useChartOptionsContext();
  useChartOptions({ type: "stroke" });

  return (
    <SimpleData
      renderChart={({ data }) => (
        <CartesianChart data={data}>
          <Line strokeColor={state.color1} strokeWidth={state.strokeWidth} />
        </CartesianChart>
      )}
    ></SimpleData>
  );
}
