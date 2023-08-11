import { CartesianChart } from "../charts/cartesian/CartesianChart";
import { Scatter } from "../charts/cartesian/Scatter";
import { SimpleData } from "../utils/SimpleData";

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
