import * as React from "react";
import { Point, Scales } from "./types";
import { DEFAULT_SCALES } from "./consts";
import { Circle, Path, Skia } from "@shopify/react-native-skia";

type Props<T> = {
  data?: T[];
  scales?: Scales;
};

export function Line<T extends Point>({
  data,
  scales: { x, y } = DEFAULT_SCALES,
}: Props<T>) {
  const path = React.useMemo(() => {
    const path = Skia.Path.Make();
    if (!data?.length) return path;

    path.moveTo(x(data[0].x), y(data[0].y));
    data.forEach((el) => {
      path.lineTo(x(el.x), y(el.y));
    });

    return path;
  }, [data, x, y]);

  return (
    <>
      {data?.map((el) => (
        <Circle
          key={`${el.x}-${el.y}`}
          cx={x(el.x)}
          cy={y(el.y)}
          r={5}
          color="red"
        />
      ))}
      <Path path={path} style="stroke" color="blue" strokeWidth={2} />
    </>
  );
}
