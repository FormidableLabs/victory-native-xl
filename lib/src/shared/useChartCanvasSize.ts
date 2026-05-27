import * as React from "react";
import { type LayoutChangeEvent } from "react-native";
import { type ChartExplicitSize } from "./ChartExplicitSize";
import {
  applyChartLayoutChange,
  isChartHeadless,
  resolveChartCanvasSizeState,
  shouldWarnMissingHeadlessExplicitSize,
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
  resolveChartCanvasSizeState,
  shouldWarnMissingHeadlessExplicitSize,
} from "./chartCanvasSizeUtils";

export function useChartCanvasSize({
  explicitSize,
  headless,
}: UseChartCanvasSizeProps) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const [hasMeasuredLayoutSize, setHasMeasuredLayoutSize] =
    React.useState(false);
  const isHeadless = isChartHeadless(headless, explicitSize);
  const resolvedChartCanvasSizeState = resolveChartCanvasSizeState(
    { size, hasMeasuredLayoutSize },
    explicitSize,
  );

  React.useEffect(() => {
    if (!shouldWarnMissingHeadlessExplicitSize(headless, explicitSize)) {
      return;
    }

    console.warn(
      "`headless` requires `explicitSize`. Falling back to layout-measured rendering.",
    );
  }, [headless, explicitSize]);

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

  return {
    ...resolvedChartCanvasSizeState,
    onLayout,
    isHeadless,
  };
}
