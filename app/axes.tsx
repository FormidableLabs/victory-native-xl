import { SimpleData } from "../utils/SimpleData";
import { CartesianChart } from "../charts/cartesian/CartesianChart";
import { Line } from "../charts/cartesian/Line";
import { XAxis } from "../charts/cartesian/XAxis";

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
