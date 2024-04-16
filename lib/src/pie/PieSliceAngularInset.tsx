import React from "react";
import { type Color, Path, type PathProps } from "@shopify/react-native-skia";
import { useSliceAngularInsetPath } from "./hooks/useSliceAngularInsetPath";
import { usePieSliceContext } from "./contexts/PieSliceContext";

export type PieSliceAngularInsetData = {
  angularStrokeWidth: number;
  angularStrokeColor: Color;
};

type AdditionalPathProps = Partial<Omit<PathProps, "color" | "path">>;

type PieSliceAngularInsetProps = {
  angularInset: PieSliceAngularInsetData;
} & AdditionalPathProps;

export const PieSliceAngularInset = (props: PieSliceAngularInsetProps) => {
  const { angularInset, children, ...rest } = props;
  const { slice } = usePieSliceContext();
  const [path, insetPaint] = useSliceAngularInsetPath({ slice, angularInset });

  if (angularInset.angularStrokeWidth === 0) {
    return null;
  }

  return (
    <Path path={path} paint={insetPaint} {...rest}>
      {children}
    </Path>
  );
};
