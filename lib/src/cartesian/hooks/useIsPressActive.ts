import * as React from "react";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import type { ChartPressValue } from "./useChartPressSharedValue";

/**
 * JS-land hook to get the current active-state of a press state object.
 */
export const useIsPressActive = <K extends string>(
  value: ChartPressValue<K>,
) => {
  const [isPressActive, setIsPressActive] = React.useState(
    () => value.isActive.value,
  );

  useAnimatedReaction(
    () => value.isActive.value,
    (val, oldVal) => {
      if (val !== oldVal) runOnJS(setIsPressActive)(val);
    },
  );

  return isPressActive;
};
