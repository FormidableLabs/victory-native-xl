import type { ScaleType } from "../../types";
import {
  type ScaleLinear,
  scaleLinear,
  scaleLog,
  type ScaleLogarithmic,
} from "d3-scale";

export const makeScale = ({
  scaleType,
  inputBounds,
  outputBounds,
  padStart,
  padEnd,
  isNice = false,
}: {
  inputBounds: [number, number];
  outputBounds: [number, number];
  scaleType: ScaleType;
  padStart?: number;
  padEnd?: number;
  isNice?: boolean;
}): ScaleLinear<number, number> | ScaleLogarithmic<number, number> => {
  // Linear
  if (scaleType === "linear") {
    const scale = scaleLinear().domain(inputBounds).range(outputBounds);

    // TODO: These paddings should be based on incoming data
    if (padStart || padEnd) {
      scale
        .domain([
          scale.invert(outputBounds[0] - (padStart ?? 0)),
          scale.invert(outputBounds[1] + (padEnd ?? 0)),
        ])
        .range(outputBounds);
    }

    if (isNice) scale.nice();
    return scale;
  }

  // Log
  // TODO: Padding, clean 0-values
  return scaleLog().domain(inputBounds).range(outputBounds);
};
