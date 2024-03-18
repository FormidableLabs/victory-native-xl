import { PieChart } from "./PieChart";
import { PieSlice } from "./PieSlice";
import { PieSliceAngularInset } from "./PieSliceAngularInset";
import { PieSliceProvider } from "./contexts/PieSliceContext";

const Pie = {
  Chart: PieChart,
  Slice: PieSlice,
  SliceProvider: PieSliceProvider,
  SliceAngularInset: PieSliceAngularInset,
};

export { Pie };
