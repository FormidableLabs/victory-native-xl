import * as React from "react";
import { useCartesianContext } from "./CartesianContext";
import { useDerivedValue } from "react-native-reanimated";
import { clamp, Path, Skia } from "@shopify/react-native-skia";
import { mapPointX, mapPointY } from "../../utils/mapping";

type XAxisProps = {
  mode?: "zero" | "fix-bottom" | "fix-top";
};

export const XAxis = ({ mode = "zero" }: XAxisProps) => {
  const { data, inputWindow, outputWindow } = useCartesianContext();

  const path = useDerivedValue(() => {
    const path = Skia.Path.Make();

    const xStart = outputWindow.xMin.value;
    const xEnd = outputWindow.xMax.value;

    let axisY = 0;
    if (mode === "zero") {
      axisY = clamp(
        mapPointY(0, inputWindow, outputWindow),
        outputWindow.yMax.value,
        outputWindow.yMin.value,
      );
    }
    if (mode === "fix-bottom") {
      axisY = outputWindow.yMin.value;
    }
    if (mode === "fix-top") {
      axisY = outputWindow.yMax.value;
    }

    // Baseline
    path.moveTo(xStart, axisY);
    path.lineTo(xEnd, axisY);

    // TODO: Ticks...
    // For now, just put a tick at each data value – but eventually probably needs to be smarter than this.
    // data.x.forEach((val) => {
    //   path.addRect(
    //     Skia.XYWHRect(
    //       x(val) - STROKE_WIDTH / 2,
    //       y(0),
    //       STROKE_WIDTH,
    //       TICK_LENGTH,
    //     ),
    //   );
    // });

    return path;
  });

  return (
    <Path
      path={path}
      color="gray"
      style="stroke"
      strokeWidth={2 * STROKE_WIDTH}
    />
  );
};

const STROKE_WIDTH = 1;

XAxis["__ESCAPE_CLIP"] = true;
