import type {
  ChartPressState,
  ChartPressStateInit,
} from "../hooks/useChartPressState";

export const resetChartPressState = <Init extends ChartPressStateInit>(
  state: ChartPressState<Init>,
) => {
  state.isActive.value = false;
  state.matchedIndex.value = -1;
  state.yIndex.value = -1;
  state.x.position.value = 0;

  for (const key in state.y) {
    state.y[key].position.value = 0;
  }
};
