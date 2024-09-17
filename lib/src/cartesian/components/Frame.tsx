import React from "react";
import { StyleSheet } from "react-native";
import { Path, Skia } from "@shopify/react-native-skia";
import type { FrameProps } from "../../types";

export const Frame = ({
  xScale,
  yScale,
  lineColor = "hsla(0, 0%, 0%, 0.25)",
  lineWidth = StyleSheet.hairlineWidth,
}: FrameProps) => {
  const [x1 = 0, x2 = 0] = xScale.domain();
  const [y1 = 0, y2 = 0] = yScale.domain();

  const boundingFrame = React.useMemo(() => {
    const framePath = Skia.Path.Make();

    framePath.addRect(
      Skia.XYWHRect(
        xScale(x1),
        yScale(y1),
        xScale(x2) - xScale(x1),
        yScale(y2) - yScale(y1),
      ),
    );
    return framePath;
  }, [x1, x2, xScale, y1, y2, yScale]);

  return (
    <Path
      path={boundingFrame}
      strokeWidth={lineWidth}
      style="stroke"
      color={lineColor}
    />
  );
};

export const FrameDefaults = {
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  lineWidth: StyleSheet.hairlineWidth,
};
