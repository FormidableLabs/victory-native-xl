import { useFont } from "@shopify/react-native-skia";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  CartesianBar,
  CartesianChart,
  CartesianDots,
  CartesianLine,
} from "victory-native";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "./consts/colors";
import { useDarkMode } from "react-native-dark";

const DATA = Array.from({ length: 10 }, (_, index) => ({
  month: index + 1,
  listenCount: Math.floor(Math.random() * (50 - 20 + 1)) + 20,
}));

export default function BarChartPage() {
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <View style={styles.chart}>
          <CartesianChart
            xKey="month"
            padding={5}
            yKeys={["listenCount"]}
            domainPadding={30}
            domain={{ y: [0] }}
            gridOptions={{
              lineColor: isDark ? "#71717a" : "#d4d4d8",
            }}
            axisOptions={{
              font,
              tickCount: 5,
              lineColor: isDark ? "#71717a" : "#d4d4d8",
              labelColor: isDark ? appColors.text.dark : appColors.text.light,
            }}
            data={DATA}
          >
            {({ points, chartBounds }) => {
              return (
                <>
                  <CartesianBar
                    color={appColors.tint}
                    points={points.listenCount}
                    chartBounds={chartBounds}
                  />
                  <CartesianDots color="aqua" points={points.listenCount} />
                  <CartesianLine
                    strokeWidth={3}
                    color="yellow"
                    points={points.listenCount}
                  />
                </>
              );
            }}
          </CartesianChart>
        </View>
        <ScrollView
          style={styles.optionsScrollView}
          contentContainerStyle={styles.options}
        ></ScrollView>
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
