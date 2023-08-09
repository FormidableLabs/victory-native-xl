import {
  LinearGradient,
  Path,
  PathOp,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import * as React from "react";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { usePrevious } from "../../utils/usePrevious";
import { BAR_WIDTH } from "../consts";
import { map } from "../interpolaters";
import { useCartesianContext } from "./CartesianContext";

export function Bar() {
  const { data, ixmin, ixmax, oxmin, oxmax, iymin, iymax, oymin, oymax } =
    useCartesianContext();
  const prevData = usePrevious(data);

  const animProgress = useSharedValue(0);

  React.useEffect(() => {
    animProgress.value = 0;
    animProgress.value = withTiming(1, { duration: 300 });
  }, [data]);

  const path = useDerivedValue(() => {
    // TODO: Abstract out the shared logic here...
    const newPath = (() => {
      const path = Skia.Path.Make();
      if (!data?.length) return path;

      const x = (d: number) =>
        map(d, ixmin.value, ixmax.value, oxmin.value, oxmax.value);
      const y = (d: number) =>
        map(d, iymin.value, iymax.value, oymin.value, oymax.value);

      data.forEach((el, i) => {
        path.addRect(
          Skia.XYWHRect(
            x(el.x) - BAR_WIDTH / 2,
            y(0),
            BAR_WIDTH,
            y(el.y) - y(0),
          ),
        );
      });

      return path;
    })();
    if (data.length !== prevData.length) return newPath;

    const oldPath = (() => {
      const path = Skia.Path.Make();
      if (!prevData?.length) return path;

      const x = (d: number) =>
        map(d, ixmin.value, ixmax.value, oxmin.value, oxmax.value);
      const y = (d: number) =>
        map(d, iymin.value, iymax.value, oymin.value, oymax.value);

      prevData.forEach((el, i) => {
        path.addRect(
          Skia.XYWHRect(
            x(el.x) - BAR_WIDTH / 2,
            y(0),
            BAR_WIDTH,
            y(el.y) - y(0),
          ),
        );
      });

      return path;
    })();

    return newPath.isInterpolatable(oldPath)
      ? newPath.interpolate(oldPath, animProgress.value)
      : newPath;
  }, [data, ixmin, ixmax, oxmin, oxmax, iymin, iymax, oymin, oymax]);

  return (
    <>
      <Path path={path} style="fill" color="blue" strokeWidth={2}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, 256)}
          colors={["blue", "yellow"]}
        />
      </Path>
    </>
  );
}
