import { SharedValue } from "react-native-reanimated";

export type Point = { x: number; y: number };

export type ViewWindow = {
  xMin: SharedValue<number>;
  xMax: SharedValue<number>;
  yMin: SharedValue<number>;
  yMax: SharedValue<number>;
};
