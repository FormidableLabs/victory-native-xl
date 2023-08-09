import { LinearGradient, Path, Skia, vec } from "@shopify/react-native-skia";
import * as React from "react";
import { useDerivedValue } from "react-native-reanimated";
import { BAR_WIDTH } from "../consts";
import { map } from "../interpolaters";
import { useCartesianContext } from "./CartesianContext";

export function Bar() {
  const { data, ixmin, ixmax, oxmin, oxmax, iymin, iymax, oymin, oymax } =
    useCartesianContext();

  const path = useDerivedValue(() => {
    const path = Skia.Path.Make();
    if (!data?.length) return path;

    const x = (d: number) =>
      map(d, ixmin.value, ixmax.value, oxmin.value, oxmax.value);
    const y = (d: number) =>
      map(d, iymin.value, iymax.value, oymin.value, oymax.value);

    data.forEach((el) => {
      path.addRect(
        Skia.XYWHRect(
          x(el.x) - BAR_WIDTH / 2,
          y(el.y),
          BAR_WIDTH,
          y(0) - y(el.y),
        ),
      );
    });

    return path;
  }, [data, ixmin, ixmax, oxmin, oxmax, iymin, iymax, oymin, oymax]);

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
