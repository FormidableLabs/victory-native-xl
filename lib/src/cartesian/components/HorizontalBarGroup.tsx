import * as React from "react";
import { Path, type PathProps, type SkPath } from "@shopify/react-native-skia";
import type { ChartBounds, PointsArray } from "../../types";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";
import { AnimatedPath } from "./AnimatedPath";
import { useHorizontalBarGroupPaths } from "../hooks/useHorizontalBarGroupPaths";
import type { RoundedCorners } from "../../utils/createRoundedRectPath";
import { useFunctionRef } from "../../hooks/useFunctionRef";
import { useCartesianChartContext } from "../contexts/CartesianChartContext";

type HorizontalBarGroupProps = {
  chartBounds: ChartBounds;
  betweenGroupPadding?: number;
  withinGroupPadding?: number;
  roundedCorners?: RoundedCorners;
  children: React.ReactNode;
  barWidth?: number;
  barCount?: number;
  onBarSizeChange?: (values: {
    barWidth: number;
    groupWidth: number;
    gapWidth: number;
  }) => void;
};

export function HorizontalBarGroup({
  betweenGroupPadding = 0.25,
  withinGroupPadding = 0.25,
  chartBounds,
  roundedCorners,
  children,
  onBarSizeChange,
  barWidth: customBarWidth,
  barCount,
}: HorizontalBarGroupProps) {
  const { orientation } = useCartesianChartContext();
  const bars = [] as HorizontalBarGroupBarProps[];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === HorizontalBarGroupBar) {
        bars.push(child.props as HorizontalBarGroupBarProps);
      }
    }
  });

  const { paths, barWidth, groupWidth, gapWidth } = useHorizontalBarGroupPaths(
    bars.map((bar) => bar.points),
    chartBounds,
    betweenGroupPadding,
    withinGroupPadding,
    roundedCorners,
    customBarWidth,
    barCount,
  );

  const onBarSizeChangeRef = useFunctionRef(onBarSizeChange);
  React.useEffect(() => {
    if (orientation !== "horizontal") return;
    onBarSizeChangeRef.current?.({ barWidth, groupWidth, gapWidth });
  }, [orientation, barWidth, gapWidth, groupWidth, onBarSizeChangeRef]);

  if (orientation !== "horizontal") {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        'HorizontalBarGroup must be rendered inside a CartesianChart with orientation="horizontal".',
      );
    }
    return null;
  }

  const firstBar = bars[0];
  if (!firstBar) return null;

  return (
    <>
      {bars.map((props, i) =>
        React.createElement(
          HorizontalBarGroupBar as React.ComponentType<
            React.PropsWithChildren<InternalHorizontalBarGroupBarProps>
          >,
          {
            ...props,
            __path: paths[i],
            key: i,
          },
        ),
      )}
    </>
  );
}
HorizontalBarGroup.Bar = HorizontalBarGroupBar;

type HorizontalBarGroupBarPathProps = Partial<
  Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">
>;

type HorizontalBarGroupBarProps = {
  points: PointsArray;
  animate?: PathAnimationConfig;
} & HorizontalBarGroupBarPathProps;

type InternalHorizontalBarGroupBarProps = HorizontalBarGroupBarProps & {
  __path?: SkPath;
};

function HorizontalBarGroupBar(
  props: React.PropsWithChildren<HorizontalBarGroupBarProps>,
) {
  const { animate, __path, ...rest } =
    props as React.PropsWithChildren<InternalHorizontalBarGroupBarProps>;
  const PathComponent = animate ? AnimatedPath : Path;

  if (!__path) return null;

  return React.createElement(PathComponent, {
    path: __path,
    style: "fill",
    color: "red",
    ...rest,
    ...(Boolean(animate) && { animate }),
  });
}
