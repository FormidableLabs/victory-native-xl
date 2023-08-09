import { ScaleLinear } from "d3-scale";
import { SharedValue } from "react-native-reanimated";

export type Point = { x: number; y: number };

export type Scales = {
  x: ScaleLinear<number, number, never>;
  y: ScaleLinear<number, number, never>;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export type IncomingProps = {
  data: Point[];
  ixmin: SharedValue<number>;
  ixmax: SharedValue<number>;
  iymin: SharedValue<number>;
  iymax: SharedValue<number>;
  oxmin: SharedValue<number>;
  oxmax: SharedValue<number>;
  oymin: SharedValue<number>;
  oymax: SharedValue<number>;
};
