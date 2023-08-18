import { type SharedValue } from "react-native-reanimated";

export type PrimitiveViewWindow = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export type ViewWindow = {
  xMin: SharedValue<number>;
  xMax: SharedValue<number>;
  yMin: SharedValue<number>;
  yMax: SharedValue<number>;
};

export type InputDatum = Record<string, string | number>;

export type ValueOf<T> = T[keyof T];
export type TransformedData<
  T extends InputDatum,
  XK extends keyof T,
  YK extends keyof T,
> = {
  ix: T[XK][];
  ox: number[];
  y: { [K in YK]: { i: T[K][]; o: number[] } };
};

/**
 * Used for e.g. padding where you can pass a single value or a sided object
 */
export type SidedNumber =
  | number
  | { left?: number; right?: number; top?: number; bottom?: number };

export type ScaleType = "linear" | "log" | "band";
