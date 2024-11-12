import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useDerivedValue } from "react-native-reanimated";
import { Bar, CartesianChart, useChartPressState } from "victory-native";
import { useDarkMode } from "react-native-dark";
import { Text } from "example/components/Text";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "./consts/colors";

const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
  }));

export default function BarChartCustomBarsPage() {
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const [data] = useState(DATA(5));
  const [innerPadding] = useState(0.33);
  const [roundedCorner] = useState(5);
  const { state } = useChartPressState({
    x: 0,
    y: { listenCount: 0 },
  });

  let activeXItem = useDerivedValue(() => {
    return state.matchedIndex.value;
  }).value;
  if (activeXItem < 0) {
    activeXItem = 2;
  }

  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <ScrollView>
          <View style={styles.chart}>
            <Text style={styles.title}>
              Bar Chart with single color customization
            </Text>
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
                return points.listenCount.map((p, i) => {
                  return (
                    <Bar
                      barCount={points.listenCount.length}
                      key={i}
                      points={[p]}
                      chartBounds={chartBounds}
                      animate={{ type: "spring" }}
                      innerPadding={innerPadding}
                      roundedCorners={{
                        topLeft: roundedCorner,
                        topRight: roundedCorner,
                      }}
                      color={i === data.length - 1 ? "red" : "black"}
                    ></Bar>
                  );
                });
              }}
            </CartesianChart>
          </View>
          <View style={styles.chart}>
            <Text style={styles.title}>
              Bar Chart with children + gesture customization (press a bar)
            </Text>
            <CartesianChart
              chartPressState={state}
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
                return points.listenCount.map((p, i) => {
                  return (
                    <Bar
                      barCount={points.listenCount.length}
                      key={i}
                      points={[p]}
                      chartBounds={chartBounds}
                      animate={{ type: "spring" }}
                      innerPadding={innerPadding}
                      roundedCorners={{
                        topLeft: roundedCorner,
                        topRight: roundedCorner,
                      }}
                    >
                      {i == activeXItem ? (
                        <LinearGradient
                          start={vec(0, 0)}
                          end={vec(0, 400)}
                          colors={["green", "blue"]}
                        />
                      ) : (
                        <LinearGradient
                          start={vec(0, 0)}
                          end={vec(0, 400)}
                          colors={["#a78bfa", "#a78bfa50"]}
                        />
                      )}
                    </Bar>
                  );
                });
              }}
            </CartesianChart>
          </View>
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
    marginHorizontal: 15,
  },
  chart: {
    minHeight: 400,
    marginBottom: 30,
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
  title: { marginBottom: 10, fontSize: 16, fontWeight: "bold" },
});
