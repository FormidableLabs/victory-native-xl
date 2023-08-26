import * as React from "react";
import type { ChartBounds, PointsArray } from "../../types";
import { Path, PathProps, Skia } from "@shopify/react-native-skia";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";
import { AnimatedPath } from "./AnimatedPath";

type BarGroupProps = {
  chartBounds: ChartBounds;
  innerPadding?: number;
  groupInnerPadding?: number;
  children: React.ReactElement[];
};

export function BarGroup({
  innerPadding = 0.25,
  groupInnerPadding = 0.25,
  chartBounds,
  children,
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

  // If no bars, short-circuit
  const firstBar = bars[0];
  if (!firstBar) return null;

  const groupWidth =
    ((1 - innerPadding) * (chartBounds.right - chartBounds.left)) /
    firstBar.points.length;
  const barWidth = ((1 - groupInnerPadding) * groupWidth) / bars.length;
  const gapWidth = (groupWidth - barWidth * bars.length) / (bars.length - 1);

  return bars.map((props, i) =>
    React.createElement(BarGroupBar, {
      ...props,
      // @ts-ignore
      __barWidth: barWidth,
      __bottom: chartBounds.bottom,
      __offset: -groupWidth / 2 + i * (barWidth + gapWidth),
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
  const { points, animate, ...rest } = props;
  const barWidth = props.__barWidth as number;
  const bottom = props.__bottom as number;
  const offset = props.__offset as number;

  const path = React.useMemo(() => {
    const p = Skia.Path.Make();

    points.forEach(({ x, y }) => {
      p.addRect(Skia.XYWHRect(x + offset, y, barWidth, bottom - y));
    });

    return p;
  }, [points, barWidth, offset]);

  return React.createElement(animate ? AnimatedPath : Path, {
    path,
    style: "fill",
    color: "red",
    ...rest,
    ...(Boolean(animate) && { animate }),
  });
}
