import { useEffect } from "react";
import { Point } from "../types";
import { LinearGradient, Path, Skia, vec } from "@shopify/react-native-skia";
import { useCartesianContext } from "./CartesianContext";
import { usePrevious } from "../../utils/usePrevious";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { mapPointX, mapPointY } from "../interpolaters";

export type ScatterProps = {
  radius?: number;
  animationDuration?: number;
  fillColors?: string[];
  strokeColor?: string;
  strokeWidth?: number;
};

export function Scatter({
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
      if (!_data?.length) return path;

      _data.forEach((point: Point) =>
        path.addCircle(x(point.x), y(point.y), radius),
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
