import {
  type ComposedGesture,
  GestureDetector,
  type GestureType,
} from "react-native-gesture-handler";
import {
  Matrix4,
  // convertToAffineMatrix,
  // convertToColumnMajor,
  // type Matrix4,
  type SkRect,
} from "@shopify/react-native-skia";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  type SharedValue,
} from "react-native-reanimated";
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
  derivedScrollX?: SharedValue<number>;
};

// Create worklet for transform calculations
const calculateTransforms = (matrix: Matrix4) => {
  "worklet";
  const decomposed = getTransformComponents(matrix);
  return [
    { translateX: decomposed.translateX },
    { translateY: decomposed.translateY },
    { scaleX: decomposed.scaleX },
    { scaleY: decomposed.scaleY },
  ];
};

export const GestureHandler = ({
  gesture,
  dimensions,
  transformState,
  derivedScrollX,
  debug = false,
}: GestureHandlerProps) => {
  const { x, y, width, height } = dimensions;

  // Memoize static transforms
  const staticTransforms: any = React.useMemo(
    () => [
      { translateX: -width / 2 - x },
      { translateY: -height / 2 },
      { translateX: x + width / 2 },
      { translateY: height / 2 },
    ],
    [width, height, x, y],
  );

  // Derive dynamic transforms using worklet
  const dynamicTransforms = useDerivedValue(() => {
    "worklet";
    if (!transformState?.matrix.value) return [];
    return calculateTransforms(transformState.matrix.value);
  }, [transformState?.matrix]);

  // Optimize style calculation with worklet

  const style = useAnimatedStyle(() => {
    "worklet";
    return {
      position: "absolute",
      backgroundColor: debug ? "rgba(100, 200, 300, 0.4)" : "transparent",
      left: x,
      top: y,
      width,
      height,
      transform: [
        staticTransforms[0],
        staticTransforms[1],
        ...dynamicTransforms.value,
        staticTransforms[2],
        staticTransforms[3],
      ],
    };
  }, [staticTransforms]);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={style} />
    </GestureDetector>
  );
};
