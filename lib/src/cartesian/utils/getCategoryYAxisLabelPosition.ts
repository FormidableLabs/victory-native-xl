import type { AxisLabelPosition, ChartBounds, YAxisSide } from "../../types";

export const getCategoryYAxisLabelPosition = ({
  axisSide,
  labelPosition,
  labelOffset,
  labelWidth,
  lineCount,
  lineHeight,
  fontSize,
  tickPosition,
  chartBounds,
}: {
  axisSide: YAxisSide;
  labelPosition: AxisLabelPosition;
  labelOffset: number;
  labelWidth: number;
  lineCount: number;
  lineHeight: number;
  fontSize: number;
  tickPosition: number;
  chartBounds: ChartBounds;
}) => {
  const y =
    tickPosition +
    fontSize / 3 -
    Math.max(0, lineCount * lineHeight - fontSize) / 2;
  const x = (() => {
    if (axisSide === "left" && labelPosition === "outset") {
      return chartBounds.left - (labelWidth + labelOffset);
    }
    if (axisSide === "left" && labelPosition === "inset") {
      return chartBounds.left + labelOffset;
    }
    if (axisSide === "right" && labelPosition === "outset") {
      return chartBounds.right + labelOffset;
    }
    return chartBounds.right - (labelWidth + labelOffset);
  })();
  const lastLineY = y + (lineCount - 1) * lineHeight;
  const canFitContent =
    y > chartBounds.top + fontSize / 2 &&
    lastLineY < chartBounds.bottom + fontSize / 2;

  return {
    x,
    y,
    canFitContent,
  };
};
