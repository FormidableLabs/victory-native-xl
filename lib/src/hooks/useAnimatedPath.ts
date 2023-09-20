import * as React from "react";
import type { SkPath } from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
  type WithSpringConfig,
  withTiming,
  type WithTimingConfig,
  type WithDecayConfig,
  type SharedValue,
  useAnimatedReaction,
} from "react-native-reanimated";
import { usePrevious } from "../utils/usePrevious";

export type PathAnimationConfig =
  | ({ type: "timing" } & WithTimingConfig)
  | ({ type: "spring" } & WithSpringConfig)
  | ({ type: "decay" } & WithDecayConfig);

export const useAnimatedPath = (
  path: SkPath,
  animConfig: PathAnimationConfig = { type: "timing", duration: 300 },
) => {
  const t = useSharedValue(0);
  const prevPath = usePrevious(path);

  React.useEffect(() => {
    const { type, ...rest } = animConfig;
    t.value = 0;
    t.value = (type === "timing" ? withTiming : withSpring)(1, rest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, t]);

  return useDerivedValue<SkPath>(() => {
    if (t.value !== 1 && path.isInterpolatable(prevPath)) {
      return path.interpolate(prevPath, t.value) || path;
    }
    return path;
  });
};

export const useAnimatedDerivedPath = (
  path: SharedValue<SkPath>,
  animConfig: PathAnimationConfig = { type: "timing", duration: 300 },
) => {
  const t = useSharedValue(0);
  const prevPath = useSharedValue(path.value);

  useAnimatedReaction(
    () => path.value,
    (_, prev) => {
      try {
        const { type, ...rest } = animConfig;
        t.value = 0;
        t.value = (type === "timing" ? withTiming : withSpring)(1, rest);

        if (prev) prevPath.value = prev;
      } catch {
        // no-op
      }
    },
  );

  return useDerivedValue<SkPath>(() => {
    try {
      if (t.value !== 1 && path.value.isInterpolatable(prevPath.value)) {
        return path.value.interpolate(prevPath.value, t.value) || path.value;
      }
      return path.value;
    } catch {
      return path.value;
    }
  });
};
