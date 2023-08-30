import * as React from "react";
import type {
  PathProps,
  SkiaDefaultProps,
  SkPath,
} from "@shopify/react-native-skia";
import { Fill, LinearGradient, Path, vec } from "@shopify/react-native-skia";
import { makeMutable, SharedValue } from "react-native-reanimated";
import isEqual from "react-fast-compare";
import { usePrevious } from "victory-native";
import {
  type PathAnimationConfig,
  useAnimatedPath,
} from "../../hooks/useAnimatedPath";

type AnimatedPathProps = { path: SkPath } & SkiaDefaultProps<
  PathProps,
  "start" | "end"
> & { animate?: PathAnimationConfig };

/**
 * IMPORTANT!
 * Don't try to do the "right thing" and do a spread-pass-thru here.
 * For some reason, doing {...rest} into the <Path /> crashes things on the native side periodically.
 * For whatever reason, manually passing each prop (maybe???) works fine.
 */
export function AnimatedPath({
  path,
  animate,
  children,
  ...rest
}: AnimatedPathProps) {
  const p = useAnimatedPath(path, animate);
  const animProps = React.useRef({});

  const prevRest = usePrevious(rest);

  React.useEffect(() => {
    if (!isEqual(rest, prevRest)) {
      syncPropsToSharedValues(rest, animProps.current);
    }
  });
  // On mount
  React.useEffect(() => {
    syncPropsToSharedValues(rest, animProps.current);
  }, []);

  return <Path path={p} {...animProps.current}></Path>;
}

const syncPropsToSharedValues = (
  props: Record<string, any>,
  sharedValues: Record<string, SharedValue<any>>,
) => {
  for (const key in props) {
    const v = sharedValues[key];
    if (v) {
      v.value = props[key];
    } else {
      sharedValues[key] = makeMutable(props[key]);
    }
  }
};
