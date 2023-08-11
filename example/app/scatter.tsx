import * as React from "react";
import { CartesianChart, Scatter } from "victory-native-skia";
import { SimpleData } from "../components/SimpleData";

export default function ScatterPage() {
  return (
    <SimpleData
      renderChart={({ data }) => (
        <CartesianChart data={data}>
          <Scatter />
        </CartesianChart>
      )}
    ></SimpleData>
  );
}
