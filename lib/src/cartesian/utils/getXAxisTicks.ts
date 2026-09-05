import { scaleTime } from "d3-scale";
import type { Scale } from "../../types";
import { downsampleTicks } from "../../utils/tickHelpers";

export const getXAxisTicks = ({
  isNumericalData,
  isDateData = false,
  ix,
  tickCount,
  tickValues,
  xScale,
}: {
  isNumericalData: boolean;
  isDateData?: boolean;
  ix: unknown[];
  tickCount: number;
  tickValues?: number[];
  xScale: Pick<Scale, "ticks" | "domain">;
}) => {
  if (tickValues) {
    return downsampleTicks(tickValues, tickCount);
  }

  if (isDateData) {
    // Dates are positioned as timestamps on a linear scale, but a linear
    // scale's ticks land on round *numbers* (e.g. 1756000000000), not round
    // dates. Borrow d3's time scale to pick calendar-aware boundaries, then
    // return them as timestamps so every downstream consumer stays numeric.
    const [min, max] = xScale.domain() as [number, number];
    return scaleTime()
      .domain([new Date(min), new Date(max)])
      .ticks(tickCount)
      .map((date) => date.getTime());
  }

  if (!isNumericalData) {
    return downsampleTicks(
      ix.map((_, index) => index),
      tickCount,
    );
  }

  return xScale.ticks(tickCount);
};
