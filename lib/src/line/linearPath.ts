import { Skia } from "@shopify/react-native-skia";

export const makeLinearPath = (ox: number[], oy: number[]) => {
  const path = Skia.Path.Make();
  if (!ox.length) return path;

  path.moveTo(ox[0]!, oy[0]!);
  let yVal = 0 as number | undefined;
  ox.forEach((val, i) => {
    yVal = oy[i];
    yVal !== undefined && path.lineTo(val, yVal);
  });

  return path;
};
