import { useFont } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { StackedBar, CartesianChart } from "victory-native";
import { useDarkMode } from "react-native-dark";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";
import { InputSlider } from "../components/InputSlider";
import { Button } from "../components/Button";
import { InfoCard } from "../components/InfoCard";
import { descriptionForRoute } from "../consts/routes";

const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
    favouriteCount: Math.floor(Math.random() * (100 - 50 + 1)) + 20,
    sales: Math.floor(Math.random() * (100 - 50 + 1)) + 25,
  }));

export default function StackedBarChartPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const [data, setData] = useState(DATA(4));
  const [innerPadding, setInnerPadding] = useState(0.66);
  const [roundedCorner, setRoundedCorner] = useState(5);

  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <View style={styles.chart}>
          <CartesianChart
            xKey="month"
            padding={5}
            yKeys={["listenCount", "favouriteCount", "sales"]}
            domainPadding={{ left: 50, right: 50, top: 30 }}
            domain={{ y: [0, 250] }}
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
                  animate={{ type: "spring" }}
                  innerPadding={innerPadding}
                  chartBounds={chartBounds}
                  points={[
                    points.listenCount,
                    points.favouriteCount,
                    points.sales,
                  ]}
                  colors={["orange", "gold", "sienna"]}
                  barOptions={({ isBottom, isTop }) => {
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
                    };
                  }}
                />
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
            label="Corner Radius"
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
