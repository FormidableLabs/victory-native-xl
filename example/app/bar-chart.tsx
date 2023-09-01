import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Bar, CartesianChart } from "victory-native";
import { useDarkMode } from "react-native-dark";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "./consts/colors";
import { InputSlider } from "../components/InputSlider";
import { Button } from "../components/Button";
import { InfoCard } from "../components/InfoCard";
import { descriptionForRoute } from "./consts/routes";

const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
  }));

export default function BarChartPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const [data, setData] = useState(DATA(5));
  const [innerPadding, setInnerPadding] = useState(0.33);
  const [roundedCorner, setRoundedCorner] = useState(5);

  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <View style={styles.chart}>
          <CartesianChart
            xKey="month"
            padding={5}
            yKeys={["listenCount"]}
            domainPadding={{ left: 50, right: 50, top: 30 }}
            domain={{ y: [0, 100] }}
            axisOptions={{
              font,
              tickCount: 5,
              formatXLabel: (value) => {
                const date = new Date(2023, value - 1);
                return date.toLocaleString("default", { month: "short" });
              },
              lineColor: isDark ? "#71717a" : "#d4d4d8",
              labelColor: isDark ? appColors.text.dark : appColors.text.light,
            }}
            data={data}
          >
            {({ points, chartBounds }) => {
              return (
                <>
                  <Bar
                    points={points.listenCount}
                    chartBounds={chartBounds}
                    animate={{ type: "spring" }}
                    innerPadding={innerPadding}
                    roundedCorners={{
                      topLeft: roundedCorner,
                      topRight: roundedCorner,
                    }}
                  >
                    <LinearGradient
                      start={vec(0, 0)}
                      end={vec(0, 400)}
                      colors={["#a78bfa", "#a78bfa50"]}
                    />
                  </Bar>
                </>
              );
            }}
          </CartesianChart>
        </View>
        <ScrollView
          style={styles.optionsScrollView}
          contentContainerStyle={styles.options}
        >
          <InfoCard style={{ marginBottom: 16 }}>{description}</InfoCard>
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
            label="Number of bars"
            maxValue={20}
            minValue={3}
            step={1}
            value={data.length}
            onChange={(val) => setData(DATA(val))}
          />
          <InputSlider
            label="Inner Padding"
            maxValue={1}
            minValue={0}
            step={0.1}
            value={innerPadding}
            onChange={setInnerPadding}
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
    </>
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
    flex: 1.5,
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
