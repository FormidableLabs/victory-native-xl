import React from "react";
import { SimpleData } from "../components/SimpleData";
import { CartesianChart, Bar } from "victory-native-skia";
import { useChartOptionsContext } from "example/components/OptionsProvider";
import { useChartOptions } from "example/components/useChartOptions";

export default function BarPage() {
  const { state } = useChartOptionsContext();
  useChartOptions({ type: "fill" });

  return (
    <SimpleData
      renderChart={({ data }) => (
        <CartesianChart data={data}>
          <Bar fillColor={[state.color1, state.color2]} />
        </CartesianChart>
      )}
    ></SimpleData>
  );
}
