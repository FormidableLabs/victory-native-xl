import * as React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { ScrollView } from "react-native-gesture-handler";
import { Circle, useFont } from "@shopify/react-native-skia";
import type { SharedValue } from "react-native-reanimated";
import { InfoCard } from "example/components/InfoCard";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "./consts/colors";

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));

const LineChart = () => {
  const font = useFont(inter, 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { highTmp: 0 } });
  return (
    <CartesianChart
      data={DATA}
      xKey="day"
      yKeys={["highTmp"]}
      axisOptions={{
        font,
      }}
      chartPressState={state}
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
  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView contentContainerStyle={styles.optionsScrollView}>
        {Array.from({ length: 5 }, (_, i) => (
          <React.Fragment key={i}>
            <View style={styles.chart}>
              <LineChart />
            </View>
            <InfoCard style={styles.card}>
              Just a page with a number of charts nested within a ScrollView
              from RNGH to test that scrolling and gestures still work as
              intended.
            </InfoCard>
          </React.Fragment>
        ))}
      </ScrollView>
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
    padding: 32,
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
