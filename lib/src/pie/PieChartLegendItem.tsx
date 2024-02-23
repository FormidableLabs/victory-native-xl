import * as React from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { Canvas, Circle, vec } from "@shopify/react-native-skia";
import { Text } from "example/components/Text";
import type { PieSliceData } from "./PieSlice";

type PieChartLegendItemProps = {
  slice: PieSliceData;
  formatLabel?: (label: string) => string;
  containerStyle?: StyleProp<ViewStyle>;
  canvasStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const PieChartLegendItem = (props: PieChartLegendItemProps) => {
  const { slice, formatLabel, containerStyle, canvasStyle, textStyle } = props;
  const { color, label } = slice;
  const displayLabel = formatLabel ? formatLabel(label) : label;
  return (
    <View style={[styles.container, containerStyle]}>
      <Canvas style={[styles.canvas, canvasStyle]}>
        <Circle
          c={vec(styles.canvas.height / 2, styles.canvas.height / 2)}
          r={styles.canvas.height / 2 - 1} // - 1 to prevent clipping
          color={color}
        />
      </Canvas>
      <Text style={[textStyle]}>{displayLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  canvas: {
    height: 12,
    width: 12,
    marginRight: 2,
  },
});
