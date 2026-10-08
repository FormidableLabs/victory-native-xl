import {
  type LegacyComposedGesture as ComposedGesture,
  GestureDetector,
  type GestureType,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import * as React from "react";
import { useGestureHandlerStyle } from "./GestureHandler.styles";
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
  const style = useGestureHandlerStyle(debug);
  return (
    <GestureDetector {...config} gesture={gesture}>
      <Animated.View style={style} />
    </GestureDetector>
  );
};
