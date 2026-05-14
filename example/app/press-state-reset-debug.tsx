import * as React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
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
  day: number;
  highTmp: number;
};

type PressState = ChartPressState<{ x: number; y: { highTmp: number } }>;

type Readout = {
  active: boolean;
  index: number;
  xPosition: number;
  yPosition: number;
};

const DATA_A: Datum[] = Array.from({ length: 12 }, (_, day) => ({
  day,
  highTmp: 46 + ((day * 7) % 26),
}));

const DATA_B: Datum[] = Array.from({ length: 6 }, (_, day) => ({
  day,
  highTmp: 78 - day * 8,
}));

const initialReadout: Readout = {
  active: false,
  index: -1,
  xPosition: 0,
  yPosition: 0,
};

export default function PressStateResetDebugScreen() {
  const font = useFont(inter, 12);
  const press = useChartPressState({ x: 0, y: { highTmp: 0 } });
  const [useShortData, setUseShortData] = React.useState(false);
  const data = useShortData ? DATA_B : DATA_A;

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard>
          Press the chart, then switch data. The press readout should reset
          immediately.
        </InfoCard>

        <View style={styles.toolbar}>
          <Text style={styles.heading}>Dataset {useShortData ? "B" : "A"}</Text>
          <Pressable
            accessibilityRole="button"
            style={styles.button}
            onPress={() => setUseShortData((current) => !current)}
          >
            <Text style={styles.buttonText}>Switch Data</Text>
          </Pressable>
        </View>

        <View style={styles.chartFrame}>
          <CartesianChart
            data={data}
            xKey="day"
            yKeys={["highTmp"]}
            padding={{ left: 24, right: 18, top: 18, bottom: 28 }}
            chartPressState={press.state}
            axisOptions={{ font }}
          >
            {({ points }) => (
              <>
                <Line points={points.highTmp} color="#2563eb" strokeWidth={3} />
                <Scatter points={points.highTmp} color="#a78bfa" radius={4} />
                {press.isActive && (
                  <Circle
                    cx={press.state.x.position}
                    cy={press.state.y.highTmp.position}
                    r={8}
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
      <Text style={styles.readoutText}>
        x.position: {Math.round(readout.xPosition)}
      </Text>
      <Text style={styles.readoutText}>
        y.position: {Math.round(readout.yPosition)}
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
      xPosition: state.x.position.value,
      yPosition: state.y.highTmp.position.value,
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
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
  },
  button: {
    minHeight: 40,
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: appColors.tint,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  chartFrame: {
    height: 280,
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
