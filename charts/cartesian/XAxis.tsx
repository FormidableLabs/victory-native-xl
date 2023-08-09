import { useCartesianContext } from "./CartesianContext";
import { useDerivedValue } from "react-native-reanimated";
import { Path, Skia } from "@shopify/react-native-skia";
import { map } from "../interpolaters";

type XAxisProps = {};

export function XAxis(props: XAxisProps) {
  const { data, ixmin, ixmax, iymin, iymax, oxmin, oxmax, oymin, oymax } =
    useCartesianContext();

  const path = useDerivedValue(() => {
    const path = Skia.Path.Make();
    const x = (v: number) =>
      map(v, ixmin.value, ixmax.value, oxmin.value, oxmax.value);
    const y = (v: number) =>
      map(v, iymin.value, iymax.value, oymin.value, oymax.value);

    const xStart = oxmin.value;
    const xEnd = oxmax.value;
    const axisY = map(0, iymin.value, iymax.value, oymin.value, oymax.value);

    // Baseline
    path.moveTo(xStart, axisY);
    path.lineTo(xEnd, axisY);

    // TODO: Ticks...
    // For now, just put a tick at each data value – but eventually probably needs to be smarter than this.
    data.forEach((el) => {
      path.addRect(
        Skia.XYWHRect(
          x(el.x) - STROKE_WIDTH / 2,
          y(0),
          STROKE_WIDTH,
          TICK_LENGTH,
        ),
      );
    });

    return path;
  }, [data, iymin, iymax, oymin, oymax, ixmin, ixmax, iymin, iymax]);

  return (
    <Path
      path={path}
      color="gray"
      style="stroke"
      strokeWidth={2 * STROKE_WIDTH}
    />
  );
}

const STROKE_WIDTH = 1;
const TICK_LENGTH = 10;
