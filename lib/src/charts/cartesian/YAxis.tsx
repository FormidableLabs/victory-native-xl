import * as React from "react";
import { useCartesianContext } from "./CartesianContext";
import { useDerivedValue } from "react-native-reanimated";
import { clamp, Path, Skia } from "@shopify/react-native-skia";
import { mapPointX } from "../../utils/mapping";

type YAxisProps = {
  mode?: "zero" | "fix-left" | "fix-right";
};

const YAxis = ({ mode = "zero" }: YAxisProps) => {
  const { inputWindow, outputWindow } = useCartesianContext();

  const path = useDerivedValue(() => {
    const path = Skia.Path.Make();

    const yStart = outputWindow.yMin.value;
    const yEnd = outputWindow.yMax.value;

    let axisX = 0;
    if (mode === "zero") {
      axisX = clamp(
        mapPointX(0, inputWindow, outputWindow),
        outputWindow.xMin.value,
        outputWindow.xMax.value,
      );
    }
    if (mode === "fix-left") {
      axisX = outputWindow.xMin.value;
    }
    if (mode === "fix-right") {
      axisX = outputWindow.xMax.value;
    }

    path.moveTo(axisX, yStart);
    path.lineTo(axisX, yEnd);

    // TODO: Ticks?

    return path;
  });

  return <Path path={path} color="gray" style="stroke" strokeWidth={2} />;
};

YAxis.__ESCAPE_CLIP = true;

export { YAxis };
