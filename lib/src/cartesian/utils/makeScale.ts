import {
  type ScaleLinear,
  scaleLinear,
  scaleLog,
  type ScaleLogarithmic,
} from "d3-scale";

const scaleFunctions = {
  linear: scaleLinear,
  log: scaleLog,
};

export type AxisScale = keyof typeof scaleFunctions;

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
  axisScale?: keyof typeof scaleFunctions;
}): ScaleLinear<number, number> | ScaleLogarithmic<number, number> => {
  const scaleFunc = scaleFunctions[axisScale];

  // Linear

  //@ts-ignore
  const viewScale = scaleFunc()
    .domain(viewport ?? inputBounds)
    .range(outputBounds);
  //@ts-ignore
  const scale = scaleFunc()
    .domain(inputBounds)
    .range([viewScale(inputBounds[0]), viewScale(inputBounds[1])]);

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
};
