import { PieChart } from "./PieChart";
import { PieChartLegend } from "./PieChartLegend";
import { PieChartLegendItem } from "./PieChartLegendItem";
import { PieSlice } from "./PieSlice";
import { PieSliceAngularInset } from "./PieSliceAngularInset";
import { PieSliceProvider } from "./contexts/PieSliceContext";

const Pie = {
  Chart: PieChart,
  Slice: PieSlice,
  SliceProvider: PieSliceProvider,
  SliceAngularInset: PieSliceAngularInset,
  ChartLegend: PieChartLegend,
  ChartLegendItem: PieChartLegendItem,
};

export { Pie };
