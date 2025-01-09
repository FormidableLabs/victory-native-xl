import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { DashPathEffect, useFont, useImage } from "@shopify/react-native-skia";
import { CartesianChart, Line } from "victory-native";
import { Text } from "example/components/Text";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";

const DATA = [
  { temperature: 10, day: 1 },
  { temperature: 20, day: 2 },
  { temperature: 30, day: 3 },
  { temperature: 20, day: 4 },
  { temperature: 60, day: 5 },
  { temperature: 15, day: 6 },
];

const ChartWithRemoteImages = () => {
  const font = useFont(inter, 12);
  const [data] = useState(DATA);

  return (
    <View style={{ flex: 1 }}>
      <CartesianChart
        xKey="day"
        padding={5}
        yKeys={["temperature"]}
        domainPadding={{ left: 12, right: 50, top: 0 }}
        data={data}
        domain={{ y: [0, 100] }}
        xAxis={{
          font,
          labelOffset: 14,
          linePathEffect: <DashPathEffect intervals={[4, 4]} />,
        }}
        yAxis={[
          {
            tickValues: [15, 50, 80],
            tickImages: [
              { image: "https://picsum.photos/32/32", width: 32, height: 32 },
              { image: "https://picsum.photos/32/32", width: 32, height: 32 },
              { image: "https://picsum.photos/32/32", width: 32, height: 32 },
            ],
            labelOffset: 12,
            font,
            linePathEffect: <DashPathEffect intervals={[4, 4]} />,
          },
        ]}
      >
        {({ points }) => {
          return (
            <Line
              strokeWidth={3}
              color={"#f7ce64"}
              curveType="natural"
              points={points.temperature}
            />
          );
        }}
      </CartesianChart>
    </View>
  );
};

const ChartWithLocalImages = () => {
  const font = useFont(inter, 12);
  const [data] = useState(DATA);

  const warmImage = useImage(require("../assets/warm.png"));
  const medImage = useImage(require("../assets/med.png"));
  const coldImage = useImage(require("../assets/cold.png"));

  return (
    <View style={{ flex: 1 }}>
      <CartesianChart
        xKey="day"
        padding={5}
        yKeys={["temperature"]}
        domainPadding={{ left: 12, right: 50, top: 0 }}
        data={data}
        domain={{ y: [0, 100] }}
        xAxis={{
          font,
          labelOffset: 14,
          linePathEffect: <DashPathEffect intervals={[4, 4]} />,
        }}
        yAxis={[
          {
            tickValues: [15, 50, 80],
            tickImages: [
              { skImage: coldImage, width: 32, height: 32 },
              { skImage: medImage, width: 32, height: 32 },
              { skImage: warmImage, width: 32, height: 32 },
            ],
            labelOffset: 12,
            font,
            linePathEffect: <DashPathEffect intervals={[4, 4]} />,
          },
        ]}
      >
        {({ points }) => {
          return (
            <Line
              strokeWidth={3}
              color={"#f7ce64"}
              curveType="natural"
              points={points.temperature}
            />
          );
        }}
      </CartesianChart>
    </View>
  );
};

export default function AxisIconsChartPage() {
  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <ScrollView>
          <View style={styles.chartContainer}>
            <Text style={styles.title}>
              Chart with local images as tick values on the Y axis
            </Text>
            <ChartWithLocalImages />
          </View>
          <View style={styles.chartContainer}>
            <Text style={styles.title}>
              Chart with remote images as tick values on the Y axis
            </Text>
            <ChartWithRemoteImages />
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
