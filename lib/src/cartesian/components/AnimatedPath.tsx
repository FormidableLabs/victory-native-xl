import * as React from "react";
import type {
  PathProps,
  SkPath,
  SkiaDefaultProps,
} from "@shopify/react-native-skia";
import { Path } from "@shopify/react-native-skia";
import {
  isSharedValue,
  makeMutable,
  type SharedValue,
} from "react-native-reanimated";
import isEqual from "react-fast-compare";
import { usePrevious } from "../../utils/usePrevious";
import {
  type PathAnimationConfig,
  useAnimatedPath,
} from "../../hooks/useAnimatedPath";

type AnimatedPathProps = {
  path: SkPath;
} & SkiaDefaultProps<PathProps, "start" | "end"> & {
    animate?: PathAnimationConfig;
  };

/**
 * IMPORTANT!
 * For some reason, Skia doesn't like mixing shared and non-shared values?
 * Things seem to crash if you mix a derived value for the path with e.g. strings for color.
 * We do a little bit of gymnastics to make sure that all props are shared values.
 */
export function AnimatedPath({
  path,
  animate,
  children,
  ...rest
}: AnimatedPathProps) {
  const p = useAnimatedPath(path, animate);
  const animProps = React.useMemo(() => {
    const vals = {};
    syncPropsToSharedValues(rest, vals);
    return vals;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const prevRest = usePrevious(rest);

  // Sync props to shared values when values change
  React.useEffect(() => {
    if (!isEqual(rest, prevRest)) {
      syncPropsToSharedValues(rest, animProps);
    }
  }, [rest, prevRest, animProps]);

  return (
    <Path path={p} {...animProps}>
      {children}
    </Path>
  );
}

/**
 * Sync prop values to a map of prop -> shared values
 */
const syncPropsToSharedValues = (
  props: Record<string, unknown | SharedValue<unknown>>,
  sharedValues: Record<string, SharedValue<unknown>>,
) => {
  const keysToRemove = new Set(Object.keys(sharedValues));

  for (const key in props) {
    keysToRemove.delete(key);

    const propVal = props[key];
    const shareVal = sharedValues[key];

    // Shared value missing, create it
    if (!shareVal) {
      sharedValues[key] = isSharedValue(propVal)
        ? propVal
        : makeMutable(propVal);
    }
    // Shared value exists, update it if not already a shared value
    else if (!isSharedValue(propVal)) {
      shareVal.value = propVal;
    }
  }

  // Remove keys that didn't get passed in props
  keysToRemove.forEach((key) => {
    delete sharedValues[key];
  });
};
