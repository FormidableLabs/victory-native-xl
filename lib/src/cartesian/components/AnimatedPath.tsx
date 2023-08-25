import * as React from "react";
import type {
  PathProps,
  SkiaDefaultProps,
  SkPath,
} from "@shopify/react-native-skia";
import { Path } from "@shopify/react-native-skia";
import {
  type PathAnimationConfig,
  useAnimatedPath,
} from "../../hooks/useAnimatedPath";

type AnimatedPathProps = { path: SkPath } & SkiaDefaultProps<
  PathProps,
  "start" | "end"
> & { animationConfig?: PathAnimationConfig };

export function AnimatedPath({
  path,
  animationConfig,
  ...rest
}: AnimatedPathProps) {
  const p = useAnimatedPath(path, animationConfig);
  return <Path path={p} {...rest} />;
}
