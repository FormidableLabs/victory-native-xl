import { Button } from "../components/Button";

export const PanZoom = () => {};
import * as React from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { CartesianChart, Line, useChartTransformState } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import { appColors } from "./consts/colors";
import inter from "../assets/inter-medium.ttf";

export default function PanZoomPage() {
  const font = useFont(inter, 12);
  const { state, actions } = useChartTransformState();

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
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
      >
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Button title={"Pan Left"} style={{ flex: 1 }} />
            <Button title={"Pan Right"} style={{ flex: 1 }} />
          </View>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Button title={"Pan Up"} style={{ flex: 1 }} />
            <Button title={"Pan Down"} style={{ flex: 1 }} />
          </View>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Button
              title={"Zoom In"}
              style={{ flex: 1 }}
              onPress={() => {
                actions.setScale();
              }}
            />
            <Button title={"Zoom Out"} style={{ flex: 1 }} />
          </View>
        </View>
      </ScrollView>
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
