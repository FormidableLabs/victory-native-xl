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
import { makeCubicPath, makeLinearPath } from "../makeLinePath";
import { makeNaturalCurve } from "../curves/natural";

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

    const newPath = makeNaturalCurve(data, x, y);
    if (data.length !== prevData.length) return newPath;

    const oldPath = makeNaturalCurve(prevData, x, y);
    return newPath.isInterpolatable(oldPath)
      ? newPath.interpolate(oldPath, animProgress.value)
      : newPath;
  }, [data, prevData]);

  const altPath = useDerivedValue(() => {
    const x = (d: number) => mapPointX(d, inputWindow, outputWindow);
    const y = (d: number) => mapPointY(d, inputWindow, outputWindow);

    return makeLinearPath(data, x, y);
  }, [data]);

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
      <Path
        path={altPath}
        style="stroke"
        color="blue"
        strokeWidth={8}
        strokeCap="round"
        strokeJoin="round"
      />
    </>
  );
}
