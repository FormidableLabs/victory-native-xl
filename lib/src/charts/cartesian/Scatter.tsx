// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useEffect } from "react";
import { LinearGradient, Path, Skia, vec } from "@shopify/react-native-skia";
import { useCartesianContext } from "./CartesianContext";
import { usePrevious } from "../../utils/usePrevious";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { mapPointX, mapPointY } from "../../utils/mapping";

export type ScatterProps = {
  radius?: number;
  dataKey?: string;
  animationDuration?: number;
  fillColors?: string[];
  strokeColor?: string;
  strokeWidth?: number;
};

export function Scatter({
  dataKey = "y",
  radius = 10,
  animationDuration = 300,
  fillColors = ["yellow", "purple"],
}: ScatterProps) {
  const { data, inputWindow, outputWindow } = useCartesianContext();
  const prevData = usePrevious(data);
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = 0;
    animationProgress.value = withTiming(1, { duration: animationDuration });
  }, [data]);

  const path = useDerivedValue(() => {
    const x = (d: number) => mapPointX(d, inputWindow, outputWindow);
    const y = (d: number) => mapPointY(d, inputWindow, outputWindow);

    const makePath = (_data: typeof data) => {
      const path = Skia.Path.Make();
      if (!_data.x.length) return path;

      _data.x.forEach((val, i) =>
        path.addCircle(x(val), y(_data.y[dataKey][i]), radius),
      );

      return path;
    };

    const newPath = makePath(data);
    const oldPath = makePath(prevData);
    return newPath.isInterpolatable(oldPath)
      ? newPath.interpolate(oldPath, animationProgress.value)
      : newPath;
  }, [data, prevData]);

  return (
    <Path path={path} style="fill" color={fillColors[0]} strokeWidth={0}>
      <LinearGradient start={vec(0, 0)} end={vec(0, 256)} colors={fillColors} />
    </Path>
  );
}
