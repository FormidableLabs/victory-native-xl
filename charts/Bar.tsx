import * as React from "react";
import { Point, Scales } from "./types";
import { Path, Skia } from "@shopify/react-native-skia";
import { BAR_WIDTH, DEFAULT_SCALES } from "./consts";

type Props<T> = {
  data?: T[];
  scales?: Scales;
};

export function Bar<T extends Point>({
  data,
  scales: { x, y, yMax, yMin } = DEFAULT_SCALES,
}: Props<T>) {
  const path = React.useMemo(() => {
    const path = Skia.Path.Make();
    if (!data?.length) return path;

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
  }, [data, x, y]);

  return <Path path={path} style="fill" color="blue" strokeWidth={2} />;
}
