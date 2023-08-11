import * as React from "react";
import { SimpleData } from "../components/SimpleData";
import { CartesianChart, Bar } from "victory-native-skia";

export default function BarPage() {
  return (
    <SimpleData
      renderChart={({ data }) => (
        <CartesianChart data={data}>
          <Bar />
        </CartesianChart>
      )}
    ></SimpleData>
  );
}
