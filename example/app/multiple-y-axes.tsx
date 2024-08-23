import { useFont } from "@shopify/react-native-skia";
import * as React from "react";
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { CartesianChart, Line, Bar } from "victory-native";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "./consts/colors";

const randomNumber = () => Math.floor(Math.random() * (50 - 25 + 1)) + 25;
const randomNumber2 = () => Math.floor(Math.random() * (50 - 25 + 1)) + 10000;
const randomNumberNegative = () =>
  Math.floor(Math.random() * (50 - 25 + 1)) - 200;

const DATA = (numberPoints = 13) =>
  Array.from({ length: numberPoints }, (_, index) => ({
    day: index + 1,
    sales: randomNumber(),
    profit: randomNumber2(),
    negative: Math.floor(Math.random() * 801) - 300,
    anotherNegativeValue: randomNumberNegative(),
  }));

export default function MultipleYAxesPage() {
  const font = useFont(inter, 12);
  const [data] = useState(DATA());

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView>
        <View style={styles.chart}>
          <CartesianChart
            xKey="day"
            padding={10}
            yKeys={["sales", "profit"]}
            axisOptions={[
              {
                yKeys: ["sales"],
                font,
                labelColor: { x: "black", y: "red" },
                formatYLabel: (value) => {
                  return value.toFixed(0);
                },
                lineColor: {
                  grid: {
                    x: "red",
                    y: "red",
                  },
                  frame: "green",
                },
              },
              {
                yKeys: ["profit"],
                font,
                formatYLabel: (value) => {
                  return value.toFixed(0);
                },
                labelColor: { x: "black", y: "blue" },

                axisSide: { x: "bottom", y: "right" },

                hideXAxis: true,
                lineWidth: {
                  grid: {
                    x: 0,
                    y: 1,
                  },
                  frame: 2,
                },
                lineColor: {
                  grid: {
                    x: "blue",
                    y: "blue",
                  },
                  frame: "purple",
                },
              },
            ]}
            data={data}
            domainPadding={10}
          >
            {({ points, chartBounds }) => (
              <>
                <Bar
                  color={"blue"}
                  points={points.profit}
                  chartBounds={chartBounds}
                />
                <Line
                  points={points.sales}
                  color={"red"}
                  strokeWidth={3}
                  animate={{ type: "spring" }}
                />
              </>
            )}
          </CartesianChart>
        </View>
        {/* Multi bar, with negative values */}
        <View style={styles.chart}>
          <CartesianChart
            xKey="day"
            padding={10}
            yKeys={["negative", "anotherNegativeValue"]}
            axisOptions={[
              {
                yKeys: ["negative"],
                font,
                labelColor: { x: "black", y: "red" },
                formatYLabel: (value) => {
                  return value.toFixed(0);
                },
                lineColor: {
                  grid: {
                    x: "red",
                    y: "red",
                  },
                  frame: "green",
                },
              },
              {
                yKeys: ["anotherNegativeValue"],
                font,
                formatYLabel: (value) => {
                  return value.toFixed(0);
                },
                labelColor: { x: "black", y: "blue" },

                axisSide: { x: "bottom", y: "right" },

                hideXAxis: true,
                lineWidth: {
                  grid: {
                    x: 0,
                    y: 1,
                  },
                  frame: 2,
                },
                lineColor: {
                  grid: {
                    x: "blue",
                    y: "blue",
                  },
                  frame: "purple",
                },
              },
            ]}
            data={data}
            domainPadding={10}
          >
            {({ points, chartBounds }) => (
              <>
                <Bar
                  points={points.negative}
                  color={"red"}
                  chartBounds={chartBounds}
                  animate={{ type: "spring" }}
                />
                <Bar
                  color={"blue"}
                  points={points.anotherNegativeValue}
                  chartBounds={chartBounds}
                />
              </>
            )}
          </CartesianChart>
        </View>
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
    height: 400,
    marginBottom: 50,
  },
  optionsScrollView: {
    flex: 0.5,
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
