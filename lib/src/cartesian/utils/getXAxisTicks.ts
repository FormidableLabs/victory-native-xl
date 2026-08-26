import type { Scale } from "../../types";
import { downsampleTicks } from "../../utils/tickHelpers";

export const getXAxisTicks = ({
  isNumericalData,
  ix,
  tickCount,
  tickValues,
  xScale,
}: {
  isNumericalData: boolean;
  ix: unknown[];
  tickCount: number;
  tickValues?: number[];
  xScale: Pick<Scale, "ticks">;
}) => {
  if (tickValues) {
    return downsampleTicks(tickValues, tickCount);
  }

  if (!isNumericalData) {
    return downsampleTicks(
      ix.map((_, index) => index),
      tickCount,
    );
  }

  return xScale.ticks(tickCount);
};
