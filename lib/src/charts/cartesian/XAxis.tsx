import * as React from "react";
import { useCartesianContext } from "./CartesianContext";
import { useDerivedValue } from "react-native-reanimated";
import { clamp, Path, Skia } from "@shopify/react-native-skia";
import { mapPointY } from "../../utils/mapping";
import { valueFromSidedNumber } from "../../utils/valueFromSidedNumber";

type XAxisProps = {
  mode?: "zero" | "fix-bottom" | "fix-top";
};

export const XAxis = ({ mode = "zero" }: XAxisProps) => {
  const { domainPadding, inputWindow, outputWindow } = useCartesianContext();

  const path = useDerivedValue(() => {
    const path = Skia.Path.Make();

    /**
     * Axes are special in the sense that they break out of the output window based
     *  on domainPadding. It's easier to have two components "break out" than
     *  have every other component "nudge in".
     */
    const xStart =
      outputWindow.xMin.value - valueFromSidedNumber(domainPadding, "left");
    const xEnd =
      outputWindow.xMax.value + valueFromSidedNumber(domainPadding, "right");

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
      color="black"
      style="stroke"
      strokeWidth={2 * STROKE_WIDTH}
    />
  );
};

const STROKE_WIDTH = 1;

XAxis["__ESCAPE_CLIP"] = true;
