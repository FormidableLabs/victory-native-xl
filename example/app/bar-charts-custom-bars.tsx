import {
  LinearGradient,
  useFont,
  vec,
  Text as SkiaText,
} from "@shopify/react-native-skia";
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
    return data.findIndex((value) => value.month === state.x.value.value);
  }).value;
  if (activeXItem < 0) {
    activeXItem = 2;
  }

  // 폰트가 로드되지 않았을 경우
  if (!font) {
    return null;
  }

  console.log(data);
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
              data={[
                { listenCount: 61, month: 1 },
                { listenCount: 55, month: 2 },
                { listenCount: 77, month: 3 },
                { listenCount: 91, month: 4 },
                { listenCount: 52, month: 5 },
              ]}
            >
              {({ points, chartBounds }) => {
                return points.listenCount.map((p, i) => {
                  const text = `Value`;
                  return (
                    <Bar
                      barCount={points.listenCount.length}
                      key={i}
                      barWidth={30}
                      points={[p]}
                      chartBounds={chartBounds}
                      animate={{ type: "spring" }}
                      innerPadding={innerPadding}
                      roundedCorners={{
                        topLeft: roundedCorner,
                        topRight: roundedCorner,
                      }}
                      // textOffsetY={-10} // 텍스트의 y 좌표 오프셋
                      color={i === data.length - 1 ? "blue" : "green"}
                    >
                      <SkiaText font={font} color="blue" text={text} />
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
