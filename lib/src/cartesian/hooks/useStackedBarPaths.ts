import React from "react";
import {
  Skia,
  type Color,
  type PathProps,
  type SkPath,
} from "@shopify/react-native-skia";
import {
  createRoundedRectPath,
  type RoundedCorners,
} from "../../utils/createRoundedRectPath";
import type { ChartBounds, PointsArray } from "../../types";
import { useCartesianChartContext } from "../contexts/CartesianChartContext";
import {
  getStackedBarSegments,
  getVerticalStackedBarOptionsContext,
  type VerticalStackedBarOptionsContext,
} from "../utils/getStackedBarSegments";
import { getVerticalStackedBarRect } from "../utils/getVerticalStackedBarRect";
import { useBarWidth } from "./useBarWidth";

export type CustomizablePathProps = Partial<
  Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">
>;

const DEFAULT_COLORS = ["red", "orange", "blue", "green", "blue", "purple"];

export type StackedBarOptionsContext = VerticalStackedBarOptionsContext;

export type StackedBarOptions = CustomizablePathProps & {
  roundedCorners?: RoundedCorners;
  children?: React.ReactNode;
};

export type StackedBarOptionsFn = (
  options: StackedBarOptionsContext,
) => StackedBarOptions;

const DEFAULT_BAR_OPTIONS: StackedBarOptionsFn = () => ({});

export type StackedBarPath = {
  path: SkPath;
  key: string;
  color?: Color;
} & CustomizablePathProps & {
    children?: React.ReactNode;
  };

type Props = {
  points: PointsArray[];
  chartBounds: ChartBounds;
  innerPadding?: number;
  barWidth?: number;
  barCount?: number;
  colors?: Color[];
  barOptions?: StackedBarOptionsFn;
};

export const useStackedBarPaths = ({
  points,
  chartBounds,
  innerPadding = 0.25,
  barWidth: customBarWidth,
  barCount,
  barOptions = DEFAULT_BAR_OPTIONS,
  colors = DEFAULT_COLORS,
}: Props) => {
  const { yScale } = useCartesianChartContext();
  const barWidth = useBarWidth({
    points,
    chartBounds,
    innerPadding,
    customBarWidth,
    barCount,
  });

  const paths = React.useMemo(() => {
    const bars: StackedBarPath[] = [];
    const segments = getStackedBarSegments(points);

    segments.forEach((segment) => {
      const rect = getVerticalStackedBarRect({
        segment,
        yScale,
        barWidth,
      });
      if (!rect) return;

      const options = barOptions(getVerticalStackedBarOptionsContext(segment));
      const { roundedCorners, color, ...ops } = options;

      const path = Skia.Path.Make();
      if (roundedCorners) {
        const nonUniformRoundedRect = createRoundedRectPath(
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          roundedCorners,
          segment.value,
        );
        path.addRRect(nonUniformRoundedRect);
      } else {
        path.addRect(Skia.XYWHRect(rect.x, rect.y, rect.width, rect.height));
      }

      bars.push({
        path,
        key: `${segment.seriesIndex}-${segment.datumIndex}`,
        color: color ?? colors[segment.seriesIndex],
        ...ops,
      });
    });

    return bars;
  }, [barOptions, barWidth, colors, points, yScale]);

  return paths;
};
