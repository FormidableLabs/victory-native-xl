import * as React from "react";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Circle, useFont } from "@shopify/react-native-skia";
import {
  CartesianChart,
  type ChartPressPanConfig,
  Line,
  Scatter,
  useChartPressState,
  useChartTransformState,
} from "victory-native";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { InfoCard } from "example/components/InfoCard";
import { Text } from "example/components/Text";
import { appColors } from "../consts/colors";
import inter from "../assets/inter-medium.ttf";

type ExternalGesture = NonNullable<
  ChartPressPanConfig["simultaneousWithExternalGesture"]
>;

type Readout = {
  pressActive: boolean;
  panActive: boolean;
  zoomActive: boolean;
  index: number;
  xValue: number;
  yValue: number;
};

const DATA = Array.from({ length: 72 }, (_, index) => ({
  day: index,
  reading:
    48 +
    Math.sin(index / 3) * 12 +
    Math.cos(index / 8) * 8 +
    (index % 9) * 0.75,
}));

const initialReadout: Readout = {
  pressActive: false,
  panActive: false,
  zoomActive: false,
  index: -1,
  xValue: 0,
  yValue: 0,
};

export default function ScrollTransformPressDebugScreen() {
  const font = useFont(inter, 12);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const externalGesture = scrollViewRef as ExternalGesture;
  const press = useChartPressState<{ x: number; y: { reading: number } }>({
    x: 0,
    y: { reading: 0 },
  });
  const { state: transformState } = useChartTransformState();
  const readout = useGestureReadout(press.state, transformState);

  return (
    <SafeAreaView style={styles.safeView}>
      <Stack.Screen options={{ title: "Scroll Transform Press" }} />
      <ScrollView
        ref={scrollViewRef}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
      >
        <InfoCard>
          Verify vertical page scroll, horizontal chart pan, and long-press
          chart scrub can coexist on the same chart.
        </InfoCard>

        <ScrollMarker label="Top scroll content" />

        <View style={styles.chartSection}>
          <Text style={styles.heading}>Gesture Interop Chart</Text>
          <View style={styles.chartFrame}>
            <CartesianChart
              data={DATA}
              xKey="day"
              yKeys={["reading"]}
              viewport={{ x: [18, 42], y: [25, 75] }}
              padding={{ left: 28, right: 18, top: 18, bottom: 28 }}
              axisOptions={{ font }}
              chartPressState={press.state}
              chartPressConfig={{
                pan: {
                  activateAfterLongPress: 120,
                  simultaneousWithExternalGesture: externalGesture,
                },
              }}
              transformState={transformState}
              transformConfig={{
                pan: {
                  enabled: true,
                  dimensions: "x",
                  activeOffsetX: [-20, 20],
                  failOffsetY: [-12, 12],
                },
                pinch: { enabled: false },
              }}
            >
              {({ points }) => (
                <>
                  <Line
                    points={points.reading}
                    color="#2563eb"
                    strokeWidth={3}
                  />
                  <Scatter points={points.reading} color="#93c5fd" radius={3} />
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
          </View>
          <ReadoutPanel readout={readout} />
        </View>

        <ScrollMarker label="Bottom scroll content" />
        <ScrollMarker label="More scroll content" />
      </ScrollView>
    </SafeAreaView>
  );
}

function ScrollMarker({ label }: { label: string }) {
  return (
    <View style={styles.marker}>
      <Text style={styles.markerText}>{label}</Text>
    </View>
  );
}

function ReadoutPanel({ readout }: { readout: Readout }) {
  return (
    <View style={styles.readout}>
      <Text style={styles.readoutText}>
        pressActive: {String(readout.pressActive)}
      </Text>
      <Text style={styles.readoutText}>
        panActive: {String(readout.panActive)}
      </Text>
      <Text style={styles.readoutText}>
        zoomActive: {String(readout.zoomActive)}
      </Text>
      <Text style={styles.readoutText}>matchedIndex: {readout.index}</Text>
      <Text style={styles.readoutText}>x.value: {readout.xValue}</Text>
      <Text style={styles.readoutText}>
        y.value: {readout.yValue.toFixed(2)}
      </Text>
    </View>
  );
}

function useGestureReadout(
  pressState: ReturnType<
    typeof useChartPressState<{ x: number; y: { reading: number } }>
  >["state"],
  transformState: ReturnType<typeof useChartTransformState>["state"],
) {
  const [readout, setReadout] = React.useState(initialReadout);

  useAnimatedReaction(
    () => ({
      pressActive: pressState.isActive.value,
      panActive: transformState.panActive.value,
      zoomActive: transformState.zoomActive.value,
      index: pressState.matchedIndex.value,
      xValue: pressState.x.value.value,
      yValue: pressState.y.reading.value.value,
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
    gap: 16,
  },
  marker: {
    minHeight: 260,
    borderRadius: 8,
    padding: 16,
    justifyContent: "center",
    backgroundColor: appColors.cardBackground.light,
    $dark: {
      backgroundColor: appColors.cardBackground.dark,
    },
  },
  markerText: {
    fontSize: 18,
    fontWeight: "700",
  },
  chartSection: {
    gap: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
  },
  chartFrame: {
    height: 300,
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
    fontVariant: ["tabular-nums"],
  },
});
