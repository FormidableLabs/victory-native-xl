import * as React from "react";
import { LayoutChangeEvent, Text, View } from "react-native";
import { PropsWithChildren } from "react";
import { scaleLinear, scalePoint } from "d3-scale";
import { Point, Scales } from "./types";
import { Canvas } from "@shopify/react-native-skia";
import { CHART_HORIZONTAL_PADDING, CHART_VERTICAL_PADDING } from "./consts";

type Props<T extends Point> = {
  data: T[];
};

export function CartesianChart<T extends Point>({
  data,
  children,
}: PropsWithChildren<Props<T>>) {
  // Managing
  const [canvasDimensions, setCanvasDimensions] = React.useState([0, 0]);
  const onLayout = React.useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setCanvasDimensions([layout.width, layout.height]);
    },
    [],
  );

  const scales = React.useMemo<Scales>(() => {
    const xMin = Math.min(...data.map((d) => d.x));
    const xMax = Math.max(...data.map((d) => d.x));
    const yMin = Math.min(...data.map((d) => d.y));
    const yMax = Math.max(...data.map((d) => d.y));

    const xScale = scaleLinear()
      .domain([xMin, xMax])
      .range([
        CHART_HORIZONTAL_PADDING,
        canvasDimensions[0] - CHART_HORIZONTAL_PADDING,
      ]);
    const yScale = scaleLinear()
      .domain([yMin, yMax])
      .range([
        canvasDimensions[1] - CHART_VERTICAL_PADDING,
        CHART_VERTICAL_PADDING,
      ]);

    return {
      x: xScale,
      y: yScale,
      xMin: xScale(xMin),
      xMax: xScale(xMax),
      yMin: yScale(yMin),
      yMax: yScale(yMax),
    };
  }, [data, canvasDimensions]);

  const c = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return null;
    return React.cloneElement(child, { data, scales });
  });

  return (
    <Canvas style={{ flex: 1 }} onLayout={onLayout}>
      {c}
    </Canvas>
  );
}
