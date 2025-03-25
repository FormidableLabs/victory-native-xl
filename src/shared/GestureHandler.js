import { GestureDetector, } from "react-native-gesture-handler";
import { Matrix4, } from "@shopify/react-native-skia";
import Animated, { useAnimatedStyle, useDerivedValue, } from "react-native-reanimated";
import {} from "react-native";
import * as React from "react";
import {} from "../cartesian/hooks/useChartTransformState";
import { getTransformComponents /*identity4*/ } from "../utils/transform";
// Create worklet for transform calculations
const calculateTransforms = (matrix) => {
    "worklet";
    const decomposed = getTransformComponents(matrix);
    return [
        { translateX: decomposed.translateX },
        { translateY: decomposed.translateY },
        { scaleX: decomposed.scaleX },
        { scaleY: decomposed.scaleY },
    ];
};
export const GestureHandler = ({ gesture, dimensions, transformState, derivedScrollX, debug = false, }) => {
    const { x, y, width, height } = dimensions;
    // Memoize static transforms
    const staticTransforms = React.useMemo(() => [
        { translateX: -width / 2 - x },
        { translateY: -height / 2 },
        { translateX: x + width / 2 },
        { translateY: height / 2 },
    ], [width, height, x, y]);
    // Derive dynamic transforms using worklet
    const dynamicTransforms = useDerivedValue(() => {
        "worklet";
        if (!transformState?.matrix.value)
            return [];
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
    return (React.createElement(GestureDetector, { gesture: gesture },
        React.createElement(Animated.View, { style: style })));
};
