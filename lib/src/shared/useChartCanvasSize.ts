import * as React from "react";
import { type LayoutChangeEvent } from "react-native";
import { type ChartExplicitSize } from "./ChartExplicitSize";
import {
  applyChartLayoutChange,
  getInitialChartCanvasSizeState,
  isChartHeadless,
} from "./chartCanvasSizeUtils";

/** Runtime layout args after prop destructuring (wider than {@link ChartLayoutModeProps}). */
export type UseChartCanvasSizeProps = {
  explicitSize?: ChartExplicitSize;
  headless?: boolean;
};

export type { ChartCanvasSize } from "./chartCanvasSizeUtils";
export {
  applyChartLayoutChange,
  getInitialChartCanvasSizeState,
  isChartHeadless,
} from "./chartCanvasSizeUtils";

export function useChartCanvasSize({
  explicitSize,
  headless,
}: UseChartCanvasSizeProps) {
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
