import * as React from "react";
import { CartesianChart } from "victory-native";
import {
  Circle,
  LinearGradient,
  Path,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import inter from "../assets/inter-medium.ttf";
import {
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { appColors } from "./consts/colors";
import { useEffect } from "react";
import { InfoCard } from "../components/InfoCard";
import { useDarkMode } from "react-native-dark";
import { AnimatedText } from "../components/AnimatedText";
import { Text } from "../components/Text";

const colors = [appColors.tint, "#818cf8"];

export default function OrdinalDataScreen() {
  const font = useFont(inter, 12);
  const activeX = useSharedValue(0);
  const activeXValue = useDerivedValue(() => activeX.value);
  const day = useDerivedValue(() => DATA?.[activeX.value]?.day || "");
  const isDark = useDarkMode();

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.chart}>
        <CartesianChart
          data={DATA}
          xKey="x"
          domainPadding={40}
          padding={{ top: 25, left: 10, right: 10, bottom: 10 }}
          yKeys={["high"]}
          gridOptions={{
            font,
            formatXLabel: (i) => DATA?.[i]?.day || "",
            formatYLabel: (i) => `${i}°`,
            tickCount: { x: 7, y: 10 },
            lineColor: isDark ? "#71717a" : "#d4d4d8",
            labelColor: isDark ? appColors.text.dark : appColors.text.light,
          }}
          isPressEnabled
          activePressX={{ value: activeX }}
        >
          {({ paths, chartBounds, points, yScale }) => {
            return (
              <>
                <Path
                  path={paths["high.line"]}
                  style="stroke"
                  strokeCap="round"
                  strokeJoin="round"
                  color={appColors.tint}
                  strokeWidth={5}
                >
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(chartBounds.top, chartBounds.bottom)}
                    colors={colors}
                  />
                </Path>
                {points.high.map(({ x, y, xValue, yValue }) => (
                  <AnimatedCircle
                    key={`circle-${x}-${y}`}
                    x={x}
                    y={y}
                    radius={activeXValue.value === xValue ? 12 : 0}
                    color={interpolateColor(
                      yValue,
                      [yScale.domain().at(0)!, yScale.domain().at(-1)!],
                      colors,
                    )}
                  />
                ))}
              </>
            );
          }}
        </CartesianChart>
      </View>
      <View style={styles.selectionContainer}>
        <AnimatedText style={styles.animatedText} text={day} />
        <Text style={{ fontSize: 18 }}> is selected.</Text>
      </View>
      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <InfoCard
          fileName="ordinal-data.tsx"
          message="This chart shows off ordinal data and touch events. Tap different x axis points to see the highlighted dot move. The color changes based on interpolating the color from the transformed and range data."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const AnimatedCircle = ({
  x,
  y,
  radius,
  color,
}: {
  x: number;
  y: number;
  radius: number;
  color: string;
}) => {
  const animatedRadius = useSharedValue(0);
  useEffect(() => {
    animatedRadius.value = withSpring(radius);
  }, [radius]);
  return <Circle r={animatedRadius} cx={x} cy={y} color={color} style="fill" />;
};

const DATA = [
  { day: "Mon", high: 50 + 20 * Math.random() },
  { day: "Tue", high: 50 + 20 * Math.random() },
  { day: "Wed", high: 50 + 20 * Math.random() },
  { day: "Thu", high: 50 + 20 * Math.random() },
  { day: "Fri", high: 50 + 20 * Math.random() },
  { day: "Sat", high: 50 + 20 * Math.random() },
  { day: "Sun", high: 50 + 20 * Math.random() },
].map((dat, i) => ({ ...dat, x: i }));

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  chart: {
    flex: 1,
  },
  selectionContainer: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "center",
  },
  animatedText: {
    fontSize: 18,
    color: appColors.text.light,
    $dark: {
      color: appColors.text.dark,
    },
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
