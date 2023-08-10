import { useCartesianContext } from "./CartesianContext";
import { useDerivedValue } from "react-native-reanimated";
import { Path, Skia } from "@shopify/react-native-skia";
import { mapPointX, mapPointY } from "../interpolaters";

type XAxisProps = {};

export function XAxis(props: XAxisProps) {
  const { data, inputWindow, outputWindow } = useCartesianContext();

  const path = useDerivedValue(() => {
    const path = Skia.Path.Make();
    const x = (d: number) => mapPointX(d, inputWindow, outputWindow);
    const y = (d: number) => mapPointY(d, inputWindow, outputWindow);

    const xStart = outputWindow.xMin.value;
    const xEnd = outputWindow.xMax.value;
    const axisY = mapPointY(0, inputWindow, outputWindow);

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
  }, [data]);

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
