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
> & { animate?: PathAnimationConfig };

export function AnimatedPath({ path, animate, ...rest }: AnimatedPathProps) {
  const p = useAnimatedPath(path, animate);
  return <Path path={p} {...rest} />;
}
