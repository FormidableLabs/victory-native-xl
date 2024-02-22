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
  value: number;
  label: string;
  color: Color;
  startAngle: number;
  endAngle: number;
  sweepAngle: number;
  sliceIsEntireCircle: boolean;
  radius: number;
  center: SkPoint;
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
