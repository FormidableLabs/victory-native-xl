import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { BarGroup, CartesianChart } from "victory-native";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import { appColors } from "./consts/colors";
import inter from "../assets/inter-medium.ttf";
import { Button } from "../components/Button";
import { InputSlider } from "../components/InputSlider";

const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    x: index + 1,
    y: 10 + Math.floor(40 * Math.random()),
    z: 30 + Math.floor(20 * Math.random()),
    w: 5 + Math.floor(45 * Math.random()),
  }));

export default function BarGroupPage() {
  const [data, setData] = React.useState(DATA(5));
  const [betweenGroupPadding, setBetweenGroupPadding] = React.useState(0.4);
  const [withinGroupPadding, setWithinGroupPadding] = React.useState(0.1);
  const font = useFont(inter, 12);

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.chart}>
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={["y", "z", "w"]}
          domain={{ y: [0, 50] }}
          domainPadding={{ left: 50, right: 50, top: 30 }}
          axisOptions={{ font }}
        >
          {({ points, chartBounds }) => (
            <BarGroup
              chartBounds={chartBounds}
              betweenGroupPadding={betweenGroupPadding}
              withinGroupPadding={withinGroupPadding}
            >
              <BarGroup.Bar points={points.y} animate={{ type: "timing" }}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, 500)}
                  colors={["#00ff00", "#000000"]}
                />
              </BarGroup.Bar>
              <BarGroup.Bar
                points={points.z}
                color="blue"
                animate={{ type: "timing" }}
              />
              <BarGroup.Bar
                points={points.w}
                color="purple"
                animate={{ type: "timing" }}
              />
            </BarGroup>
          )}
        </CartesianChart>
      </View>
      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginTop: 10,
            marginBottom: 16,
          }}
        >
          <Button
            style={{ flex: 1 }}
            onPress={() => setData((data) => DATA(data.length))}
            title="Shuffle Data"
          />
        </View>
        <InputSlider
          label="Inner Padding"
          maxValue={1}
          minValue={0}
          step={0.1}
          value={betweenGroupPadding}
          onChange={setBetweenGroupPadding}
        />
        <InputSlider
          label="Group Inner Padding"
          maxValue={1}
          minValue={0}
          step={0.1}
          value={withinGroupPadding}
          onChange={setWithinGroupPadding}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  chart: {
    height: 350,
  },
  optionsScrollView: {
    flex: 1,
    backgroundColor: appColors.cardBackground.light,
    $dark: {
      backgroundColor: appColors.cardBackground.dark,
    },
  },
  options: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
