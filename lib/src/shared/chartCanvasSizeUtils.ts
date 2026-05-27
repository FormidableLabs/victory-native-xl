import { type ChartExplicitSize } from "./ChartExplicitSize";

export type ChartCanvasSize = ChartExplicitSize;
export type ChartCanvasSizeState = {
  size: ChartCanvasSize;
  hasMeasuredLayoutSize: boolean;
};

export function getInitialChartCanvasSizeState(
  explicitSize?: ChartExplicitSize,
): ChartCanvasSizeState {
  return {
    size: explicitSize ?? { width: 0, height: 0 },
    hasMeasuredLayoutSize: Boolean(explicitSize),
  };
}

export function resolveChartCanvasSizeState(
  layoutSizeState: ChartCanvasSizeState,
  explicitSize?: ChartExplicitSize,
): ChartCanvasSizeState {
  return explicitSize
    ? getInitialChartCanvasSizeState(explicitSize)
    : layoutSizeState;
}

export function isChartHeadless(
  headless?: boolean,
  explicitSize?: ChartExplicitSize,
) {
  return Boolean(headless && explicitSize);
}

export function shouldWarnMissingHeadlessExplicitSize(
  headless?: boolean,
  explicitSize?: ChartExplicitSize,
) {
  return Boolean(headless && !explicitSize);
}

export function applyChartLayoutChange(
  explicitSize: ChartExplicitSize | undefined,
  layout: ChartCanvasSize,
): { size: ChartCanvasSize; hasMeasuredLayoutSize: boolean } | null {
  if (explicitSize) {
    return null;
  }

  return { size: layout, hasMeasuredLayoutSize: true };
}
