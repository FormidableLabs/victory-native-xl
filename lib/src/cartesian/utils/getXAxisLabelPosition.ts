import type { ChartBounds } from "../../types";

export const getXAxisLabelPosition = ({
  tickPosition,
  labelWidth,
  chartBounds,
}: {
  tickPosition: number;
  labelWidth: number;
  chartBounds: Pick<ChartBounds, "left" | "right">;
}) => {
  const labelX = tickPosition - labelWidth / 2;
  const minLabelX = chartBounds.left;
  const maxLabelX = chartBounds.right - labelWidth;
  const clampedLabelX =
    maxLabelX < minLabelX
      ? minLabelX
      : Math.min(Math.max(labelX, minLabelX), maxLabelX);

  return {
    canRenderLabel:
      tickPosition >= chartBounds.left && tickPosition <= chartBounds.right,
    labelX: clampedLabelX,
    labelCenterX: clampedLabelX + labelWidth / 2,
  };
};
