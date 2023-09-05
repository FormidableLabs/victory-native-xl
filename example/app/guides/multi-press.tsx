import * as React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import type { SharedValue } from "react-native-reanimated";
import { appColors } from "../consts/colors";
import inter from "../../assets/inter-medium.ttf";

const YKEYS = ["highTmp" as const];

export default function GettingStartedScreen() {
  const font = useFont(inter, 12);
  const { state: firstPress, isActive: isFirstPressActive } =
    useChartPressState(YKEYS);
  const { state: secondPress, isActive: isSecondPressActive } =
    useChartPressState(YKEYS);

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{ flex: 1, maxHeight: 400, padding: 32 }}>
        <CartesianChart
          data={DATA}
          xKey="day"
          yKeys={YKEYS}
          axisOptions={{
            font,
          }}
          chartPressState={[firstPress, secondPress]}
        >
          {({ points }) => (
            <>
              <Line points={points.highTmp} color="red" strokeWidth={3} />
              {isFirstPressActive && (
                <ToolTip
                  x={firstPress.x.position}
                  y={firstPress.y.highTmp.position}
                />
              )}
              {isSecondPressActive && (
                <ToolTip
                  x={secondPress.x.position}
                  y={secondPress.y.highTmp.position}
                />
              )}
            </>
          )}
        </CartesianChart>
      </View>
    </SafeAreaView>
  );
}

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color="black" />;
}

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
});
