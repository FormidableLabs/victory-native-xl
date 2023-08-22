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
}: {
  inputBounds: [number, number];
  outputBounds: [number, number];
  scaleType: ScaleType;
  padStart?: number;
  padEnd?: number;
}): ScaleLinear<number, number> | ScaleLogarithmic<number, number> => {
  // Linear
  // TODO: Padding
  if (scaleType === "linear") {
    return scaleLinear().domain(inputBounds).range(outputBounds);
  }

  // Log
  // TODO: Padding, clean 0-values
  return scaleLog().domain(inputBounds).range(outputBounds);
};
