import React, { useMemo } from "react";
import { Path, Skia } from "@shopify/react-native-skia";
import type { GridProps } from "../../types";

export const CartesianGrid = ({ xScale, yScale, lineColor }: GridProps) => {
  const gridPath = useMemo(() => {
    const [x1 = 0, x2 = 0] = xScale.domain();
    const [y1 = 0, y2 = 0] = yScale.domain();
    const gridPath = Skia.Path.Make();

    gridPath.addRect(
      Skia.XYWHRect(
        xScale(x1),
        yScale(y1),
        xScale(x2) - xScale(x1),
        yScale(y2) - yScale(y1),
      ),
    );
    return gridPath;
  }, [xScale, yScale]);

  return (
    <Path path={gridPath} strokeWidth={1} color={lineColor} style="stroke" />
  );
};

CartesianGrid.defaultProps = {
  lineColor: "hsla(0, 0%, 0%, 0.25)",
} satisfies Partial<GridProps>;
