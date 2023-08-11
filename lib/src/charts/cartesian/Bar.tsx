import { Path, Skia } from "@shopify/react-native-skia";
import * as React from "react";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { usePrevious } from "../../utils/usePrevious";
import { BAR_WIDTH } from "../../consts";
import { mapPointX, mapPointY } from "../../utils/mapping";
import { useCartesianContext } from "./CartesianContext";

type BarProps = {
  dataKey?: string;
  color?: string;
};

export function Bar({ dataKey = "y", color = "red" }: BarProps) {
  const { data, inputWindow, outputWindow } = useCartesianContext();
  const prevData = usePrevious(data);

  const animProgress = useSharedValue(0);

  React.useEffect(() => {
    animProgress.value = 0;
    animProgress.value = withTiming(1, { duration: 300 });
  }, [data]);

  const path = useDerivedValue(() => {
    const x = (d: number) => mapPointX(d, inputWindow, outputWindow);
    const y = (d: number) => mapPointY(d, inputWindow, outputWindow);

    const makePath = (_data: typeof data) => {
      const path = Skia.Path.Make();
      if (!_data?.x.length) return path;

      let yVal: number | undefined;
      _data.x.forEach((val, i) => {
        yVal = _data.y[dataKey]?.[i];

        yVal !== undefined &&
          path.addRect(
            Skia.XYWHRect(
              x(val) - BAR_WIDTH / 2,
              y(0),
              BAR_WIDTH,
              y(yVal) - y(0),
            ),
          );
      });

      return path;
    };

    const newPath = makePath(data);
    if (data.x.length !== prevData.x.length) return newPath;

    const oldPath = makePath(prevData);
    return newPath.isInterpolatable(oldPath)
      ? newPath.interpolate(oldPath, animProgress.value)!
      : newPath;
  }, [data, prevData]);

  return (
    <>
      <Path path={path} style="fill" color={color} strokeWidth={2}></Path>
    </>
  );
}
