import * as React from "react";
import { SimpleData } from "../components/SimpleData";
import { CartesianChart, Line, XAxis } from "victory-native-skia";

export default function AxesPage() {
  return (
    <SimpleData
      renderChart={({ data }) => (
        <CartesianChart data={data}>
          <Line />
          <XAxis />
        </CartesianChart>
      )}
    />
  );
}
