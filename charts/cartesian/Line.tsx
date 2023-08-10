import { Circle, Path, Rect, Skia, vec } from "@shopify/react-native-skia";
import * as React from "react";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { map, mapPoint, mapPointX, mapPointY } from "../interpolaters";
import { useCartesianContext } from "./CartesianContext";
import { usePrevious } from "../../utils/usePrevious";
import { makeCubicPath, makeLinearPath } from "../makeLinePath";
import { makeNaturalCurve } from "../curves/natural";
import { findClosestPoint } from "../findClosestPoint";

type LineProps = {
  hasTracking?: boolean; // TODO: this needs a real name
};

export function Line({ hasTracking = true }: LineProps) {
  const { data, inputWindow, outputWindow, tracking } = useCartesianContext();

  const prevData = usePrevious(data);
  const animProgress = useSharedValue(0);

  React.useEffect(() => {
    animProgress.value = 0;
    animProgress.value = withTiming(1, { duration: 300 });
  }, [data]);

  const path = useDerivedValue(() => {
    const x = (d: number) => mapPointX(d, inputWindow, outputWindow);
    const y = (d: number) => mapPointY(d, inputWindow, outputWindow);

    const newPath = makeLinearPath(data, x, y);
    if (data.length !== prevData.length) return newPath;

    const oldPath = makeLinearPath(prevData, x, y);
    return newPath.isInterpolatable(oldPath)
      ? newPath.interpolate(oldPath, animProgress.value)
      : newPath;
  }, [data, prevData]);

  const trackingPoint = useDerivedValue(() => {
    if (!hasTracking || !tracking.isActive) return vec(-5, -5);

    const closestPoint = findClosestPoint(data, tracking.x.value);
    if (!closestPoint) return vec(-5, -5);

    return vec(
      ...mapPoint([closestPoint.x, closestPoint.y], inputWindow, outputWindow),
    );
  });

  return (
    <>
      <Path
        path={path}
        style="stroke"
        color="red"
        strokeWidth={8}
        strokeCap="round"
        strokeJoin="round"
      />
      {hasTracking && tracking.isActive && (
        <Circle c={trackingPoint} r={10} color="purple" />
      )}
    </>
  );
}
