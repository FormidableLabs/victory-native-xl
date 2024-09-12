import React, { type ReactElement, type ReactNode } from "react";
import {
  type Color,
  Path,
  type PathProps,
  type SkPoint,
} from "@shopify/react-native-skia";
import { useSlicePath } from "./hooks/useSlicePath";
import { usePieSliceContext } from "./contexts/PieSliceContext";
import type { PieLabelProps } from "./PieLabel";
import PieLabel from "./PieLabel";

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
type PieSliceProps = AdditionalPathProps & { label?: PieLabelProps };

export const PieSlice = ({ children, ...rest }: PieSliceProps) => {
  const { slice } = usePieSliceContext();
  const path = useSlicePath({ slice });

  let label;
  const childrenArray = React.Children.toArray(children);

  const labelIndex = childrenArray.findIndex(
    (child) => (child as ReactElement).type === PieLabel,
  );

  if (labelIndex > -1) {
    label = childrenArray.splice(labelIndex, 1);
  }

  return (
    <>
      <Path path={path} style="fill" color={slice.color} {...rest}>
        {childrenArray}
      </Path>
      {label}
    </>
  );
};
