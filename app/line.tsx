import { CartesianChart } from "../charts/cartesian/CartesianChart";
import { Line } from "../charts/cartesian/Line";
import { SimpleData } from "../utils/SimpleData";

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
