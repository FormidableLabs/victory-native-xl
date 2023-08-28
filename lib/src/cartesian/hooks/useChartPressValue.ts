import * as React from "react";
import { makeMutable, type SharedValue } from "react-native-reanimated";
import { type NumericalFields } from "../../types";

export const useChartPressValue = <
  RawData extends Record<string, unknown>,
  T extends NumericalFields<RawData>,
  YK extends keyof T,
>(
  _data: RawData[],
  yKeys: YK[],
): ChartPressValue<RawData, T, YK> => {
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
          YK,
          { value: SharedValue<number>; position: SharedValue<number> }
        >,
      ),
    };
  }, [yKeys.join(",")]);
};

export type ChartPressValue<
  RawData extends Record<string, unknown>,
  T extends NumericalFields<RawData>,
  YK extends keyof T,
> = {
  x: { value: SharedValue<number>; position: SharedValue<number> };
  y: Record<YK, { value: SharedValue<number>; position: SharedValue<number> }>;
};
