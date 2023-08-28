import * as React from "react";
import {
  makeMutable,
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
} from "react-native-reanimated";

export const useChartPressSharedValue = <K extends string>(
  yKeys: K[],
): { state: ChartPressValue<K>; isActive: boolean } => {
  const keys = yKeys.join(",");

  const state = React.useMemo(() => {
    return {
      isActive: makeMutable(false),
      x: { value: makeMutable(0), position: makeMutable(0) },
      y: yKeys.reduce(
        (acc, key) => {
          acc[key] = {
            value: makeMutable(0),
            position: makeMutable(0),
          };
          return acc;
        },
        {} as Record<
          K,
          { value: SharedValue<number>; position: SharedValue<number> }
        >,
      ),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys]);

  const isActive = useIsPressActive(state);

  return { state, isActive };
};

export type ChartPressValue<K extends string> = {
  isActive: SharedValue<boolean>;
  x: { value: SharedValue<number>; position: SharedValue<number> };
  y: Record<K, { value: SharedValue<number>; position: SharedValue<number> }>;
};

const useIsPressActive = <K extends string>(value: ChartPressValue<K>) => {
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
