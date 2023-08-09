import { Path, Skia } from "@shopify/react-native-skia";
import * as React from "react";
import { useDerivedValue } from "react-native-reanimated";
import { map } from "../interpolaters";
import { useCartesianContext } from "./CartesianContext";

export function Line() {
  const { data, ixmin, ixmax, oxmin, oxmax, iymin, iymax, oymin, oymax } =
    useCartesianContext();

  const path = useDerivedValue(() => {
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
  }, [data, ixmin, ixmax, oxmin, oxmax, iymin, iymax, oymin, oymax]);

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
