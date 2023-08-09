import { Text } from "react-native";
import { SimpleData } from "../utils/SimpleData";
import { CartesianChart } from "../charts/cartesian/CartesianChart";
import { Bar } from "../charts/cartesian/Bar";

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
