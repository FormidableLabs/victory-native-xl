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
    return {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: debug ? "rgba(100, 200, 255, 0.4)" : "transparent",
    };
  });
  return (
    <GestureDetector {...config} gesture={gesture}>
      <Animated.View style={style} />
    </GestureDetector>
  );
};
