import {
  type ComposedGesture,
  GestureDetector,
  type GestureType,
} from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import * as React from "react";
import type { GestureHandlerConfig } from "../types";

type GestureHandlerProps = {
  gesture: ComposedGesture | GestureType;
  debug?: boolean;
  config?: GestureHandlerConfig;
};
export const GestureHandler = ({
  gesture,
  debug = false,
  config,
}: GestureHandlerProps) => {
  const style = useAnimatedStyle(() => {
    // Keep the gesture handler fixed over the entire parent container rather
    // than moving it in sync with the chart's transform. When the handler
    // followed the transform, panning or zooming the chart created dead zones:
    // the hit-testable area drifted away from the visible canvas, so touches
    // starting outside the *original* chart bounds were silently dropped.
    //
    // Filling the parent is safe because CartesianChart's handleTouch already
    // compensates for the current pan/zoom offset when mapping a touch position
    // back to a data point — the gesture handler itself does not need to move.
    //
    // Related issue: https://github.com/FormidableLabs/victory-native-xl/issues/515
    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: debug ? "rgba(100, 200, 255, 0.4)" : "transparent",
    };
  });
  return (
    <GestureDetector {...config} gesture={gesture}>
      <Animated.View style={style} />
    </GestureDetector>
  );
};
