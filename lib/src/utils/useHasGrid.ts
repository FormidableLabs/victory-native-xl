import * as React from "react";
import { Grid } from "../grid/Grid";

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
  };
};
