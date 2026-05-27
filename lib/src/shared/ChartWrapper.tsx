import * as React from "react";
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Canvas, Group, type CanvasRef } from "@shopify/react-native-skia";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
            ? { width: explicitSize.width, height: explicitSize.height }
            : null,
          containerStyle,
        ]}
        onLayout={explicitSize ? undefined : onLayout}
      >
        <Canvas
          ref={canvasRef}
          style={StyleSheet.flatten([
            styles.flex1,
            hasMeasuredLayoutSize ? { width, height } : null,
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

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  overflowHidden: {
    overflow: "hidden",
  },
});
