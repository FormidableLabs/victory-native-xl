import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Circle, useFont } from "@shopify/react-native-skia";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import {
  CartesianChart,
  type ChartPressState,
  Line,
  Scatter,
  useChartPressState,
} from "victory-native";
import { InfoCard } from "example/components/InfoCard";
import { Text } from "example/components/Text";
import { appColors } from "../consts/colors";
import inter from "../assets/inter-medium.ttf";

type Datum = {
  day: string;
  high: number;
};

type PressState = ChartPressState<{ x: string; y: { high: number } }>;

type Readout = {
  active: boolean;
  index: number;
  xValue: string;
  xPosition: number;
};

const DATA: Datum[] = [
  { day: "Mon", high: 58 },
  { day: "Tue", high: 71 },
  { day: "Wed", high: 50 },
  { day: "Thu", high: 76 },
  { day: "Fri", high: 63 },
  { day: "Sat", high: 78 },
  { day: "Sun", high: 61 },
];

const initialReadout: Readout = {
  active: false,
  index: -1,
  xValue: "",
  xPosition: 0,
};

export default function PressRaceDebugScreen() {
  const font = useFont(inter, 12);
  const press = useChartPressState({ x: "", y: { high: 0 } });

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard>
          Quickly tap around the chart. Released touches should not replay after
          long-press activation.
        </InfoCard>

        <Text style={styles.heading}>Long Press Bootstrap</Text>
        <View style={styles.chartFrame}>
          <CartesianChart
            data={DATA}
            xKey="day"
            yKeys={["high"]}
            domainPadding={40}
            padding={{ left: 12, right: 12, top: 20, bottom: 28 }}
            axisOptions={{
              font,
              formatXLabel: (value) => String(value || ""),
              formatYLabel: (value) => `${value}`,
              tickCount: { x: 7, y: 5 },
            }}
            chartPressState={press.state}
            chartPressConfig={{ pan: { activateAfterLongPress: 80 } }}
          >
            {({ points }) => (
              <>
                <Line points={points.high} color="#2563eb" strokeWidth={4} />
                <Scatter points={points.high} color="#a78bfa" radius={5} />
                {press.isActive && (
                  <Circle
                    cx={press.state.x.position}
                    cy={press.state.y.high.position}
                    r={10}
                    color="#111827"
                  />
                )}
              </>
            )}
          </CartesianChart>
        </View>

        <ReadoutPanel state={press.state} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ReadoutPanel({ state }: { state: PressState }) {
  const readout = usePressReadout(state);

  return (
    <View style={styles.readout}>
      <Text style={styles.readoutText}>active: {String(readout.active)}</Text>
      <Text style={styles.readoutText}>matchedIndex: {readout.index}</Text>
      <Text style={styles.readoutText}>x.value: {readout.xValue}</Text>
      <Text style={styles.readoutText}>
        x.position: {Math.round(readout.xPosition)}
      </Text>
    </View>
  );
}

function usePressReadout(state: PressState) {
  const [readout, setReadout] = React.useState(initialReadout);

  useAnimatedReaction(
    () => ({
      active: state.isActive.value,
      index: state.matchedIndex.value,
      xValue: state.x.value.value,
      xPosition: state.x.position.value,
    }),
    (next) => {
      runOnJS(setReadout)(next);
    },
  );

  return readout;
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
  heading: {
    fontSize: 22,
    fontWeight: "700",
  },
  chartFrame: {
    height: 360,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#a78bfa",
  },
  readout: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(127, 127, 127, 0.14)",
  },
  readoutText: {
    fontVariant: ["tabular-nums"],
  },
});
