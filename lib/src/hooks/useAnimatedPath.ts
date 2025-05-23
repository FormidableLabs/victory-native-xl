import { Skia, type SkPath } from "@shopify/react-native-skia";
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
  currentPathProp: SkPath,
  animConfig: PathAnimationConfig = { type: "timing", duration: 300 },
) => {
  const progressSV = useSharedValue(0);

  // fromPathSV stores the SkPath object we are animating FROM. Initialized with a copy.
  const fromPathSV = useSharedValue<SkPath>(currentPathProp.copy());
  // targetPathSV stores the SkPath object we are animating TO. Initialized with a copy.
  const targetPathSV = useSharedValue<SkPath>(currentPathProp.copy());

  // This effect synchronizes prop changes to our shared values and triggers animations.
  React.useEffect(() => {
    // The current `targetPathSV.value` was the target of the *previous* animation (or initial state).
    // This becomes the starting point for our new animation.
    // Ensure we use .copy() to avoid shared mutable object issues.
    fromPathSV.value = targetPathSV.value.copy();

    // The new `currentPathProp` is our new animation target.
    targetPathSV.value = currentPathProp.copy();

    // Reset progress and start animation
    progressSV.value = 0;
    if (isWithTimingConfig(animConfig)) {
      progressSV.value = withTiming(1, animConfig);
    } else if (isWithSpringConfig(animConfig)) {
      progressSV.value = withSpring(1, animConfig);
    } else if (isWithDecayConfig(animConfig)) {
      progressSV.value = withDecay(animConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPathProp, animConfig]);

  const animatedPath = useDerivedValue<SkPath>(() => {
    const t = progressSV.value;
    const from = fromPathSV.value;
    const to = targetPathSV.value;

    if (t === 0) {
      return from;
    }
    if (t === 1) {
      return to;
    }

    // 1. Try direct Skia interpolation first (most performant and reliable)
    if (to && from && to.isInterpolatable(from)) {
      const interpolated = to.interpolate(from, t);
      if (interpolated) {
        return interpolated;
      }
    }

    // 2. Fallback: SVG string manipulation with precision normalization
    // This was identified as potentially problematic for pie charts if direct interpolation failed.
    const normalizePrecision = (svgPathStr: string): string =>
      svgPathStr.replace(/(\d+\.\d+)/g, (match) =>
        parseFloat(match).toFixed(3),
      );

    const toSVG = to?.toSVGString();
    const fromSVG = from?.toSVGString();

    if (toSVG && fromSVG) {
      const toNormalized = Skia.Path.MakeFromSVGString(
        normalizePrecision(toSVG),
      );
      const fromNormalized = Skia.Path.MakeFromSVGString(
        normalizePrecision(fromSVG),
      );

      if (
        toNormalized &&
        fromNormalized &&
        toNormalized.isInterpolatable(fromNormalized)
      ) {
        const interpolatedNormalized = toNormalized.interpolate(
          fromNormalized,
          t,
        );
        if (interpolatedNormalized) {
          return interpolatedNormalized;
        }
      }
    }

    // 3. Final fallback: if all interpolation fails, snap to the closest path
    return t > 0.5 ? to : from;
  }, []);

  return animatedPath;
};
