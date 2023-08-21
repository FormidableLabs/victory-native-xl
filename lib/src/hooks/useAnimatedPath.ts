import * as React from "react";
import type { SkPath } from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { usePrevious } from "../utils/usePrevious";

export const useAnimatedPath = (path: SkPath) => {
  const t = useSharedValue(0);
  const prevPath = usePrevious(path);

  React.useEffect(() => {
    t.value = 0;
    t.value = withTiming(1, { duration: 1000 });
  }, [path]);

  return useDerivedValue(() => {
    if (t.value !== 1 && path.isInterpolatable(prevPath)) {
      return path.interpolate(prevPath, t.value);
    }
    return path;
  });
};
