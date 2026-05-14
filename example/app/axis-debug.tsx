import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { CartesianChart, Line, Scatter } from "victory-native";
import { InfoCard } from "example/components/InfoCard";
import { Text } from "example/components/Text";
import { appColors } from "../consts/colors";
import inter from "../assets/inter-medium.ttf";

const DATA = [
  { x: 1732924800000, y: 115907.5 },
  { x: 1735603200000, y: 116531.42 },
  { x: 1738281600000, y: 126870.02 },
];

const TICK_VALUES = DATA.map((datum) => datum.x);

const formatDateLabel = (value: number) => {
  if (!value) return "";
  const date = new Date(value);
  return `${date.toLocaleString("default", { month: "short" })} ${date.getDate()}`;
};

export default function AxisDebugScreen() {
  const font = useFont(inter, 12);

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard>
          Axis debug fixture for x-axis edge labels. The first and last labels
          should stay visible without domainPadding shifting the plotted line.
        </InfoCard>

        <Text style={styles.heading}>Issue #492 Repro</Text>
        <AxisCase font={font} />

        <Text style={styles.heading}>Right Y Axis</Text>
        <AxisCase font={font} yAxisSide="right" />

        <Text style={styles.heading}>Rotated Labels</Text>
        <AxisCase font={font} labelRotate={35} />

        <Text style={styles.heading}>Top Axis</Text>
        <AxisCase font={font} axisSide="top" />

        <Text style={styles.heading}>No X Ticks</Text>
        <AxisCase font={font} labelRotate={35} tickValues={[]} />
      </ScrollView>
    </SafeAreaView>
  );
}

function AxisCase({
  font,
  axisSide = "bottom",
  yAxisSide = "left",
  labelRotate = 0,
  tickValues = TICK_VALUES,
}: {
  font: ReturnType<typeof useFont>;
  axisSide?: "top" | "bottom";
  yAxisSide?: "left" | "right";
  labelRotate?: number;
  tickValues?: number[];
}) {
  return (
    <View style={styles.chartFrame}>
      <CartesianChart
        data={DATA}
        xKey="x"
        yKeys={["y"]}
        padding={{ bottom: 24, top: 24 }}
        xAxis={{
          font,
          axisSide,
          labelRotate,
          tickCount: tickValues.length,
          tickValues,
          formatXLabel: formatDateLabel,
        }}
        yAxis={[
          {
            font,
            axisSide: yAxisSide,
            tickCount: 3,
            formatYLabel: (value) => `${Math.round(Number(value) / 1000)}k`,
          },
        ]}
      >
        {({ points }) => (
          <>
            <Line points={points.y} color="#2563eb" strokeWidth={3} />
            <Scatter points={points.y} color="#a78bfa" radius={4} />
          </>
        )}
      </CartesianChart>
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
  heading: {
    fontSize: 24,
    fontWeight: "700",
  },
  chartFrame: {
    height: 260,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#a78bfa",
  },
});
