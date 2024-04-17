import React from "react";
import {
  type Color,
  Path,
  type PathProps,
  type SkPoint,
} from "@shopify/react-native-skia";
import { useSlicePath } from "./hooks/useSlicePath";
import { usePieSliceContext } from "./contexts/PieSliceContext";

export type PieSliceData = {
  center: SkPoint;
  color: Color;
  endAngle: number;
  innerRadius: number;
  label: string;
  radius: number;
  sliceIsEntireCircle: boolean;
  startAngle: number;
  sweepAngle: number;
  value: number;
};

type AdditionalPathProps = Partial<Omit<PathProps, "color" | "path">>;
type PieSliceProps = AdditionalPathProps;

export const PieSlice = (props: PieSliceProps) => {
  const { children, ...rest } = props;
  const { slice } = usePieSliceContext();

  const path = useSlicePath({ slice });

  return (
    <Path path={path} color={slice.color} style="fill" {...rest}>
      {children}
    </Path>
  );
};
