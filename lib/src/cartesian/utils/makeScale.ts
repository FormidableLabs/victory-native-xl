import {
  type ScaleLinear,
  scaleLinear,
  scaleLog,
  type ScaleLogarithmic,
} from "d3-scale";
import type { AxisScaleType } from "../../types";

export const makeScale = ({
  inputBounds,
  outputBounds,
  padStart,
  padEnd,
  viewport,
  isNice = false,
  axisScale = "linear",
}: {
  inputBounds: [number, number];
  outputBounds: [number, number];
  viewport?: [number, number];
  padStart?: number;
  padEnd?: number;
  isNice?: boolean;
  axisScale?: AxisScaleType;
}): ScaleLinear<number, number> | ScaleLogarithmic<number, number> => {
  let scale: ScaleLinear<number, number> | ScaleLogarithmic<number, number>;
  const hasViewport = viewport !== undefined;
  const hasPadding = padStart !== undefined || padEnd !== undefined;
  const viewOutputBounds: [number, number] =
    hasViewport && hasPadding
      ? [outputBounds[0] + (padStart ?? 0), outputBounds[1] - (padEnd ?? 0)]
      : outputBounds;

  switch (axisScale) {
    case "log": {
      const viewScale = scaleLog()
        .domain(viewport ?? inputBounds)
        .range(viewOutputBounds);
      scale = scaleLog()
        .domain(inputBounds)
        .range([viewScale(inputBounds[0]), viewScale(inputBounds[1])]);
      break;
    }
    default: {
      const viewScale = scaleLinear()
        .domain(viewport ?? inputBounds)
        .range(viewOutputBounds);
      scale = scaleLinear()
        .domain(inputBounds)
        .range([viewScale(inputBounds[0]), viewScale(inputBounds[1])]);
      break;
    }
  }

  if (!hasViewport && hasPadding) {
    scale
      .domain([
        scale.invert(outputBounds[0] - (padStart ?? 0)),
        scale.invert(outputBounds[1] + (padEnd ?? 0)),
      ])
      .range(outputBounds);
  }

  if (isNice) scale.nice();
  return scale;
};
