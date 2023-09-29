import * as React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Bar, CartesianChart, Line } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import { appColors } from "./consts/colors";
import inter from "../assets/inter-medium.ttf";

export default function MissingDataScreen() {
  const font = useFont(inter, 12);

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{ flex: 1, maxHeight: 400, padding: 32 }}>
        <CartesianChart
          data={DATA}
          xKey="x"
          yKeys={["low", "high"]}
          domain={{ y: [0] }}
          axisOptions={{ font }}
          domainPadding={{ left: 44, right: 44 }}
        >
          {({ points, chartBounds }) => (
            <>
              <Bar
                points={points.high}
                chartBounds={chartBounds}
                innerPadding={0.5}
              />
              <Line points={points.low} color="red" strokeWidth={3} />
            </>
          )}
        </CartesianChart>
      </View>
    </SafeAreaView>
  );
}

const DATA = [
  {
    x: 0,
    low: 3,
    high: 5,
  },
  {
    x: 1,
    low: 4,
    high: 7,
  },
  {
    x: 2,
    low: 3,
  },
  {
    x: 3,
    low: 6,
  },
];

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
});
