import React from "react";
import { CartesianChart, Scatter } from "victory-native-skia";
import { SimpleData } from "../components/SimpleData";
import { useChartOptionsContext } from "example/components/OptionsProvider";
import { useChartOptions } from "example/components/useChartOptions";

export default function ScatterPage() {
  const { state } = useChartOptionsContext();
  useChartOptions({ type: "fill" });

  return (
    <SimpleData
      renderChart={({ data }) => (
        <CartesianChart data={data}>
          <Scatter fillColor={[state.color1, state.color2]} />
        </CartesianChart>
      )}
    ></SimpleData>
  );
}
