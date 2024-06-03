import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Bar, BarGroup, CartesianChart } from "victory-native";
import { useDarkMode } from "react-native-dark";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "./consts/colors";
import { Button } from "../components/Button";
import { InfoCard } from "../components/InfoCard";
import { descriptionForRoute } from "./consts/routes";

const GROUP_DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    x: index + 1,
    y: Math.floor(Math.random() * 80) - 40,
    z: Math.floor(Math.random() * 100) - 50,
    w: Math.floor(Math.random() * 90) - 45,
  }));

const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listenCount: Math.floor(Math.random() * 801) - 300,
  }));

export default function NegativeBarChartsPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const [data, setData] = useState(DATA(10));
  const [groupData, setGroupData] = useState(GROUP_DATA(5));
  const [innerPadding] = useState(0.33);
  const [roundedCorner] = useState(5);

  function shuffleData() {
    setData(DATA(10));
    setGroupData(GROUP_DATA(5));
  }

  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <View style={styles.chart}>
          <CartesianChart
            xKey="month"
            padding={5}
            yKeys={["listenCount"]}
            domainPadding={{ left: 50, right: 50, top: 30, bottom: 20 }}
            axisOptions={{
              font,
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
        <View style={styles.chart}>
          <CartesianChart
            data={groupData}
            xKey="x"
            yKeys={["y", "z", "w"]}
            padding={{ left: 10, right: 10, bottom: 5, top: 15 }}
            domainPadding={{ left: 50, right: 50, top: 30 }}
            axisOptions={{
              font,
              lineColor: isDark ? "#71717a" : "#d4d4d8",
              labelColor: isDark ? appColors.text.dark : appColors.text.light,
            }}
          >
            {({ points, chartBounds }) => (
              <BarGroup
                chartBounds={chartBounds}
                betweenGroupPadding={0.4}
                withinGroupPadding={0.1}
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
              onPress={shuffleData}
              title="Shuffle Data"
            />
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
