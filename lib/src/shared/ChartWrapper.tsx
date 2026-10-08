import * as React from "react";
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Canvas, Group, type CanvasRef } from "react-native-skia";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { styles, sizeStyle } from "./ChartWrapper.styles";
import { type ChartExplicitSize } from "./ChartExplicitSize";
import { type ChartCanvasSize } from "./chartCanvasSizeUtils";

type ChartWrapperProps = {
  isHeadless: boolean;
  explicitSize?: ChartExplicitSize;
  onLayout: (e: LayoutChangeEvent) => void;
  hasMeasuredLayoutSize: boolean;
  canvasSize: ChartCanvasSize;
  canvasRef?: React.Ref<CanvasRef>;
  chartContent: React.ReactNode;
  gestureOverlay?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  canvasStyle?: StyleProp<ViewStyle>;
  wrapCanvasContent?: (content: React.ReactNode) => React.ReactNode;
};

export function ChartWrapper({
  isHeadless,
  explicitSize,
  onLayout,
  hasMeasuredLayoutSize,
  canvasSize,
  canvasRef,
  chartContent,
  gestureOverlay,
  containerStyle,
  canvasStyle,
  wrapCanvasContent,
}: ChartWrapperProps) {
  if (isHeadless) {
    return <Group>{chartContent}</Group>;
  }

  const { width, height } = canvasSize;

  return (
    <GestureHandlerRootView>
      <View
        style={[
          !explicitSize && styles.flex1,
          styles.overflowHidden,
          explicitSize
            ? sizeStyle(explicitSize.width, explicitSize.height)
            : null,
          containerStyle,
        ]}
        onLayout={explicitSize ? undefined : onLayout}
      >
        <Canvas
          ref={canvasRef}
          style={StyleSheet.flatten([
            styles.flex1,
            hasMeasuredLayoutSize ? sizeStyle(width, height) : null,
            canvasStyle,
          ])}
        >
          {wrapCanvasContent ? wrapCanvasContent(chartContent) : chartContent}
        </Canvas>
        {gestureOverlay}
      </View>
    </GestureHandlerRootView>
  );
}
