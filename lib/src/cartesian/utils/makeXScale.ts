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
  // TODO: Padding
  if (scaleType === "linear") {
    const scale = scaleLinear().domain(inputBounds).range(outputBounds);
    if (isNice) scale.nice();
    return scale;
  }

  // Log
  // TODO: Padding, clean 0-values
  return scaleLog().domain(inputBounds).range(outputBounds);
};
