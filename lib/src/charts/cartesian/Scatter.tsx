import * as React from "react";
import { Path, Skia } from "@shopify/react-native-skia";
import { useCartesianContext } from "./CartesianContext";
import { usePrevious } from "../../utils/usePrevious";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { mapPointX, mapPointY } from "../../utils/mapping";
import { type BaseCartesianChartProps } from "../../types";
import { defaultBaseCartesianChartProps } from "../../consts";
import { PathFill } from "./PathFill";

export type ScatterProps = BaseCartesianChartProps<{
  radius?: number;
}>;

export function Scatter({
  dataKey,
  animationDuration,
  fillColor,
  radius = 10,
}: ScatterProps) {
  const { data, inputWindow, outputWindow } = useCartesianContext();
  const prevData = usePrevious(data);
  const animationProgress = useSharedValue(0);

  React.useEffect(() => {
    animationProgress.value = 0;
    animationProgress.value = withTiming(1, { duration: animationDuration });
  }, [data]);

  const path = useDerivedValue(() => {
    const x = (d: number) => mapPointX(d, inputWindow, outputWindow);
    const y = (d: number) => mapPointY(d, inputWindow, outputWindow);

    const makePath = (_data: typeof data) => {
      const path = Skia.Path.Make();
      if (!_data.x.length) return path;

      let yVal: number | undefined;
      _data.x.forEach((val, i) => {
        yVal = _data.y[dataKey]?.[i];
        yVal !== undefined && path.addCircle(x(val), y(yVal), radius);
      });

      return path;
    };

    const newPath = makePath(data);
    const oldPath = makePath(prevData);
    return newPath.isInterpolatable(oldPath)
      ? newPath.interpolate(oldPath, animationProgress.value)!
      : newPath;
  }, [data, prevData]);

  const pathColor = Array.isArray(fillColor) ? fillColor[0] : fillColor;

  return (
    <Path path={path} style="fill" color={pathColor} strokeWidth={0}>
      <PathFill fillColor={fillColor} />
    </Path>
  );
}

Scatter.defaultProps = defaultBaseCartesianChartProps;
