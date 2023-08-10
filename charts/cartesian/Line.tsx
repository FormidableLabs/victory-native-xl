import { Path, Rect, Skia } from "@shopify/react-native-skia";
import * as React from "react";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { map, mapPointX, mapPointY } from "../interpolaters";
import { useCartesianContext } from "./CartesianContext";
import { usePrevious } from "../../utils/usePrevious";

export function Line() {
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
      if (!_data?.length) return path;

      path.moveTo(x(_data[0].x), y(_data[0].y));
      _data.forEach((el) => {
        path.lineTo(x(el.x), y(el.y));
      });

      return path;
    };

    const newPath = makePath(data);
    if (data.length !== prevData.length) return newPath;

    const oldPath = makePath(prevData);

    return newPath.isInterpolatable(oldPath)
      ? newPath.interpolate(oldPath, animProgress.value)
      : newPath;
  }, [data, prevData]);

  return (
    <Path
      path={path}
      style="stroke"
      color="red"
      strokeWidth={8}
      strokeCap="round"
      strokeJoin="round"
    />
  );
}
