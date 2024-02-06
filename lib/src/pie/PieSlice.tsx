import React from "react";
import { type Color, Path, type PathProps } from "@shopify/react-native-skia";
import { useSlicePath } from "./hooks/useSlicePath";

export type PieSliceData = {
  value: number;
  label: string;
  color: Color;
  startAngle: number;
  endAngle: number;
  sweepAngle: number;
  sliceIsEntireCircle: boolean;
};

type AdditionalPathProps = Partial<Omit<PathProps, "color" | "path">>;

type PieSliceProps = {
  slice: PieSliceData;
  size: number;
} & AdditionalPathProps;

export const PieSlice = (props: PieSliceProps) => {
  const { size, slice, ...rest } = props;
  const path = useSlicePath({ size, slice });

  return <Path path={path} color={slice.color} style="fill" {...rest} />;
};
