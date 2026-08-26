import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFont } from "@shopify/react-native-skia";
import {
  Area,
  CartesianChart,
  Line,
  Scatter,
  StackedBar,
  useChartPressState,
} from "victory-native";
import { Button } from "../components/Button";
import { InfoCard } from "../components/InfoCard";
import { Text } from "../components/Text";
import { appColors } from "../consts/colors";
import inter from "../assets/inter-medium.ttf";

const POINT_COUNT = 80;
const UPDATE_MS = 250;
const CYCLE_MS = 1500;

type Datum = {
  x: number;
  line: number;
  scatter: number;
  barsA: number;
  barsB: number;
};

const makeData = (tick: number): Datum[] =>
  Array.from({ length: POINT_COUNT }, (_, index) => {
    const phase = (tick + index) / 6;
    const wave = Math.sin(phase) * 18;
    const drift = Math.cos((tick + index * 2) / 11) * 8;

    return {
      x: index,
      line: 60 + wave + drift,
      scatter: 54 + Math.cos(phase * 0.85) * 16,
      barsA: 18 + ((tick + index * 5) % 34),
      barsB: 12 + ((tick * 3 + index * 7) % 28),
    };
  });

export default function MemoryStressDebugScreen() {
  const font = useFont(inter, 10);
  const press = useChartPressState({ x: 0, y: { line: 0, scatter: 0 } });
  const [tick, setTick] = React.useState(0);
  const [running, setRunning] = React.useState(true);
  const [mounted, setMounted] = React.useState(true);
  const [autoCycling, setAutoCycling] = React.useState(false);
  const [cycleCount, setCycleCount] = React.useState(0);
  const data = makeData(tick);

  React.useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setTick((value) => value + 1);
    }, UPDATE_MS);

    return () => {
      clearInterval(interval);
    };
  }, [running]);

  React.useEffect(() => {
    if (!autoCycling) return;

    const interval = setInterval(() => {
      setMounted((value) => !value);
      setCycleCount((value) => value + 1);
    }, CYCLE_MS);

    return () => {
      clearInterval(interval);
    };
  }, [autoCycling]);

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard>
          Issue #630 stress fixture. Let it run while watching native memory,
          then toggle mount to check whether chart resources are released.
        </InfoCard>

        <View style={styles.controls}>
          <Button
            title={running ? "Pause" : "Run"}
            onPress={() => setRunning((value) => !value)}
          />
          <Button
            title={mounted ? "Unmount" : "Mount"}
            onPress={() => {
              setMounted((value) => !value);
              setCycleCount((value) => value + 1);
            }}
          />
          <Button
            title={autoCycling ? "Stop Cycle" : "Auto Cycle"}
            onPress={() => setAutoCycling((value) => !value)}
            style={autoCycling ? styles.activeButton : undefined}
          />
        </View>

        <View style={styles.readout}>
          <Text style={styles.readoutText}>tick: {tick}</Text>
          <Text style={styles.readoutText}>points: {data.length}</Text>
          <Text style={styles.readoutText}>mounted: {String(mounted)}</Text>
          <Text style={styles.readoutText}>
            autoCycle: {String(autoCycling)}
          </Text>
          <Text style={styles.readoutText}>cycles: {cycleCount}</Text>
        </View>

        {mounted ? (
          <>
            <Text style={styles.heading}>Live Area, Line, Scatter</Text>
            <View style={styles.chartFrame}>
              <CartesianChart
                data={data}
                xKey="x"
                yKeys={["line", "scatter"]}
                chartPressState={press.state}
                padding={{ left: 10, right: 10, top: 18, bottom: 22 }}
                domain={{ y: [20, 90] }}
                axisOptions={{
                  font,
                  tickCount: { x: 4, y: 4 },
                  formatXLabel: (value) => `${value}`,
                  formatYLabel: (value) => `${value}`,
                }}
              >
                {({ points, chartBounds }) => (
                  <>
                    <Area
                      points={points.line}
                      y0={chartBounds.bottom}
                      color="rgba(37, 99, 235, 0.18)"
                      animate={{ type: "timing", duration: 180 }}
                    />
                    <Line
                      points={points.line}
                      color="#2563eb"
                      strokeWidth={3}
                      animate={{ type: "timing", duration: 180 }}
                    />
                    <Scatter
                      points={points.scatter}
                      color="#f97316"
                      radius={3}
                      animate={{ type: "timing", duration: 180 }}
                    />
                  </>
                )}
              </CartesianChart>
            </View>

            <Text style={styles.heading}>Live Stacked Bars</Text>
            <View style={styles.chartFrame}>
              <CartesianChart
                data={data.slice(0, 28)}
                xKey="x"
                yKeys={["barsA", "barsB"]}
                padding={{ left: 10, right: 10, top: 18, bottom: 22 }}
                domain={{ y: [0, 90] }}
                axisOptions={{
                  font,
                  tickCount: { x: 4, y: 4 },
                  formatXLabel: (value) => `${value}`,
                  formatYLabel: (value) => `${value}`,
                }}
              >
                {({ points, chartBounds }) => (
                  <StackedBar
                    points={[points.barsA, points.barsB]}
                    chartBounds={chartBounds}
                    colors={["#14b8a6", "#f97316"]}
                    animate={{ type: "timing", duration: 180 }}
                  />
                )}
              </CartesianChart>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text>Charts are unmounted.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
  chartFrame: {
    height: 280,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#a78bfa",
  },
  emptyState: {
    minHeight: 280,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#a78bfa",
  },
});
