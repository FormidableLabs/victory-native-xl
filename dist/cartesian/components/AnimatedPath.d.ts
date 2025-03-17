import * as React from "react";
import type { PathProps, SkPath, SkiaDefaultProps } from "@shopify/react-native-skia";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";
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
export declare function AnimatedPath({ path, animate, children, ...rest }: AnimatedPathProps): React.JSX.Element;
export {};
