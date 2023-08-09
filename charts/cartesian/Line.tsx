import { Path, Skia } from "@shopify/react-native-skia";
import * as React from "react";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { map } from "../interpolaters";
import { useCartesianContext } from "./CartesianContext";
import { usePrevious } from "../../utils/usePrevious";

export function Line() {
  const { data, ixmin, ixmax, oxmin, oxmax, iymin, iymax, oymin, oymax } =
    useCartesianContext();
  const prevData = usePrevious(data);
  const animProgress = useSharedValue(0);

  React.useEffect(() => {
    animProgress.value = 0;
    animProgress.value = withTiming(1, { duration: 300 });
  }, [data]);

  const path = useDerivedValue(() => {
    const oldPath = (() => {
      const path = Skia.Path.Make();
      if (!prevData?.length) return path;

      const x = (d: number) =>
        map(d, ixmin.value, ixmax.value, oxmin.value, oxmax.value);
      const y = (d: number) =>
        map(d, iymin.value, iymax.value, oymin.value, oymax.value);

      path.moveTo(x(prevData[0].x), y(prevData[0].y));
      prevData.forEach((el) => {
        path.lineTo(x(el.x), y(el.y));
      });

      return path;
    })();

    const newPath = (() => {
      const path = Skia.Path.Make();
      if (!data?.length) return path;

      const x = (d: number) =>
        map(d, ixmin.value, ixmax.value, oxmin.value, oxmax.value);
      const y = (d: number) =>
        map(d, iymin.value, iymax.value, oymin.value, oymax.value);

      path.moveTo(x(data[0].x), y(data[0].y));
      data.forEach((el) => {
        path.lineTo(x(el.x), y(el.y));
      });

      return path;
    })();

    return newPath.isInterpolatable(oldPath)
      ? newPath.interpolate(oldPath, animProgress.value)
      : newPath;
  }, [data, prevData, ixmin, ixmax, oxmin, oxmax, iymin, iymax, oymin, oymax]);

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
