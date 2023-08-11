import { KeyedData } from "../utils/KeyedData";
import { CartesianChart } from "../charts/cartesian/CartesianChart";
import { Bar } from "../charts/cartesian/Bar";

export default function KeyedDataView() {
  return (
    <KeyedData
      renderChart={({ data }) => (
        <CartesianChart data={data} xKey="quarter">
          <Bar dataKey="earnings" />
          <Bar dataKey="spend" />
        </CartesianChart>
      )}
    />
  );
}
