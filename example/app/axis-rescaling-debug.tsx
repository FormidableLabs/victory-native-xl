import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { CartesianChart, Line, useChartTransformState } from "victory-native";
import { InfoCard } from "example/components/InfoCard";
import { Text } from "example/components/Text";
import { appColors } from "../consts/colors";
import inter from "../assets/inter-medium.ttf";

const DATA = Array.from({ length: 12 }, (_, index) => ({
  label: String(index + 1),
  x: index,
  y: 11 + Math.sin(index * 0.8) * 1.5 + index * 0.08,
}));

const VIEWPORT = { x: [5, 11] as [number, number] };

export default function AxisRescalingDebugScreen() {
  const font = useFont(inter, 10);
  const { state: fixedTicksState } = useChartTransformState();
  const { state: rescaledTicksState } = useChartTransformState();

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard>
          Issue #624 fixture. Both charts start on the last seven points. Pan
          each chart horizontally: the first chart keeps initial ticks fixed;
          the second recomputes ticks from the transformed scale.
        </InfoCard>

        <AxisCase
          title="Fixed Initial Ticks"
          font={font}
          transformState={fixedTicksState}
          enableRescaling={false}
        />

        <AxisCase
          title="Rescaled Ticks"
          font={font}
          transformState={rescaledTicksState}
          enableRescaling
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function AxisCase({
  title,
  font,
  transformState,
  enableRescaling,
}: {
  title: string;
  font: ReturnType<typeof useFont>;
  transformState: ReturnType<typeof useChartTransformState>["state"];
  enableRescaling: boolean;
}) {
  return (
    <View style={styles.caseBlock}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartFrame}>
        <CartesianChart
          data={DATA}
          xKey="x"
          yKeys={["y"]}
          viewport={VIEWPORT}
          padding={{ left: 8, right: 8, top: 16, bottom: 32 }}
          transformState={transformState}
          transformConfig={{
            pan: { enabled: true, dimensions: "x" },
            pinch: { enabled: false },
          }}
          xAxis={{
            font,
            tickCount: 6,
            enableRescaling,
            formatXLabel: (value) => {
              const datum = DATA.find((item) => item.x === value);
              return datum?.label ?? String(value);
            },
          }}
          yAxis={[{ font, tickCount: 3, labelPosition: "inset" }]}
        >
          {({ points }) => (
            <Line points={points.y} color="#2563eb" strokeWidth={3} />
          )}
        </CartesianChart>
      </View>
    </View>
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
  caseBlock: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  chartFrame: {
    height: 240,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#94a3b8",
  },
});
