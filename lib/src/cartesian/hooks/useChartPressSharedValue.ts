import * as React from "react";
import { makeMutable, type SharedValue } from "react-native-reanimated";

export const useChartPressSharedValue = <K extends string>(
  yKeys: K[],
): ChartPressValue<K> => {
  const keys = yKeys.join(",");

  return React.useMemo(() => {
    return {
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
};

export type ChartPressValue<K extends string> = {
  x: { value: SharedValue<number>; position: SharedValue<number> };
  y: Record<K, { value: SharedValue<number>; position: SharedValue<number> }>;
};
