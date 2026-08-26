import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFont } from "@shopify/react-native-skia";
import {
  CartesianChart,
  getTransformComponents,
  Line,
  setScale,
  setTranslate,
  type CartesianChartRenderArg,
  useCartesianTransformContext,
  useChartTransformState,
} from "victory-native";
import { InfoCard } from "example/components/InfoCard";
import { Button } from "../components/Button";
import { appColors } from "../consts/colors";
import inter from "../assets/inter-medium.ttf";

const DATA = Array.from({ length: 24 }, (_, i) => {
  const value = 30 + Math.sin(i / 2) * 8 + i * 0.8;
  return {
    x: i,
    normal: value,
    compensated: value + 16,
  };
});

type Datum = (typeof DATA)[number];
type YKey = "normal" | "compensated";
type Points = CartesianChartRenderArg<Datum, YKey>["points"];

const BASE_STROKE_WIDTH = 8;
const MIN_SCALE = 0.001;

export default function TransformStrokeDebugScreen() {
  const font = useFont(inter, 12);
  const { state } = useChartTransformState();

  const zoomBy = (factor: number) => {
    const { scaleX } = getTransformComponents(state.matrix.value);
    state.matrix.value = setScale(state.matrix.value, scaleX * factor);
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard>
          Issue #540 fixture. The gray line uses a fixed strokeWidth inside the
          transformed chart group. The blue line divides strokeWidth by the
          current transform scale from useCartesianTransformContext.
        </InfoCard>

        <View style={styles.chartFrame}>
          <CartesianChart
            data={DATA}
            xKey="x"
            yKeys={["normal", "compensated"]}
            padding={{ left: 8, right: 8, top: 24, bottom: 32 }}
            xAxis={{ font, tickCount: 5 }}
            yAxis={[{ font, tickCount: 4 }]}
            transformState={state}
            transformConfig={{
              pan: { enabled: true, dimensions: "x" },
              pinch: { enabled: true },
            }}
          >
            {({ points }) => <StrokeComparison points={points} />}
          </CartesianChart>
        </View>

        <View style={styles.controls}>
          <Button
            title="Zoom In"
            style={styles.button}
            onPress={() => zoomBy(1.5)}
          />
          <Button
            title="Zoom Out"
            style={styles.button}
            onPress={() => zoomBy(0.75)}
          />
          <Button
            title="Reset"
            style={styles.button}
            onPress={() => {
              state.matrix.value = setTranslate(
                setScale(state.matrix.value, 1),
                0,
                0,
              );
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StrokeComparison({ points }: { points: Points }) {
  const { kx } = useCartesianTransformContext();
  const strokeScale = Math.max(Math.abs(kx), MIN_SCALE);

  return (
    <>
      <Line
        points={points.normal}
        color="#94a3b8"
        strokeWidth={BASE_STROKE_WIDTH}
      />
      <Line
        points={points.compensated}
        color="#2563eb"
        strokeWidth={BASE_STROKE_WIDTH / strokeScale}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  content: {
    padding: 20,
    gap: 18,
  },
  chartFrame: {
    height: 320,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#94a3b8",
  },
  controls: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
  },
});
