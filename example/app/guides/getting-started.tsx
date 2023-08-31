import { appColors } from "example/app/consts/colors";
import * as React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { CartesianChart, Line } from "victory-native";
import inter from "../../assets/inter-medium.ttf";
import { useFont } from "@shopify/react-native-skia";

export default function GettingStartedScreen() {
  const font = useFont(inter, 12);

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{ flex: 1, maxHeight: 400, padding: 32 }}>
        <CartesianChart
          data={DATA}
          xKey="day"
          yKeys={["highTmp"]}
          axisOptions={{ font }}
        >
          {({ points }) => (
            <Line points={points.highTmp} color="red" strokeWidth={3} />
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
