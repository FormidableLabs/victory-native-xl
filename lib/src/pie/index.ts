import { PieChart } from "./PieChart";
import { PieChartLegend } from "./PieChartLegend";
import { PieChartLegendItem } from "./PieChartLegendItem";
import { PieSlice } from "./PieSlice";
import { PieSliceInset } from "./PieSliceInset";
// import { PieSliceLabel } from "./PieSliceLabel";
import { PieSliceProvider } from "./contexts/PieSliceContext";

const Pie = {
  Chart: PieChart,
  Slice: PieSlice,
  SliceProvider: PieSliceProvider,
  SliceInset: PieSliceInset,
  // SliceLabel: PieSliceLabel,
  ChartLegend: PieChartLegend,
  ChartLegendItem: PieChartLegendItem,
};

export { Pie };
