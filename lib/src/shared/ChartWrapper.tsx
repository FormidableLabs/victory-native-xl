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
  canvasRef?: React.RefObject<CanvasRef | null>;
  chartContent: React.ReactNode;
  gestureOverlay?: React.ReactNode;
  containerVariant: "cartesian" | "polar";
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
  containerVariant,
  containerStyle,
  canvasStyle,
  wrapCanvasContent,
}: ChartWrapperProps) {
  if (isHeadless) {
    return <Group>{chartContent}</Group>;
  }

  const { width, height } = canvasSize;
  const canvas = (
    <Canvas
      ref={canvasRef}
      style={StyleSheet.flatten([
        containerVariant === "polar"
          ? styles.polarCanvas
          : styles.cartesianCanvas,
        hasMeasuredLayoutSize ? { width, height } : null,
        canvasStyle,
      ])}
    >
      {wrapCanvasContent ? wrapCanvasContent(chartContent) : chartContent}
    </Canvas>
  );

  const inner = (
    <>
      {canvas}
      {gestureOverlay}
    </>
  );

  if (containerVariant === "cartesian") {
    return (
      <GestureHandlerRootView>
        <View
          style={[
            {
              flex: explicitSize ? undefined : 1,
              width: explicitSize?.width,
              height: explicitSize?.height,
              overflow: "hidden",
            },
            containerStyle,
          ]}
          onLayout={explicitSize ? undefined : onLayout}
        >
          {inner}
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <View
      style={[
        styles.polarContainer,
        explicitSize
          ? { width: explicitSize.width, height: explicitSize.height }
          : null,
        containerStyle,
      ]}
      onLayout={explicitSize ? undefined : onLayout}
    >
      <GestureHandlerRootView style={styles.polarGestureRoot}>
        {inner}
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  cartesianCanvas: {
    flex: 1,
  },
  polarContainer: {
    flex: 1,
  },
  polarGestureRoot: {
    flex: 1,
    overflow: "hidden",
  },
  polarCanvas: {
    flex: 1,
  },
});
