import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { StackedBar, CartesianChart, useChartPressState } from "victory-native";
import { useDarkMode } from "react-native-dark";
import { Text } from "example/components/Text";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "./consts/colors";

const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
    favouriteCount: Math.floor(Math.random() * (100 - 50 + 1)) + 20,
    sales: Math.floor(Math.random() * (100 - 50 + 1)) + 25,
  }));

const IndividualTouchableBarChart = () => {
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const [data] = useState(DATA(4));
  const [innerPadding] = useState(0.33);
  const [roundedCorner] = useState(5);
  const { state } = useChartPressState({
    x: 0,
    y: { favouriteCount: 0, listenCount: 0, sales: 0 },
  });

  const pressedXY = { x: state.x.value.value - 1, y: state.yIndex.value };
  return (
    <View style={{ flex: 1 }}>
      <CartesianChart
        chartPressState={state}
        xKey="month"
        padding={5}
        yKeys={["favouriteCount", "listenCount", "sales"]}
        domainPadding={{ left: 50, right: 50, top: 0 }}
        domain={{ y: [0, 200] }}
        axisOptions={{
          font,
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
            <StackedBar
              barWidth={45}
              innerPadding={innerPadding}
              chartBounds={chartBounds}
              points={[points.favouriteCount, points.listenCount, points.sales]}
              colors={["blue", "red", "green"]}
              barOptions={({ isBottom, isTop, columnIndex, rowIndex }) => {
                const isSelected =
                  pressedXY.x === rowIndex && pressedXY.y === columnIndex;

                return {
                  roundedCorners: isTop
                    ? {
                        topLeft: roundedCorner,
                        topRight: roundedCorner,
                      }
                    : isBottom
                      ? {
                          bottomRight: roundedCorner,
                          bottomLeft: roundedCorner,
                        }
                      : undefined,
                  color: isSelected ? "pink" : undefined,
                };
              }}
            />
          );
        }}
      </CartesianChart>
    </View>
  );
};

const TouchableRowsChart = () => {
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const [data] = useState(DATA(4));
  const [innerPadding] = useState(0.33);
  const [roundedCorner] = useState(5);
  const { state } = useChartPressState({
    x: 0,
    y: { favouriteCount: 0, listenCount: 0, sales: 0 },
  });

  const pressedXY = { x: state.x.value.value - 1, y: state.yIndex.value };
  return (
    <View style={{ flex: 1 }}>
      <CartesianChart
        chartPressState={state}
        xKey="month"
        padding={5}
        yKeys={["favouriteCount", "listenCount", "sales"]}
        domainPadding={{ left: 50, right: 50, top: 0 }}
        domain={{ y: [0, 200] }}
        axisOptions={{
          font,
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
            <StackedBar
              barWidth={45}
              innerPadding={innerPadding}
              chartBounds={chartBounds}
              points={[points.favouriteCount, points.listenCount, points.sales]}
              colors={["blue", "red", "green"]}
              barOptions={({ isBottom, isTop, columnIndex }) => {
                const isSelected = pressedXY.y === columnIndex;

                return {
                  roundedCorners: isTop
                    ? {
                        topLeft: roundedCorner,
                        topRight: roundedCorner,
                      }
                    : isBottom
                      ? {
                          bottomRight: roundedCorner,
                          bottomLeft: roundedCorner,
                        }
                      : undefined,
                  color: isSelected ? "pink" : undefined,
                };
              }}
            />
          );
        }}
      </CartesianChart>
    </View>
  );
};

const CustomChildrenChart = () => {
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const [data] = useState(DATA(4));
  const [innerPadding] = useState(0.33);
  const [roundedCorner] = useState(5);

  return (
    <View style={{ flex: 1 }}>
      <CartesianChart
        xKey="month"
        padding={5}
        yKeys={["favouriteCount", "listenCount", "sales"]}
        domainPadding={{ left: 50, right: 50, top: 0 }}
        domain={{ y: [0, 200] }}
        axisOptions={{
          font,
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
            <StackedBar
              barWidth={45}
              innerPadding={innerPadding}
              chartBounds={chartBounds}
              points={[points.favouriteCount, points.listenCount, points.sales]}
              colors={["blue", "red", "green"]}
              barOptions={({ isBottom, isTop, columnIndex, rowIndex }) => {
                return {
                  roundedCorners: isTop
                    ? {
                        topLeft: roundedCorner,
                        topRight: roundedCorner,
                      }
                    : isBottom
                      ? {
                          bottomRight: roundedCorner,
                          bottomLeft: roundedCorner,
                        }
                      : undefined,
                  children:
                    columnIndex == 2 && rowIndex == 0 ? (
                      <LinearGradient
                        start={vec(100, 100)}
                        end={vec(10, 100)}
                        colors={["yellow", "purple"]}
                      />
                    ) : columnIndex == 2 && rowIndex == 3 ? (
                      <LinearGradient
                        start={vec(0, 0)}
                        end={vec(0, 200)}
                        colors={["black", "orange"]}
                      />
                    ) : undefined,
                };
              }}
            />
          );
        }}
      </CartesianChart>
    </View>
  );
};

export default function StackedBarChartsComplexPage() {
  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <ScrollView>
          <View style={styles.chartContainer}>
            <Text style={styles.title}>
              Stacked chart with individual touchable bars
            </Text>
            <IndividualTouchableBarChart />
          </View>
          <View style={styles.chartContainer}>
            <Text style={styles.title}>Stacked chart with touchable rows</Text>
            <TouchableRowsChart />
          </View>
          <View style={styles.chartContainer}>
            <Text style={styles.title}>Stacked chart with custom children</Text>
            <CustomChildrenChart />
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
  },
  chartContainer: {
    height: 400,
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: appColors.cardBorder.light,
    $dark: {
      borderBottomColor: appColors.cardBorder.dark,
    },
  },
  title: { marginBottom: 10, fontSize: 16, fontWeight: "bold" },
});
