import * as React from "react";
import type {
  PathProps,
  SkiaDefaultProps,
  SkPath,
} from "@shopify/react-native-skia";
import { Path } from "@shopify/react-native-skia";
import { convertToRGBA, useDerivedValue } from "react-native-reanimated";
import {
  type PathAnimationConfig,
  useAnimatedPath,
} from "../../hooks/useAnimatedPath";

type AnimatedPathProps = { path: SkPath } & SkiaDefaultProps<
  PathProps,
  "start" | "end"
> & { animate?: PathAnimationConfig };

export function AnimatedPath({
  path,
  animate,
  color,
  ...rest
}: AnimatedPathProps) {
  const p = useAnimatedPath(path, animate);

  // this is done to fix a potential crash with Skia
  // where the color prop must also be a shared/derived value
  // if the path is a shared/derived value.
  const myColor = useDerivedValue(() =>
    color ? convertToRGBA(color) : undefined,
  );

  return <Path path={p} color={myColor} {...rest} />;
}
