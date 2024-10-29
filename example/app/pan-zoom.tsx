export const PanZoom = () => {};
import * as React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { CartesianChart, Line, useChartTransformState } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import { appColors } from "./consts/colors";
import inter from "../assets/inter-medium.ttf";

export default function PanZoomPage() {
  const font = useFont(inter, 12);
  const { state } = useChartTransformState();

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{ flex: 1, maxHeight: 400, padding: 32 }}>
        <CartesianChart
          data={DATA}
          xKey="day"
          yKeys={["highTmp"]}
          axisOptions={{
            font,
          }}
          transformState={state}
        >
          {({ points }) => (
            <>
              <Line points={points.highTmp} color="red" strokeWidth={3} />
            </>
          )}
        </CartesianChart>
      </View>
    </SafeAreaView>
  );
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
