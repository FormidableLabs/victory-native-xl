import {
  type ComposedGesture,
  GestureDetector,
  type GestureType,
} from "react-native-gesture-handler";
import {
  // convertToAffineMatrix,
  // convertToColumnMajor,
  // type Matrix4,
  type SkRect,
} from "@shopify/react-native-skia";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import {
  /*Platform, type TransformsStyle,*/ type ViewStyle,
} from "react-native";
import * as React from "react";
import { type ChartTransformState } from "../cartesian/hooks/useChartTransformState";
import { getTransformComponents /*identity4*/ } from "../utils/transform";

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
    // let m4: Matrix4 = identity4;
    let transforms: ViewStyle["transform"] = [];
    if (transformState?.matrix.value) {
      const decomposed = getTransformComponents(transformState.matrix.value);
      transforms = [
        { translateX: decomposed.translateX },
        { translateY: decomposed.translateY },
        { scaleX: decomposed.scaleX },
        { scaleY: decomposed.scaleY },
      ];
      // m4 = convertToColumnMajor(transformState.matrix.value);
    }
    return {
      position: "absolute",
      backgroundColor: debug ? "rgba(100, 200, 300, 0.4)" : "transparent",
      // x,
      // y,
      left: x,
      top: y,
      width,
      height,
      transform: [
        { translateX: -width / 2 - x },
        { translateY: -height / 2 },
        // Running into issues using 'matrix' transforms when enabling the new arch:
        // https://github.com/facebook/react-native/issues/47467
        // {
        //   matrix: m4
        //     ? Platform.OS === "web"
        //       ? convertToAffineMatrix(m4)
        //       : undefined
        //     : undefined,
        // },
        ...transforms,
        { translateX: x + width / 2 },
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
