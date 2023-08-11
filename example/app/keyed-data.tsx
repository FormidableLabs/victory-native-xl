import * as React from "react";
import { KeyedData } from "../components/KeyedData";
import { CartesianChart, Bar, Line } from "victory-native-skia";

export default function KeyedDataView() {
  return (
    <KeyedData
      renderChart={({ data }) => (
        <CartesianChart data={data} xKey="quarter">
          <Bar dataKey="earnings" color="red" />
          <Line dataKey="spend" />
        </CartesianChart>
      )}
    />
  );
}
