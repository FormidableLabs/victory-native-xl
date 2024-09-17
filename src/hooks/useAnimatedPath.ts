import type { SkPath } from "@shopify/react-native-skia";
import * as React from "react";
import {
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
  type WithDecayConfig,
  type WithSpringConfig,
  type WithTimingConfig,
} from "react-native-reanimated";

export type PathAnimationConfig =
  | ({ type: "timing" } & WithTimingConfig)
  | ({ type: "spring" } & WithSpringConfig)
  | ({ type: "decay" } & WithDecayConfig);

function isWithDecayConfig(
  config: PathAnimationConfig,
): config is WithDecayConfig & { type: "decay" } {
  return config.type === "decay";
}

function isWithTimingConfig(
  config: PathAnimationConfig,
): config is WithTimingConfig & { type: "timing" } {
  return config.type === "timing";
}

function isWithSpringConfig(
  config: PathAnimationConfig,
): config is WithSpringConfig & { type: "spring" } {
  return config.type === "spring";
}

export const useAnimatedPath = (
  path: SkPath,
  animConfig: PathAnimationConfig = { type: "timing", duration: 300 },
) => {
  const t = useSharedValue(0);
  const [prevPath, setPrevPath] = React.useState(path);

  React.useEffect(() => {
    t.value = 0;
    if (isWithTimingConfig(animConfig)) {
      t.value = withTiming(1, animConfig);
    } else if (isWithSpringConfig(animConfig)) {
      t.value = withSpring(1, animConfig);
    } else if (isWithDecayConfig(animConfig)) {
      t.value = withDecay(animConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, t]);

  const currentPath = useDerivedValue<SkPath>(() => {
    if (t.value !== 1 && path.isInterpolatable(prevPath)) {
      return path.interpolate(prevPath, t.value) || path;
    }
    return path;
  });

  React.useEffect(() => {
    setPrevPath(currentPath.value);
  }, [currentPath, path]);

  return currentPath;
};
