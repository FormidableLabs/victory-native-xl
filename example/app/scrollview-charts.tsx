import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  CartesianChart,
  Line,
  type ChartPressPanConfig,
  useChartPressState,
} from "victory-native";
import { Circle, useFont } from "react-native-skia";
import type { SharedValue } from "react-native-reanimated";
import { InfoCard } from "example/components/InfoCard";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));

type ExternalGesture = NonNullable<
  ChartPressPanConfig["simultaneousWithExternalGesture"]
>;

const LineChart = ({
  simultaneousWithExternalGesture,
}: {
  simultaneousWithExternalGesture: ExternalGesture;
}) => {
  const font = useFont(inter, 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { highTmp: 0 } });
  return (
    <CartesianChart
      data={DATA}
      xKey="day"
      padding={10}
      yKeys={["highTmp"]}
      axisOptions={{
        font,
      }}
      chartPressState={state}
      enableHover
      chartPressConfig={{
        pan: {
          activateAfterLongPress: 100,
          simultaneousWithExternalGesture,
        },
      }}
    >
      {({ points }) => (
        <>
          <Line points={points.highTmp} color="red" strokeWidth={3} />
          {isActive && (
            <ToolTip x={state.x.position} y={state.y.highTmp.position} />
          )}
        </>
      )}
    </CartesianChart>
  );
};

export default function GettingStartedScreen() {
  // Keep the scroll recognizer stable across chart updates.
  const externalGesture = React.useMemo(
    () => Gesture.Native(),
    [],
  ) satisfies ExternalGesture;

  return (
    <SafeAreaView style={styles.safeView}>
      <GestureDetector gesture={externalGesture}>
        <ScrollView contentContainerStyle={styles.optionsScrollView}>
          {Array.from({ length: 5 }, (_, i) => (
            <React.Fragment key={i}>
              <View style={styles.chart}>
                <LineChart simultaneousWithExternalGesture={externalGesture} />
              </View>
              <InfoCard style={styles.card}>
                Charts inside a React Native ScrollView wrapped with
                Gesture.Native() to test simultaneous scrolling and chart
                pressing.
              </InfoCard>
            </React.Fragment>
          ))}
        </ScrollView>
      </GestureDetector>
    </SafeAreaView>
  );
}

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color="black" />;
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  optionsScrollView: {
    padding: 10,
    backgroundColor: appColors.cardBackground.light,
    $dark: {
      backgroundColor: appColors.cardBackground.dark,
    },
  },
  chart: {
    height: 300,
    maxHeight: 400,
  },
  card: {
    marginVertical: 22,
  },
});
