import { useFont } from "@shopify/react-native-skia";
import * as React from "react";
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { CartesianChart, Line, Bar, Area } from "victory-native";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "./consts/colors";
import { InputSlider } from "../components/InputSlider";

const randomNumber = () => Math.floor(Math.random() * (50 - 25 + 1)) + 25;
const randomNumber2 = () => Math.floor(Math.random() * (50 - 25 + 1)) + 10000;
const randomNumberNegative = () =>
  Math.floor(Math.random() * (50 - 25 + 1)) - 200;
const randomFloatBetween = (a: number, b: number): number => {
  return Math.random() * (b - a) + a;
};

const DATA = (numberPoints = 13) =>
  Array.from({ length: numberPoints }, (_, index) => ({
    day: index + 1,
    sales: randomNumber(),
    profit: randomNumber2(),
    negative: Math.floor(Math.random() * 801) - 300,
    anotherNegativeValue: randomNumberNegative(),
  }));

const Y_DOMAIN_EXAMPLE_DATA = () =>
  Array.from({ length: 24 }, (_, index) => ({
    time: `${index.toString().padStart(2, "0")}:00`,
    active: new Set([5, 6, 7, 12, 13, 14, 15, 16]).has(index) ? 1 : 0,
    insideTemp: randomFloatBetween(15, 22),
    outsideTemp: randomFloatBetween(7, 12),
    price: Math.floor(randomFloatBetween(100, 200)),
  }));

export default function MultipleYAxesPage() {
  const font = useFont(inter, 12);
  const [data] = useState(DATA());
  const [yDomainData] = useState(Y_DOMAIN_EXAMPLE_DATA());
  const [priceYDomain, setPriceYDomain] = useState<[number, number]>([
    100, 200,
  ]);

  const red = "#a04d4d";
  const blue = "#1e1e59";
  const lightBlue = "#6dc9e8";
  const green = "#74b567";
  const gray = "#232323";

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView>
        <View style={styles.chart}>
          <CartesianChart
            xKey="day"
            padding={25}
            yKeys={["sales", "profit"]}
            xAxis={{
              font,
              labelColor: "orange",
              formatXLabel: (value) => {
                return value.toFixed(0);
              },
              lineColor: "pink",
            }}
            frame={{
              lineColor: "black",
              lineWidth: 2,
            }}
            yAxis={[
              {
                yKeys: ["sales"],
                font,
                labelColor: "orange",
                formatYLabel: (value) => {
                  return value.toFixed(0);
                },
                lineColor: "pink",
              },
              {
                yKeys: ["profit"],
                font,
                labelColor: "green",
                formatYLabel: (value) => {
                  return value.toFixed(0);
                },
                axisSide: "right",
                lineColor: "green",
              },
            ]}
            data={data}
            domainPadding={10}
          >
            {({ points, chartBounds }) => (
              <>
                <Bar
                  color={blue}
                  points={points.profit}
                  chartBounds={chartBounds}
                />
                <Line
                  points={points.sales}
                  color={red}
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
            xAxis={{
              font,
              labelColor: "#a04d4d",
              formatXLabel: (value) => {
                return value.toFixed(0);
              },
              lineColor: red,
            }}
            frame={{
              lineColor: "black",
              lineWidth: 2,
            }}
            yAxis={[
              {
                yKeys: ["negative"],
                font,
                labelColor: blue,
                formatYLabel: (value) => {
                  return value.toFixed(0);
                },
                lineColor: blue,
              },
              {
                yKeys: ["anotherNegativeValue"],
                font,
                labelColor: red,
                formatYLabel: (value) => {
                  return value.toFixed(0);
                },
                axisSide: "right",
                lineColor: red,
              },
            ]}
            data={data}
            domainPadding={10}
          >
            {({ points, chartBounds }) => {
              return (
                <>
                  <Bar
                    points={points.negative}
                    color={red}
                    chartBounds={chartBounds}
                    animate={{ type: "spring" }}
                  />
                  <Line
                    color={blue}
                    strokeWidth={3}
                    points={points.anotherNegativeValue}
                  />
                </>
              );
            }}
          </CartesianChart>
        </View>
        {/* Domain per yAxis */}
        <View style={styles.chart}>
          <CartesianChart
            xKey="time"
            padding={10}
            yKeys={["active", "price", "insideTemp", "outsideTemp"]}
            xAxis={{
              font,
              labelColor: gray,
              formatXLabel: (value) => {
                return value;
              },
              lineColor: "transparent",
            }}
            yAxis={[
              {
                yKeys: ["active"],
                font,
                formatYLabel: () => {
                  return "";
                },
                domain: [0, 1],
                lineColor: "#d3d3d3",
                axisSide: undefined,
              },
              {
                yKeys: ["price"],
                font,
                labelColor: gray,
                formatYLabel: (value) => {
                  return `$${value.toFixed(0)}`;
                },
                axisSide: "left",
                domain: priceYDomain,
              },
              {
                yKeys: ["insideTemp", "outsideTemp"],
                font,
                labelColor: gray,
                formatYLabel: (value) => {
                  return `${value.toFixed(0)} °C`;
                },
                axisSide: "right",
                domain: [0, 30],
              },
            ]}
            data={yDomainData}
          >
            {({ points, chartBounds }) => (
              <>
                <Area
                  curveType={"step"}
                  color={lightBlue}
                  opacity={0.5}
                  points={points.active}
                  y0={chartBounds.bottom}
                />
                <Line
                  points={points.price}
                  curveType={"step"}
                  color={red}
                  strokeWidth={3}
                  opacity={0.8}
                  animate={{ type: "spring" }}
                />
                <Line
                  points={points.insideTemp}
                  curveType={"natural"}
                  color={blue}
                  strokeWidth={3}
                  animate={{ type: "spring" }}
                />
                <Line
                  points={points.outsideTemp}
                  curveType={"natural"}
                  color={green}
                  strokeWidth={3}
                  animate={{ type: "spring" }}
                />
              </>
            )}
          </CartesianChart>
        </View>
        <View style={styles.sliders}>
          <InputSlider
            label="Price domain y lower bound"
            maxValue={200}
            minValue={0}
            step={10}
            value={priceYDomain[0]}
            onChange={(val) => setPriceYDomain((curr) => [val, curr[1]])}
          />
          <InputSlider
            label="Price domain y upper bound"
            maxValue={300}
            minValue={100}
            step={10}
            value={priceYDomain[1]}
            onChange={(val) => setPriceYDomain((curr) => [curr[0], val])}
          />
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
  sliders: {
    paddingHorizontal: 10,
    marginTop: -40,
  },
});
