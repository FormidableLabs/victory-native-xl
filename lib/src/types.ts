import { type SharedValue } from "react-native-reanimated";

export type Point = { x: number; y: number };

export type ViewWindow = {
  xMin: SharedValue<number>;
  xMax: SharedValue<number>;
  yMin: SharedValue<number>;
  yMax: SharedValue<number>;
};

export type InputDatum = Record<string, string | number>;
export type MassagedData = {
  x: number[];
  _x?: (number | string)[];
  y: Record<string, number[]>;
};

/**
 * Used for e.g. padding where you can pass a single value or a sided object
 */
export type SidedNumber =
  | number
  | { left?: number; right?: number; top?: number; bottom?: number };
