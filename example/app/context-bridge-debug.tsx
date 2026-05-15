import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import {
  CartesianChart,
  Line,
  Scatter,
  useCartesianChartContext,
  useCartesianTransformContext,
  useChartTransformState,
} from "victory-native";
import { InfoCard } from "example/components/InfoCard";
import { Text } from "example/components/Text";
import { appColors } from "../consts/colors";
import inter from "../assets/inter-medium.ttf";

const DebugThemeContext = React.createContext({
  lineColor: "#0f766e",
  markerColor: "#f97316",
});

const DATA = Array.from({ length: 12 }, (_, index) => ({
  x: index,
  y: 30 + Math.sin(index / 1.5) * 10 + index,
}));

export default function ContextBridgeDebugScreen() {
  const font = useFont(inter, 12);
  const { state } = useChartTransformState();

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard>
          Issue #626 fixture. The chart child reads external React context,
          Cartesian chart context, and Cartesian transform context from inside
          the Skia canvas.
        </InfoCard>

        <DebugThemeContext.Provider
          value={{ lineColor: "#0f766e", markerColor: "#f97316" }}
        >
          <View style={styles.chartFrame}>
            <CartesianChart
              data={DATA}
              xKey="x"
              yKeys={["y"]}
              padding={{ left: 12, right: 12, top: 24, bottom: 32 }}
              xAxis={{ font, tickCount: 4 }}
              yAxis={[{ font, tickCount: 4 }]}
              transformState={state}
              transformConfig={{
                pan: { enabled: true, dimensions: "x" },
                pinch: { enabled: true },
              }}
              renderOutside={() => <ContextMarker />}
            >
              {({ points }) => <ContextAwareSeries points={points.y} />}
            </CartesianChart>
          </View>
        </DebugThemeContext.Provider>

        <Text style={styles.caption}>
          Expected: teal line, purple points, and orange marker render without
          multiple-renderer provider warnings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ContextAwareSeries({
  points,
}: {
  points: React.ComponentProps<typeof Line>["points"];
}) {
  const theme = React.useContext(DebugThemeContext);
  const { kx } = useCartesianTransformContext();
  const strokeWidth = Math.max(2, 3 / Math.max(Math.abs(kx), 1));

  return (
    <>
      <Line points={points} color={theme.lineColor} strokeWidth={strokeWidth} />
      <Scatter points={points} color="#a78bfa" radius={4} />
    </>
  );
}

function ContextMarker() {
  const theme = React.useContext(DebugThemeContext);
  const { xScale, yScale } = useCartesianChartContext();

  return (
    <Circle
      cx={xScale(DATA.at(-1)!.x)}
      cy={yScale(DATA.at(-1)!.y)}
      r={7}
      color={theme.markerColor}
    />
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
  caption: {
    fontSize: 14,
  },
});
