import React from "react";
import { StyleSheet } from "react-native";
import { Group, Line, Path, Skia, vec } from "@shopify/react-native-skia";
import type { FrameProps } from "../../types";

export const Frame = ({
  xScale,
  yScale,
  lineColor,
  lineWidth,
  linePathEffect,
}: FrameProps) => {
  const [x1 = 0, x2 = 0] = xScale.domain();
  const [y1 = 0, y2 = 0] = yScale.domain();

  const boundingFrame = React.useMemo(() => {
    const framePath = Skia.Path.Make();

    if (typeof lineWidth === "number") {
      framePath.addRect(
        Skia.XYWHRect(
          xScale(x1),
          yScale(y1),
          xScale(x2) - xScale(x1),
          yScale(y2) - yScale(y1),
        ),
      );

      return <Path path={framePath} strokeWidth={lineWidth} />;
    } else {
      const lines = [];
      const _lineWidth = {
        top: StyleSheet.hairlineWidth,
        right: StyleSheet.hairlineWidth,
        bottom: StyleSheet.hairlineWidth,
        left: StyleSheet.hairlineWidth,
        ...lineWidth,
      };

      if (_lineWidth.top > 0) {
        lines.push(
          <Line
            p1={vec(xScale(x1), yScale(y1))}
            p2={vec(xScale(x2), yScale(y1))}
            strokeWidth={lineWidth.top}
          />,
        );
      }
      if (_lineWidth.right > 0) {
        lines.push(
          <Line
            p1={vec(xScale(x2), yScale(y1))}
            p2={vec(xScale(x2), yScale(y2))}
            strokeWidth={lineWidth.right}
          />,
        );
      }
      if (_lineWidth.bottom > 0) {
        lines.push(
          <Line
            p1={vec(xScale(x2), yScale(y2))}
            p2={vec(xScale(x1), yScale(y2))}
            strokeWidth={lineWidth.bottom}
          />,
        );
      }
      if (_lineWidth.left > 0) {
        lines.push(
          <Line
            p1={vec(xScale(x1), yScale(y2))}
            p2={vec(xScale(x1), yScale(y1))}
            strokeWidth={lineWidth.left}
          />,
        );
      }
      return lines;
    }
  }, [x1, x2, xScale, y1, y2, yScale, lineWidth]);

  if (typeof lineWidth === "number" && lineWidth <= 0) {
    return null;
  }

  // return boundingFrame;
  return (
    <Group color={lineColor} style="stroke">
      {linePathEffect}
      {boundingFrame}
    </Group>
  );
};

export const FrameDefaults = {
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  lineWidth: StyleSheet.hairlineWidth,
};
