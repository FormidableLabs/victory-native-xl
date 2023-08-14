import { Circle, Path, vec } from "@shopify/react-native-skia";
import * as React from "react";
import {
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { mapPoint, mapPointX, mapPointY } from "../../utils/mapping";
import { useCartesianContext } from "./CartesianContext";
import { usePrevious } from "../../utils/usePrevious";
import { makeLinearPath } from "../curves/linear";
import { findClosestPoint } from "../../utils/findClosestPoint";
import type { BaseStrokeChartProps } from "../../types";
import { defaultBaseStrokeChartProps } from "../../consts";
import { scaleLinear } from "../../vendor/d3-scale";

type LineProps = BaseStrokeChartProps & {
  hasTracking?: boolean;
};

export function Line({
  dataKey = "y",
  hasTracking = true,
  animationDuration,
  strokeColor,
  strokeWidth,
}: LineProps) {
  const { data, inputWindow, outputWindow, tracking } = useCartesianContext();

  const prevData = usePrevious(data);
  const animProgress = useSharedValue(0);

  React.useEffect(() => {
    animProgress.value = 0;
    animProgress.value = withTiming(1, { duration: animationDuration });
  }, [data]);

  const foo = useDerivedValue(() => {
    try {
      const x = scaleLinear([0, 1], [10, 0]);
      return x(3);
    } catch {
      return 0;
    }
  });

  const path = useDerivedValue(() => {
    const x = (d: number) => mapPointX(d, inputWindow, outputWindow);
    const y = (d: number) => mapPointY(d, inputWindow, outputWindow);

    const newPath = makeLinearPath(data.x, data.y[dataKey] || [], x, y);
    if (data.x.length !== prevData.x.length) return newPath;

    const oldPath = makeLinearPath(prevData.x, prevData.y[dataKey] || [], x, y);
    return newPath.isInterpolatable(oldPath)
      ? newPath.interpolate(oldPath, animProgress.value)!
      : newPath;
  }, [data, prevData]);

  // TODO: Re-enable tracking at some point...
  // Our tracking point, but we won't use this directly in drawing
  const _trackingPoint = useDerivedValue(() => {
    if (!hasTracking || !tracking.isActive) return null;

    const closestIdx = findClosestPoint(data.x, tracking.x.value);
    if (closestIdx === null) return null;

    const closestX = data.x[closestIdx];
    const closestY = data.y[dataKey]?.[closestIdx];
    if (closestX === undefined || closestY === undefined) return null;

    const closestPoint = [closestX, closestY] as [number, number];

    return vec(...mapPoint(closestPoint, inputWindow, outputWindow));
  });

  // We'll animate x/y values on tracking point changes for a smoother feel
  const trackingX = useSharedValue(_trackingPoint.value?.x || 0);
  const trackingY = useSharedValue(_trackingPoint.value?.y || 0);
  useAnimatedReaction(
    () => _trackingPoint.value,
    (cur, prev) => {
      if (!cur) return;
      if (!prev) {
        trackingX.value = cur.x;
        trackingY.value = cur.y;
      } else if (cur.x !== prev?.x) {
        trackingX.value = withTiming(cur.x, { duration: 150 });
        trackingY.value = withTiming(cur.y, { duration: 150 });
      }
    },
  );

  return (
    <>
      <Path
        path={path}
        style="stroke"
        color={strokeColor}
        strokeWidth={strokeWidth}
        strokeCap="round"
        strokeJoin="round"
      />
      {hasTracking && tracking.isActive && (
        <Circle cx={trackingX} cy={trackingY} r={10} color="purple" />
      )}
      <Circle cx={foo} cy={50} r={20} color="red" />
    </>
  );
}

Line.defaultProps = defaultBaseStrokeChartProps;
