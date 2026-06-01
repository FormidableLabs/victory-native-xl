import type * as React from "react";
import { BarGroup, Pie, StackedBar } from "victory-native";

type ComponentReturn = React.ReactElement | null;

type AssertComponentReturn<T extends ComponentReturn> = T;

export type BarGroupReturnIsComponentReturn = AssertComponentReturn<
  ReturnType<typeof BarGroup>
>;
export type StackedBarReturnIsComponentReturn = AssertComponentReturn<
  ReturnType<typeof StackedBar>
>;
export type PieChartReturnIsComponentReturn = AssertComponentReturn<
  ReturnType<typeof Pie.Chart>
>;
