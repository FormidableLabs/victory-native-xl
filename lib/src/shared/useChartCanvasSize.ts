import * as React from "react";
import { type LayoutChangeEvent } from "react-native";
import { type ChartLayoutModeProps } from "./ChartLayoutModeProps";
import {
  applyChartLayoutChange,
  getInitialChartCanvasSizeState,
  isChartHeadless,
} from "./chartCanvasSizeUtils";

export type { ChartCanvasSize } from "./chartCanvasSizeUtils";
export {
  applyChartLayoutChange,
  getInitialChartCanvasSizeState,
  isChartHeadless,
} from "./chartCanvasSizeUtils";

export function useChartCanvasSize({
  explicitSize,
  headless,
}: ChartLayoutModeProps) {
  const [size, setSize] = React.useState(
    () => getInitialChartCanvasSizeState(explicitSize).size,
  );
  const [hasMeasuredLayoutSize, setHasMeasuredLayoutSize] = React.useState(
    () => getInitialChartCanvasSizeState(explicitSize).hasMeasuredLayoutSize,
  );
  const isHeadless = isChartHeadless(headless, explicitSize);

  const onLayout = React.useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      const result = applyChartLayoutChange(explicitSize, layout);
      if (!result) {
        return;
      }

      setHasMeasuredLayoutSize(result.hasMeasuredLayoutSize);
      setSize(result.size);
    },
    [explicitSize],
  );

  return { size, hasMeasuredLayoutSize, onLayout, isHeadless };
}
