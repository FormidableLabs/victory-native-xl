import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import type { Color } from "@shopify/react-native-skia";
import { Pie, PolarChart } from "victory-native";
import { Button } from "../components/Button";
import { InfoCard } from "../components/InfoCard";
import { Text } from "../components/Text";
import { appColors } from "../consts/colors";

const UPDATE_MS = 700;
const ANIMATION = { type: "timing", duration: 300 } as const;
const COLORS: Color[] = ["#2563eb", "#f97316", "#14b8a6", "#a855f7", "#dc2626"];
const CHART_COUNTS = [3, 6, 9] as const;

type ChartCount = (typeof CHART_COUNTS)[number];

const makeData = (tick: number, index: number) => {
  const used = 8 + ((tick * 11 + index * 17) % 87);
  const color = COLORS[index % COLORS.length] ?? "#2563eb";

  return [
    {
      label: "Used",
      value: used,
      color,
    },
    {
      label: "Free",
      value: 100 - used,
      color: "#e5e7eb",
    },
  ];
};

export default function PieAnimationStressDebugScreen() {
  const [tick, setTick] = React.useState(0);
  const [running, setRunning] = React.useState(true);
  const [chartCount, setChartCount] = React.useState<ChartCount>(6);
  const chartIndexes = Array.from({ length: chartCount }, (_, index) => index);

  React.useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setTick((value) => value + 1);
    }, UPDATE_MS);

    return () => {
      clearInterval(interval);
    };
  }, [running]);

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard>
          Issue #632 fixture. Compare multiple animated donut charts against
          static donut charts while the same data cadence updates both groups.
        </InfoCard>

        <View style={styles.controls}>
          <Button
            title={running ? "Pause" : "Run"}
            onPress={() => setRunning((value) => !value)}
          />
          <Button title="Step" onPress={() => setTick((value) => value + 1)} />
          {CHART_COUNTS.map((count) => (
            <Button
              key={count}
              title={`${count}`}
              onPress={() => setChartCount(count)}
              style={chartCount === count ? styles.activeButton : undefined}
            />
          ))}
        </View>

        <View style={styles.readout}>
          <Text style={styles.readoutText}>tick: {tick}</Text>
          <Text style={styles.readoutText}>charts: {chartCount}</Text>
          <Text style={styles.readoutText}>running: {String(running)}</Text>
        </View>

        <Text style={styles.heading}>Animated Slices</Text>
        <View style={styles.grid}>
          {chartIndexes.map((index) => (
            <PieCase
              key={`animated-${index}`}
              data={makeData(tick, index)}
              animated
            />
          ))}
        </View>

        <Text style={styles.heading}>Static Slices</Text>
        <View style={styles.grid}>
          {chartIndexes.map((index) => (
            <PieCase key={`static-${index}`} data={makeData(tick, index)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PieCase({
  data,
  animated = false,
}: {
  data: ReturnType<typeof makeData>;
  animated?: boolean;
}) {
  return (
    <View style={styles.pieFrame}>
      <PolarChart
        data={data}
        labelKey="label"
        valueKey="value"
        colorKey="color"
      >
        <Pie.Chart innerRadius="72%">
          {() => (
            <>
              <Pie.Slice animate={animated ? ANIMATION : undefined} />
              <Pie.SliceAngularInset
                animate={animated ? ANIMATION : undefined}
                angularInset={{
                  angularStrokeWidth: 2,
                  angularStrokeColor: appColors.viewBackground.light,
                }}
              />
            </>
          )}
        </Pie.Chart>
      </PolarChart>
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
    padding: 16,
    gap: 14,
  },
  controls: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  activeButton: {
    borderColor: "#2563eb",
    borderWidth: 2,
  },
  readout: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(127, 127, 127, 0.14)",
  },
  readoutText: {
    fontVariant: ["tabular-nums"],
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  pieFrame: {
    width: 96,
    height: 96,
    borderRadius: 8,
    borderColor: "#a78bfa",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
