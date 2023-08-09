import { scaleLinear } from "d3-scale";
import { Scales } from "./types";

export const CHART_HORIZONTAL_PADDING = 20;
export const CHART_VERTICAL_PADDING = 20;

export const BAR_WIDTH = 12;

export const DEFAULT_SCALES: Scales = {
  x: scaleLinear(),
  y: scaleLinear(),
  xMin: 0,
  xMax: 0,
  yMin: 0,
  yMax: 0,
};
