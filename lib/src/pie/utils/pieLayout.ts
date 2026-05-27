import { vec, type SkPoint } from "@shopify/react-native-skia";
import { type ChartCanvasSize } from "../../shared/chartCanvasSizeUtils";
import { computePieLayout } from "./computePieLayout";

export type PieLayout = {
  center: SkPoint;
  radius: number;
  layoutWidth: number;
  layoutHeight: number;
};

export function getPieLayout({
  canvasSize,
  size,
}: {
  canvasSize: ChartCanvasSize;
  size?: number;
}): PieLayout {
  const { centerX, centerY, radius, layoutWidth, layoutHeight } =
    computePieLayout({ canvasSize, size });

  return {
    center: vec(centerX, centerY),
    radius,
    layoutWidth,
    layoutHeight,
  };
}
