import { PieChart } from "./PieChart";
import { PieSlice, type PieSliceData } from "./PieSlice";
import { PieSliceAngularInset } from "./PieSliceAngularInset";

const Pie = {
  Chart: PieChart,
  Slice: PieSlice,
  SliceAngularInset: PieSliceAngularInset,
};

export { Pie, type PieSliceData };
