import * as React from "react";
import {
  Path,
  Skia,
  type PathProps,
  type SkiaDefaultProps,
  SkPoint,
  vec,
} from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { AnimatedPath } from "./AnimatedPath";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";

export type ScatterShape = "circle" | "square" | "star";
type ScatterProps = {
  points: PointsArray;
  animate?: PathAnimationConfig;
  radius?: number;
  shape?: ScatterShape;
} & SkiaDefaultProps<
  Pick<
    PathProps,
    | "style"
    | "color"
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
    const p = Skia.Path.Make();

    points.forEach(({ x, y }) => {
      if (shape === "circle") p.addCircle(x, y, radius);
      else if (shape === "square")
        p.addRect(
          Skia.XYWHRect(x - radius, y - radius, radius * 2, radius * 2),
        );
      else if (shape === "star") p.addPath(calculateStarPath(x, y, radius, 5));
    });

    return p;
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

  const path = Skia.Path.Make();
  path.moveTo(...vectors[0]);
  for (let i = 1; i < vectors.length; i++) {
    path.lineTo(...vectors[i]);
  }
  path.close();
  return path;
};
