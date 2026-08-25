import { Skia, type SkPath } from "@shopify/react-native-skia";

export const interpolatePath = (
  from: SkPath,
  to: SkPath,
  t: number,
): SkPath | null => {
  "worklet";

  // Skia weights the first path by t and the second path by 1 - t.
  return Skia.Path.Interpolate(to, from, t);
};
