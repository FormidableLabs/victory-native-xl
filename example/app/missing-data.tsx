import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Area,
  Bar,
  CartesianChart,
  Line,
  Scatter,
  useChartPressState,
} from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import { appColors } from "../consts/colors";
import inter from "../assets/inter-medium.ttf";
import { Button } from "../components/Button";
import { InputSegment } from "../components/InputSegment";
import { Text } from "../components/Text";

export default function MissingDataScreen() {
  const font = useFont(inter, 12);
  const [data, setData] = React.useState(DATA);
  const [connectedData, setConnectedData] = React.useState(VALUES[1]!);
  const { state, isActive } = useChartPressState({ x: 0, y: { y: 0 } });

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{ flex: 1, maxHeight: 400, padding: 32 }}>
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={["y"]}
          domain={{ y: [0, 100] }}
          axisOptions={{ font }}
          chartPressState={state}
        >
          {({ points, chartBounds }) => (
            <>
              <Area
                points={points.y}
                color="pink"
                y0={chartBounds.bottom}
                curveType="catmullRom"
                animate={{ type: "timing" }}
                connectMissingData={connectedData === "connected"}
              />
              <Line
                points={points.y}
                color="blue"
                strokeWidth={3}
                curveType="catmullRom"
                animate={{ type: "timing" }}
                connectMissingData={connectedData === "connected"}
              />
              <Bar
                points={points.y}
                chartBounds={chartBounds}
                color="black"
                opacity={0.3}
                animate={{ type: "timing" }}
              />
              <Scatter
                points={points.y}
                radius={10}
                shape="star"
                animate={{ type: "timing" }}
              />

              {isActive && (
                <Circle r={20} cx={state.x.position} cy={state.y.y.position} />
              )}
            </>
          )}
        </CartesianChart>
      </View>
      <Text style={styles.heading}>All Missing Values</Text>
      <View style={styles.allMissingChart}>
        <CartesianChart
          data={ALL_MISSING_DATA}
          xKey="x"
          yKeys={["y"]}
          axisOptions={{ font }}
        >
          {({ points }) => (
            <>
              <Line points={points.y} color="blue" strokeWidth={3} />
              <Scatter points={points.y} radius={8} />
            </>
          )}
        </CartesianChart>
      </View>
      <Text style={styles.heading}>All Missing Log Scale</Text>
      <View style={styles.allMissingChart}>
        <CartesianChart
          data={ALL_MISSING_DATA}
          xKey="x"
          yKeys={["y"]}
          axisOptions={{
            font,
            axisScales: { yAxisScale: "log" },
            formatYLabel: formatSparseLogYLabel,
          }}
        >
          {({ points }) => (
            <>
              <Line points={points.y} color="blue" strokeWidth={3} />
              <Scatter points={points.y} radius={8} />
            </>
          )}
        </CartesianChart>
      </View>
      <Text style={styles.heading}>Single Value Log Scale</Text>
      <View style={styles.allMissingChart}>
        <CartesianChart
          data={SINGLE_VALUE_LOG_DATA}
          xKey="x"
          yKeys={["y"]}
          axisOptions={{
            font,
            axisScales: { yAxisScale: "log" },
            formatYLabel: formatSparseLogYLabel,
          }}
        >
          {({ points }) => (
            <>
              <Line points={points.y} color="blue" strokeWidth={3} />
              <Scatter points={points.y} radius={8} />
            </>
          )}
        </CartesianChart>
      </View>
      <ScrollView style={styles.controls}>
        <Button
          title="Shuffle data"
          onPress={() => setData(DATA())}
          style={{ marginBottom: 16 }}
        />
        <InputSegment
          label="Connect Missing Data"
          values={VALUES}
          value={connectedData}
          onChange={setConnectedData}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const VALUES = ["connected", "gap"];

const SKIP = [7, 8, 15];
const DATA = () =>
  Array.from({ length: 20 }, (_, i) => {
    return {
      x: i,
      y: SKIP.includes(i) ? null : Math.random() * 100,
    };
  });

const ALL_MISSING_DATA: { x: number; y: number | null }[] = Array.from(
  { length: 6 },
  (_, x) => ({ x, y: null }),
);

const SINGLE_VALUE_LOG_DATA = [{ x: 0, y: 1 }];
const VISIBLE_LOG_LABELS = [0.2, 0.5, 1, 2, 5, 10];

const formatSparseLogYLabel = (label: number | null) => {
  const value = Number(label);
  const shouldShow = VISIBLE_LOG_LABELS.some(
    (visibleValue) => Math.abs(value - visibleValue) < Number.EPSILON,
  );

  return shouldShow ? `${label}` : "";
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  controls: {
    padding: 16,
  },
  heading: {
    paddingHorizontal: 32,
    fontSize: 20,
    fontWeight: "700",
  },
  allMissingChart: {
    height: 220,
    padding: 32,
  },
});
