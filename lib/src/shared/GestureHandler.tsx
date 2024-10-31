import {
  type ComposedGesture,
  GestureDetector,
  type GestureType,
} from "react-native-gesture-handler";
import {
  convertToAffineMatrix,
  convertToColumnMajor,
  type Matrix4,
  type SkRect,
} from "@shopify/react-native-skia";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Platform } from "react-native";
import * as React from "react";
import { type ChartTransformState } from "../cartesian/hooks/useChartTransformState";
import { identity4 } from "../utils/transform";

type GestureHandlerProps = {
  gesture: ComposedGesture | GestureType;
  dimensions: SkRect;
  transformState?: ChartTransformState;
  debug?: boolean;
};
export const GestureHandler = ({
  gesture,
  dimensions,
  transformState,
  debug = false,
}: GestureHandlerProps) => {
  const { x, y, width, height } = dimensions;
  const style = useAnimatedStyle(() => {
    let m4: Matrix4 = identity4;
    if (transformState?.matrix.value) {
      m4 = convertToColumnMajor(transformState.matrix.value);
    }
    return {
      position: "absolute",
      backgroundColor: debug ? "rgba(100, 200, 300, 0.4)" : "transparent",
      x,
      y,
      width,
      height,
      transform: [
        { translateX: -width / 2 },
        { translateY: -height / 2 },
        {
          matrix: m4
            ? Platform.OS === "web"
              ? convertToAffineMatrix(m4)
              : (m4 as unknown as number[])
            : [],
        },
        { translateX: width / 2 },
        { translateY: height / 2 },
      ],
    };
  });
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={style} />
    </GestureDetector>
  );
};
