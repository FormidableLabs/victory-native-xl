import { LinearGradient, Path, Skia, vec } from "@shopify/react-native-skia";
import * as React from "react";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BAR_WIDTH } from "../consts";
import { map } from "../interpolaters";
import { Point } from "../types";
import { useCartesianContext } from "./CartesianContext";

export function Bar() {
  const { data } = useCartesianContext();

  return (
    <>
      {data.map((el, i) => (
        <BarLine {...el} key={i} />
      ))}
    </>
  );
}

function BarLine({ x, y }: Point) {
  const { ixmin, ixmax, oxmin, oxmax, iymin, iymax, oymin, oymax } =
    useCartesianContext();

  const $x = useSharedValue(0);
  const $y = useSharedValue(0);

  React.useEffect(() => {
    // $y.value = y;
    $y.value = withTiming(y, { duration: 300 });
  }, [y]);

  const path = useDerivedValue(() => {
    const mapY = (d: number) =>
      map(d, iymin.value, iymax.value, oymin.value, oymax.value);

    const path = Skia.Path.Make();
    path.addRect(
      Skia.XYWHRect(
        map(x, ixmin.value, ixmax.value, oxmin.value, oxmax.value) -
          BAR_WIDTH / 2,
        mapY(0),
        BAR_WIDTH,
        mapY($y.value) - mapY(0),
      ),
    );

    return path;
  }, [x, $y, ixmin, ixmax, oxmin, oxmax, iymin, iymax, oymin, oymax]);

  return (
    <Path path={path} style="fill" color="blue" strokeWidth={2}>
      <LinearGradient
        start={vec(0, 0)}
        end={vec(0, 256)}
        colors={["blue", "yellow"]}
      />
    </Path>
  );
}
