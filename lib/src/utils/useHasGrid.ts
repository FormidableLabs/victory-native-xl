import * as React from "react";
import { Grid } from "../grid/Grid";
import type { InputDatum, ValueOf } from "../types";

export const useHasGrid = (children: (args: never) => React.ReactNode) => {
  const chartNodes = children({ paths: [] } as never) as React.ReactElement;
  const grid = React.useMemo(
    () =>
      chartNodes?.props?.children
        ?.filter?.((node: React.ReactElement) => node?.type === Grid)
        ?.at(0),
    [children],
  );

  return {
    hasGrid: Boolean(grid),
    font: grid?.props?.font,
    formatYLabel: grid?.props?.formatXLabel ?? ((s: ValueOf<InputDatum>) => s),
    labelOffset: grid?.props?.labelOffset ?? 0,
  };
};
