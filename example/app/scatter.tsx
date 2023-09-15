import { LinearGradient, Text, useFont, vec } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  CartesianChart,
  Scatter,
  useChartPressState,
  type ScatterShape,
} from "victory-native";
import { useDarkMode } from "react-native-dark";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "./consts/colors";
import { InputSlider } from "../components/InputSlider";
import { Button } from "../components/Button";
import { InfoCard } from "../components/InfoCard";
import { descriptionForRoute } from "./consts/routes";
import { InputSegment } from "../components/InputSegment";

const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: new Date(2020, index + 1).toLocaleString("default", {
      month: "long",
    }),
    listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
  }));

export default function ScatterPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const [data, setData] = useState(DATA(5));
  const [radius, setRadius] = useState(10);
  const [shape, setShape] = useState("circle" as ScatterShape);
  const { state, isActive } = useChartPressState({
    x: "",
    y: { listenCount: 0 },
  });

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
            chartPressState={state}
            axisOptions={{
              font,
              tickCount: 5,
              lineColor: isDark ? "#71717a" : "#d4d4d8",
              labelColor: isDark ? appColors.text.dark : appColors.text.light,
            }}
            data={data}
          >
            {({ points }) => {
              return (
                <>
                  <Scatter
                    points={points.listenCount}
                    animate={{ type: "spring" }}
                    radius={radius}
                    shape={shape}
                  >
                    <LinearGradient
                      start={vec(0, 0)}
                      end={vec(0, 400)}
                      colors={["#a78bfa", "#a78bfa50"]}
                    />
                  </Scatter>
                  <Scatter
                    points={points.listenCount}
                    animate={{ type: "spring" }}
                    radius={radius}
                    shape={shape}
                    style="stroke"
                    strokeWidth={1}
                    color="black"
                  />
                  {isActive && (
                    <Text
                      x={state.x.position}
                      y={state.y.listenCount.position}
                      text={state.x.value}
                      font={font}
                    />
                  )}
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
            label="Radius"
            maxValue={20}
            minValue={1}
            step={1}
            value={radius}
            onChange={setRadius}
          />
          <InputSegment<ScatterShape>
            label="Shape"
            value={shape}
            onChange={setShape}
            values={["circle", "square", "star"]}
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
