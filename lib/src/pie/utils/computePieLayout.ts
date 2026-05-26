import { type ChartCanvasSize } from "../../shared/chartCanvasSizeUtils";

export type ComputedPieLayout = {
  centerX: number;
  centerY: number;
  radius: number;
  layoutWidth: number;
  layoutHeight: number;
};

export function computePieLayout({
  canvasSize,
  size,
}: {
  canvasSize: ChartCanvasSize;
  size?: number;
}): ComputedPieLayout {
  const layoutWidth = size ?? canvasSize.width;
  const layoutHeight = size ?? canvasSize.height;
  const radius = Math.min(layoutWidth, layoutHeight) / 2;
  const centerX = (canvasSize.width - layoutWidth) / 2 + layoutWidth / 2;
  const centerY = (canvasSize.height - layoutHeight) / 2 + layoutHeight / 2;

  return { centerX, centerY, radius, layoutWidth, layoutHeight };
}
