import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import {
  CartesianChart,
  type ChartPressState,
  Line,
  Scatter,
  useChartPressState,
} from "victory-native";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { InfoCard } from "example/components/InfoCard";
import { Text } from "example/components/Text";
import { appColors } from "../consts/colors";
import inter from "../assets/inter-medium.ttf";

type PressState = ChartPressState<{ x: number; y: { reading: number } }>;
type Press = { state: PressState; isActive: boolean };

type Readout = {
  active: boolean;
  index: number;
  xValue: number;
  yValue: number;
};

const DATA = Array.from({ length: 16 }, (_, day) => ({
  day,
  reading: 40 + ((day * 11) % 37),
}));

const initialReadout: Readout = {
  active: false,
  index: -1,
  xValue: 0,
  yValue: 0,
};

export default function PanConfigDebugScreen() {
  const font = useFont(inter, 12);
  const zeroPress = useChartPressState<{ x: number; y: { reading: number } }>({
    x: 0,
    y: { reading: 0 },
  });
  const yOffsetPress = useChartPressState<{
    x: number;
    y: { reading: number };
  }>({
    x: 0,
    y: { reading: 0 },
  });

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard>
          Debug fixture for chartPressConfig.pan passthrough. Scrub each chart
          and confirm the readout follows the touched point.
        </InfoCard>

        <Text style={styles.heading}>Explicit Zero Values</Text>
        <View style={styles.chartFrame}>
          <PressChart
            font={font}
            press={zeroPress}
            chartPressConfig={{
              pan: {
                activateAfterLongPress: 0,
                activeOffsetX: 0,
                activeOffsetY: 0,
              },
            }}
          />
        </View>
        <ReadoutPanel state={zeroPress.state} />

        <Text style={styles.heading}>Y Offset Options</Text>
        <View style={styles.chartFrame}>
          <PressChart
            font={font}
            press={yOffsetPress}
            chartPressConfig={{
              pan: {
                activateAfterLongPress: 80,
                activeOffsetY: [-10, 10],
                failOffsetY: [-140, 140],
              },
            }}
          />
        </View>
        <ReadoutPanel state={yOffsetPress.state} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PressChart({
  font,
  press,
  chartPressConfig,
}: {
  font: ReturnType<typeof useFont>;
  press: Press;
  chartPressConfig: React.ComponentProps<
    typeof CartesianChart<(typeof DATA)[number], "day", "reading">
  >["chartPressConfig"];
}) {
  return (
    <CartesianChart
      data={DATA}
      xKey="day"
      yKeys={["reading"]}
      padding={{ left: 24, right: 18, top: 18, bottom: 28 }}
      chartPressState={press.state}
      chartPressConfig={chartPressConfig}
      axisOptions={{ font }}
    >
      {({ points }) => (
        <>
          <Line points={points.reading} color="#2563eb" strokeWidth={3} />
          <Scatter points={points.reading} color="#a78bfa" radius={4} />
          {press.isActive && (
            <Circle
              cx={press.state.x.position}
              cy={press.state.y.reading.position}
              r={8}
              color="#111827"
            />
          )}
        </>
      )}
    </CartesianChart>
  );
}

function ReadoutPanel({ state }: { state: PressState }) {
  const readout = usePressReadout(state);

  return (
    <View style={styles.readout}>
      <Text style={styles.readoutText}>active: {String(readout.active)}</Text>
      <Text style={styles.readoutText}>matchedIndex: {readout.index}</Text>
      <Text style={styles.readoutText}>x.value: {readout.xValue}</Text>
      <Text style={styles.readoutText}>y.value: {readout.yValue}</Text>
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
      yValue: state.y.reading.value.value,
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
    height: 260,
  },
  readout: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: appColors.cardBackground.light,
    $dark: {
      backgroundColor: appColors.cardBackground.dark,
    },
  },
  readoutText: {
    fontSize: 14,
  },
});
