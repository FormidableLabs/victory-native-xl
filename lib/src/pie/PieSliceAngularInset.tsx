import React from "react";
import { type Color, Path, type PathProps } from "react-native-skia";
import { useSliceAngularInsetPathOnly } from "./hooks/useSliceAngularInsetPath";
import { usePieSliceContext } from "./contexts/PieSliceContext";
import type { PieSliceData } from "./PieSlice";
import type { PathAnimationConfig } from "../hooks/useAnimatedPath";
import { AnimatedPath } from "../cartesian/components/AnimatedPath";

export type PieSliceAngularInsetData = {
  angularStrokeWidth: number;
  angularStrokeColor: Color;
};

type AdditionalPathProps = Partial<Omit<PathProps, "color" | "path">> & {
  animate?: PathAnimationConfig;
};

type PieSliceAngularInsetProps = {
  angularInset: PieSliceAngularInsetData;
} & AdditionalPathProps;

const isCollapsedOnOrigin = ({ center, radius, innerRadius }: PieSliceData) =>
  !(innerRadius > 0) && radius === 0 && center.x === 0 && center.y === 0;

export const PieSliceAngularInset = (props: PieSliceAngularInsetProps) => {
  const { angularInset, children, animate, ...rest } = props;
  const { slice } = usePieSliceContext();
  const path = useSliceAngularInsetPathOnly(slice);

  // Before the chart has a size, the slice has no radius and both lines of the
  // inset collapse onto the origin: don't render anything.
  if (isCollapsedOnOrigin(slice)) {
    return null;
  }

  if (angularInset.angularStrokeWidth === 0) {
    return null;
  }

  const Component = animate ? AnimatedPath : Path;
  return (
    <Component
      path={path}
      animate={animate}
      {...rest}
      style="stroke"
      color={angularInset.angularStrokeColor}
      strokeWidth={angularInset.angularStrokeWidth}
    >
      {children}
    </Component>
  );
};
