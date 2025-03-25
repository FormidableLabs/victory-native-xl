import * as React from "react";
import { Canvas, Group } from "@shopify/react-native-skia";
import { StyleSheet, View, } from "react-native";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import { FiberProvider, useContextBridge } from "its-fine";
import { PolarChartProvider } from "./contexts/PolarChartContext";
import {} from "../cartesian/hooks/useChartTransformState";
import { panTransformGesture, pinchTransformGesture, } from "../cartesian/utils/transformGestures";
import { GestureHandler } from "../shared/GestureHandler";
const PolarChartBase = (props) => {
    const { containerStyle, canvasStyle, children, onLayout, hasMeasuredLayoutSize, canvasSize, transformState, } = props;
    const { width, height } = canvasSize;
    const Bridge = useContextBridge();
    let composed = Gesture.Race();
    if (transformState) {
        composed = Gesture.Race(composed, pinchTransformGesture(transformState), panTransformGesture(transformState));
    }
    return (React.createElement(View, { style: [styles.baseContainer, containerStyle] },
        React.createElement(GestureHandlerRootView, { style: { flex: 1, overflow: "hidden" } },
            React.createElement(Canvas, { onLayout: onLayout, style: StyleSheet.flatten([
                    styles.canvasContainer,
                    hasMeasuredLayoutSize ? { width, height } : null,
                    canvasStyle,
                ]) },
                React.createElement(Bridge, null,
                    React.createElement(Group, { matrix: transformState?.matrix }, children))),
            React.createElement(GestureHandler, { gesture: composed, dimensions: { x: 0, y: 0, width: width, height: height } }))));
};
export const PolarChart = (props) => {
    const { data, labelKey, colorKey, valueKey } = props;
    const [canvasSize, setCanvasSize] = React.useState({ width: 0, height: 0 });
    const [hasMeasuredLayoutSize, setHasMeasuredLayoutSize] = React.useState(false);
    const onLayout = React.useCallback(({ nativeEvent: { layout } }) => {
        setHasMeasuredLayoutSize(true);
        setCanvasSize(layout);
    }, []);
    return (React.createElement(FiberProvider, null,
        React.createElement(PolarChartProvider, { data: data, labelKey: labelKey.toString(), colorKey: colorKey.toString(), valueKey: valueKey.toString(), canvasSize: canvasSize },
            React.createElement(PolarChartBase, { ...props, onLayout: onLayout, hasMeasuredLayoutSize: hasMeasuredLayoutSize, canvasSize: canvasSize }))));
};
const styles = StyleSheet.create({
    baseContainer: {
        flex: 1,
    },
    canvasContainer: {
        flex: 1,
    },
});
