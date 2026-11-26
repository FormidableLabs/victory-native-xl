import * as React from "react";
import {
  Skia,
  type Color,
  type PathProps,
  type SkPath,
} from "react-native-skia";
import type { PointsArray } from "../../types";
import { type CurveType } from "../utils/curves";
import { addAreaToPathBuilder, type DefinedPoint } from "../utils/chartPaths";
import { groupPointsArray } from "../../utils/groupPointsArray";

// Utility to calculate cumulative offsets, subtracting each layer from the previous one
const calculateOffsets = (
  pointsArray: PointsArray[],
  y0: number,
): number[][] => {
  const offsets: number[][] = pointsArray.map(() => []);
  if (!pointsArray[0]) return offsets;
  // Start by initializing the first layer with y0 as the baseline
  if (pointsArray.length === 0 || !pointsArray[0]) return offsets;

  offsets[0] = pointsArray[0].map(() => 0);

  // For each subsequent layer, subtract from the previous layer's y0 to stack upwards (towards 0, aka the "top of the screen")
  for (let layerIndex = 1; layerIndex < pointsArray.length; layerIndex++) {
    const currentPoints = pointsArray[layerIndex];
    const previousPoints = pointsArray[layerIndex - 1];

    if (!currentPoints || !previousPoints) continue;

    offsets[layerIndex] = currentPoints.map((_, i) => {
      const accumulatedOffset = offsets[layerIndex - 1]?.[i] ?? 0;
      const previousHeightOfPoint = previousPoints[i]?.y ?? 0;
      // The offset is calculated by starting at the y0 (the bottom-most line of the chart) and then subtract the preceding point's height combined with the accumulation of these values
      // For example:
      // If we had something like { x: 0, high: 5, med: 4, low: 3 } as a data point and passed this in like points={[points.low, points.med, points.high]}
      // "low" is not offset by anything other than y0, since it is the first area drawn
      // "med" needs to be offset by the height of y0 and "low"'s height
      // "high" needs to be offset by the height of y0, and "low"'s and "med"'s heights combined.

      const offsetBy = y0 - previousHeightOfPoint + accumulatedOffset;
      return offsetBy;
    });
  }

  return offsets;
};

type CustomizablePathProps = Partial<
  Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">
>;

type UseStackedAreaPathArgs = {
  pointsArray: PointsArray[];
  colors: Color[];
  y0: number;
  curveType?: CurveType;
  areaOptions?: ({
    rowIndex,
    lowestY,
    highestY,
  }: {
    rowIndex: number;
    lowestY: number;
    highestY: number;
  }) => CustomizablePathProps & {
    children?: React.ReactNode;
  };
};

export type StackedAreaPath = {
  path: SkPath;
  key: string;
  color?: Color;
} & CustomizablePathProps & {
    children?: React.ReactNode;
  };

// A stable default, so that omitting `areaOptions` does not rebuild the paths
// on every render.
const defaultAreaOptions: NonNullable<
  UseStackedAreaPathArgs["areaOptions"]
> = () => ({});

// Main hook to generate the stacked area paths for an inverted coordinate system
export const useStackedAreaPaths = ({
  pointsArray,
  colors,
  y0,
  curveType = "linear",
  areaOptions = defaultAreaOptions,
}: UseStackedAreaPathArgs): StackedAreaPath[] => {
  const paths = React.useMemo(() => {
    const offsets = calculateOffsets(pointsArray, y0);

    return pointsArray.map((points, layerIndex) => {
      const builder = Skia.PathBuilder.Make();
      // Only the points that have a y value are kept in a group.
      const groups = groupPointsArray(points) as DefinedPoint[][];
      const layerOffsets = offsets[layerIndex];

      let lowestPointOfLayer: number = y0;
      let highestPointOfLayer: number = 0;

      groups.forEach((group) => {
        // Adjust the points for stacking
        const stackedPoints: DefinedPoint[] = group.map(({ x, y }, i) => ({
          x,
          y: y - (layerOffsets?.[i] ?? 0),
        }));

        lowestPointOfLayer = Math.max(
          ...(layerOffsets ?? []).map((num) => y0 - num),
        );
        highestPointOfLayer = Math.max(
          ...stackedPoints.map((point) => point.y),
        );

        // The bottom of the current area is the top of the layers below it
        addAreaToPathBuilder(
          builder,
          stackedPoints,
          (i) => y0 - (layerOffsets?.[i] ?? 0),
          curveType,
        );
      });

      const options = areaOptions({
        rowIndex: layerIndex,
        lowestY: lowestPointOfLayer,
        highestY: highestPointOfLayer,
      });

      return {
        path: builder.detach(),
        key: `area-${layerIndex}`,
        color: colors[layerIndex],
        ...options,
      };
    });
  }, [pointsArray, y0, curveType, colors, areaOptions]);

  return paths;
};
