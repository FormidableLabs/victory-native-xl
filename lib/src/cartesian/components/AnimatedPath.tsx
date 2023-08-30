import * as React from "react";
import type {
  PathProps,
  SkiaDefaultProps,
  SkPath,
} from "@shopify/react-native-skia";
import { Fill, LinearGradient, Path, vec } from "@shopify/react-native-skia";
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
  style,
  color,
  strokeWidth,
  strokeJoin,
  strokeCap,
  strokeMiter,
  antiAlias,
  opacity,
  stroke,
  children,
}: AnimatedPathProps) {
  const p = useAnimatedPath(path, animate);
  return (
    <Path
      path={p}
      style={style}
      strokeWidth={strokeWidth}
      strokeJoin={strokeJoin}
      strokeCap={strokeCap}
      strokeMiter={strokeMiter}
      antiAlias={antiAlias}
      opacity={opacity}
      stroke={stroke}
    >
      {color && (
        <LinearGradient
          start={vec(0, 0)}
          end={vec(1, 1)}
          colors={[String(color)]}
        />
      )}
      {children}
    </Path>
  );
}
