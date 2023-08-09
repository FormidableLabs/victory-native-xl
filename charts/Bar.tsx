import * as React from "react";
import { IncomingProps, Point, Scales } from "./types";
import { LinearGradient, Path, Skia, vec } from "@shopify/react-native-skia";
import { BAR_WIDTH, DEFAULT_SCALES } from "./consts";
import { useDerivedValue } from "react-native-reanimated";
import { map } from "./interpolaters";

type Props<T> = {
  data?: T[];
  scales?: Scales;
};

export function Bar({
  data,
  ixmin,
  ixmax,
  oxmin,
  oxmax,
  iymin,
  iymax,
  oymin,
  oymax,
}: IncomingProps) {
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
