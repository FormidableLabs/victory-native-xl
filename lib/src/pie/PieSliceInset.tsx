import React from "react";
import { type Color, Path, type PathProps } from "@shopify/react-native-skia";
import type { PieSliceData } from "./PieSlice";
import { useSliceInsetPath } from "./hooks/useSliceInsetPath";

export type PieSliceInsetData = {
  width: number;
  color: Color;
};

type AdditionalPathProps = Partial<Omit<PathProps, "color" | "path">>;

type PieSliceInsetProps = {
  slice: PieSliceData;
  size: number;
  inset: PieSliceInsetData;
} & AdditionalPathProps;

export const PieSliceInset = (props: PieSliceInsetProps) => {
  const { size, slice, inset, ...rest } = props;
  const [path, insetPaint] = useSliceInsetPath({ size, slice, inset });

  return <Path path={path} paint={insetPaint} {...rest} />;
};
