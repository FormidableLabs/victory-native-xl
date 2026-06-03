import * as React from "react";
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
  getHorizontalStackedBarOptionsContext,
  getStackedBarSegments,
  type HorizontalStackedBarOptionsContext,
} from "../utils/getStackedBarSegments";
import { getBarThickness } from "../utils/getBarThickness";
import { getHorizontalStackedBarRect } from "../utils/getHorizontalStackedBarRect";

type HorizontalStackedBarPathProps = Partial<
  Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">
>;

const DEFAULT_COLORS = ["red", "orange", "blue", "green", "blue", "purple"];

export type HorizontalStackedBarOptions = HorizontalStackedBarPathProps & {
  roundedCorners?: RoundedCorners;
  children?: React.ReactNode;
};

export type { HorizontalStackedBarOptionsContext };

export type HorizontalStackedBarOptionsFn = (
  options: HorizontalStackedBarOptionsContext,
) => HorizontalStackedBarOptions;

export type HorizontalStackedBarPath = {
  path: SkPath;
  key: string;
  color?: Color;
} & HorizontalStackedBarPathProps & {
    children?: React.ReactNode;
  };

const DEFAULT_BAR_OPTIONS: HorizontalStackedBarOptionsFn = () => ({});

type Props = {
  points: PointsArray[];
  chartBounds: ChartBounds;
  innerPadding?: number;
  barWidth?: number;
  barCount?: number;
  colors?: Color[];
  barOptions?: HorizontalStackedBarOptionsFn;
};

export const useHorizontalStackedBarPaths = ({
  points,
  chartBounds,
  innerPadding = 0.25,
  barWidth: customBarWidth,
  barCount,
  barOptions = DEFAULT_BAR_OPTIONS,
  colors = DEFAULT_COLORS,
}: Props) => {
  const { xScale } = useCartesianChartContext();
  const barWidth = getBarThickness({
    points,
    axisStart: chartBounds.top,
    axisEnd: chartBounds.bottom,
    innerPadding,
    customBarThickness: customBarWidth,
    barCount,
  });

  const paths = React.useMemo(() => {
    const bars: HorizontalStackedBarPath[] = [];
    const segments = getStackedBarSegments(points);

    segments.forEach((segment) => {
      const rect = getHorizontalStackedBarRect({
        segment,
        xScale,
        barWidth,
      });
      if (!rect) return;

      const options = barOptions(
        getHorizontalStackedBarOptionsContext(segment),
      );
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
          "horizontal",
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
  }, [barOptions, barWidth, colors, points, xScale]);

  return paths;
};
