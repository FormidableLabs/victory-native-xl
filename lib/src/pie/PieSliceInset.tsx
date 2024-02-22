import React from "react";
import { type Color, Path, type PathProps } from "@shopify/react-native-skia";
import { useSliceInsetPath } from "./hooks/useSliceInsetPath";
import { usePieSliceContext } from "./contexts/PieSliceContext";

export type PieSliceInsetData = {
  width: number;
  color: Color;
};

type AdditionalPathProps = Partial<Omit<PathProps, "color" | "path">>;

type PieSliceInsetProps = {
  inset: PieSliceInsetData;
} & AdditionalPathProps;

export const PieSliceInset = (props: PieSliceInsetProps) => {
  const { inset, children, ...rest } = props;
  const { slice } = usePieSliceContext();
  const [path, insetPaint] = useSliceInsetPath({ slice, inset });

  return (
    <Path path={path} paint={insetPaint} {...rest}>
      {children}
    </Path>
  );
};
