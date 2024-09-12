import { PieChart } from "./PieChart";
import PieLabel from "./PieLabel";
import { PieSlice, type PieSliceData } from "./PieSlice";
import { PieSliceAngularInset } from "./PieSliceAngularInset";

const Pie = {
  Chart: PieChart,
  Slice: PieSlice,
  Label: PieLabel,
  SliceAngularInset: PieSliceAngularInset,
};

export { Pie, type PieSliceData };
