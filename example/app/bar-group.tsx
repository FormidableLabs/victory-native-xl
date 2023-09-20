import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { BarGroup, CartesianChart } from "victory-native";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import { useDarkMode } from "react-native-dark";
import { appColors } from "./consts/colors";
import inter from "../assets/inter-medium.ttf";
import { Button } from "../components/Button";
import { InputSlider } from "../components/InputSlider";
import { InfoCard } from "../components/InfoCard";
import { descriptionForRoute } from "./consts/routes";

const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    x: index + 1,
    y: 10 + Math.floor(40 * Math.random()),
    z: 30 + Math.floor(20 * Math.random()),
    w: 5 + Math.floor(45 * Math.random()),
  }));

export default function BarGroupPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const [data, setData] = React.useState(DATA(5));
  const [betweenGroupPadding, setBetweenGroupPadding] = React.useState(0.4);
  const [withinGroupPadding, setWithinGroupPadding] = React.useState(0.1);
  const [roundedCorner, setRoundedCorner] = React.useState(0);
  const font = useFont(inter, 12);
  const isDark = useDarkMode();

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.chart}>
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={["y", "z", "w"]}
          domain={{ y: [0, 50] }}
          padding={{ left: 10, right: 10, bottom: 5, top: 15 }}
          domainPadding={{ left: 50, right: 50, top: 30 }}
          axisOptions={{
            font,
            tickCount: { y: 10, x: 5 },
            lineColor: isDark ? "#71717a" : "#d4d4d8",
            labelColor: isDark ? appColors.text.dark : appColors.text.light,
          }}
        >
          {({ points, chartBounds }) => (
            <BarGroup
              chartBounds={chartBounds}
              betweenGroupPadding={betweenGroupPadding}
              withinGroupPadding={withinGroupPadding}
              roundedCorners={{
                topLeft: roundedCorner,
                topRight: roundedCorner,
              }}
            >
              <BarGroup.Bar points={points.y} animate={{ type: "timing" }}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, 540)}
                  colors={["#f472b6", "#be185d90"]}
                />
              </BarGroup.Bar>
              <BarGroup.Bar points={points.z} animate={{ type: "timing" }}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, 500)}
                  colors={["#c084fc", "#7c3aed90"]}
                />
              </BarGroup.Bar>
              <BarGroup.Bar points={points.w} animate={{ type: "timing" }}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, 500)}
                  colors={["#a5f3fc", "#0891b290"]}
                />
              </BarGroup.Bar>
            </BarGroup>
          )}
        </CartesianChart>
      </View>
      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <InfoCard>{description}</InfoCard>
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginVertical: 16,
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
        <InputSlider
          label="Top Corner Radius"
          maxValue={16}
          minValue={0}
          step={1}
          value={roundedCorner}
          onChange={setRoundedCorner}
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
