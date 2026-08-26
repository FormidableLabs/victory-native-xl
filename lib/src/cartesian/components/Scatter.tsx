import * as React from "react";
import {
  Path,
  Skia,
  type PathProps,
  type SkiaDefaultProps,
} from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { AnimatedPath } from "./AnimatedPath";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";

export type ScatterShape = "circle" | "square" | "star";
type ScatterProps = {
  points: PointsArray;
  animate?: PathAnimationConfig;
  radius?: number | ((pt: PointsArray[number]) => number);
  shape?: ScatterShape;
} & SkiaDefaultProps<
  Pick<
    PathProps,
    | "style"
    | "color"
    | "blendMode"
    | "opacity"
    | "antiAlias"
    | "start"
    | "end"
    | "strokeWidth"
    | "stroke"
    | "strokeJoin"
    | "strokeCap"
  >,
  "start" | "end"
>;

export function Scatter({
  points,
  animate,
  radius = 10,
  shape = "circle",
  ...rest
}: React.PropsWithChildren<ScatterProps>) {
  const path = React.useMemo(() => {
    const builder = Skia.PathBuilder.Make();

    points.forEach((pt) => {
      const { x, y } = pt;
      if (typeof y !== "number") return;

      const r = typeof radius === "function" ? radius(pt) : radius;

      if (shape === "circle") builder.addCircle(x, y, r);
      else if (shape === "square")
        builder.addRect(Skia.XYWHRect(x - r, y - r, r * 2, r * 2));
      else if (shape === "star") builder.addPath(calculateStarPath(x, y, r, 5));
    });

    return builder.build();
  }, [points, radius, shape]);

  return React.createElement(animate ? AnimatedPath : Path, {
    path,
    ...rest,
    ...(Boolean(animate) && { animate }),
  });
}

const calculateStarPath = (
  centerX: number,
  centerY: number,
  radius: number,
  points: number,
) => {
  const vectors: [number, number][] = [];
  for (let i = 0; i <= 2 * points; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = centerX + Math.cos(angle) * (i % 2 === 0 ? radius : radius / 2);
    const y = centerY + Math.sin(angle) * (i % 2 === 0 ? radius : radius / 2);
    vectors.unshift([x, y]);
  }

  const builder = Skia.PathBuilder.Make();
  const firstVec = vectors[0];
  firstVec && builder.moveTo(firstVec[0], firstVec[1]);
  for (const vec of vectors.slice(1)) {
    builder.lineTo(vec[0], vec[1]);
  }
  builder.close();
  return builder.build();
};
