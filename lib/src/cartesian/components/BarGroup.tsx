import * as React from "react";
import { Path, type PathProps, type SkPath } from "@shopify/react-native-skia";
import type { ChartBounds, PointsArray } from "../../types";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";
import { AnimatedPath } from "./AnimatedPath";
import { useBarGroupPaths } from "../hooks/useBarGroupPaths";

type BarGroupProps = {
  chartBounds: ChartBounds;
  betweenGroupPadding?: number;
  withinGroupPadding?: number;
  children: React.ReactElement[];
  onBarSizeChange?: (values: {
    barWidth: number;
    groupWidth: number;
    gapWidth: number;
  }) => void;
};

export function BarGroup({
  betweenGroupPadding = 0.25,
  withinGroupPadding = 0.25,
  chartBounds,
  children,
  onBarSizeChange,
}: BarGroupProps) {
  // Collect the bar props
  const bars = [] as BarGroupBarProps[];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === BarGroupBar) {
        bars.push(child.props as BarGroupBarProps);
      }
    }
  });
  const { paths, barWidth, groupWidth, gapWidth } = useBarGroupPaths(
    bars.map((bar) => bar.points),
    chartBounds,
    betweenGroupPadding,
    withinGroupPadding,
  );

  // Handle bar size change
  const onBarSizeChangeRef = React.useRef(onBarSizeChange);
  React.useEffect(() => {
    onBarSizeChangeRef.current = onBarSizeChange;
  }, [onBarSizeChange]);
  React.useEffect(() => {
    onBarSizeChangeRef.current?.({ barWidth, groupWidth, gapWidth });
  }, [barWidth, gapWidth, groupWidth]);

  // If no bars, short-circuit
  const firstBar = bars[0];
  if (!firstBar) return null;

  return bars.map((props, i) =>
    React.createElement(BarGroupBar, {
      ...props,
      // @ts-ignore
      __path: paths[i],
      key: i,
    }),
  );
}
BarGroup.Bar = BarGroupBar;

/**
 * Bar
 */
type BarGroupBarProps = {
  points: PointsArray;
  animate?: PathAnimationConfig;
} & Partial<Pick<PathProps, "color">>;
function BarGroupBar(props: React.PropsWithChildren<BarGroupBarProps>) {
  const { animate, ...rest } = props;

  // Props that come from BarGroup but aren't exposed publicly.
  // @ts-ignore
  const path = props.__path as SkPath;

  return React.createElement(animate ? AnimatedPath : Path, {
    path,
    style: "fill",
    color: "red",
    ...rest,
    ...(Boolean(animate) && { animate }),
  });
}
