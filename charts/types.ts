import { ScaleLinear } from "d3-scale";

export type Point = { x: number; y: number };

export type Scales = {
  x: ScaleLinear<number, number, never>;
  y: ScaleLinear<number, number, never>;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};
