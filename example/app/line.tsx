import * as React from "react";
import { CartesianChart, Line } from "victory-native-skia";
import { SimpleData } from "../components/SimpleData";

export default function LinePage() {
  return (
    <SimpleData
      renderChart={({ data }) => (
        <CartesianChart data={data}>
          <Line />
        </CartesianChart>
      )}
    ></SimpleData>
  );
}
