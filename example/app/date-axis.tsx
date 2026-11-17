import { useFont } from "@shopify/react-native-skia";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { CartesianChart, Line, Scatter } from "victory-native";
import { useDarkMode } from "react-native-dark";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";
import { InfoCard } from "../components/InfoCard";
import { Text } from "../components/Text";
import { descriptionForRoute } from "../consts/routes";

const day = (n: number) => new Date(Date.UTC(2024, 0, n));

/**
 * Deliberately irregular gaps: Jan 1, 2, 3, then a jump to Jan 13 and 20.
 * On a time scale the spacing is proportional to elapsed time. If the axis
 * ever falls back to categorical handling, these render evenly instead —
 * which makes this screen a visual regression test for date support.
 */
const IRREGULAR_DATA = [
  { date: day(1), sales: 28 },
  { date: day(2), sales: 41 },
  { date: day(3), sales: 35 },
  { date: day(13), sales: 47 },
  { date: day(20), sales: 31 },
];

const EVEN_DATA = Array.from({ length: 12 }, (_, index) => ({
  date: new Date(Date.UTC(2024, index, 1)),
  sales: 30 + Math.round(15 * Math.sin(index)),
}));

export default function DateAxisPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const isDark = useDarkMode();
  const font = useFont(inter, 12);

  const axisColor = isDark ? appColors.text.dark : appColors.text.light;

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {description ? <InfoCard>{description}</InfoCard> : null}

        <Text style={styles.heading}>Irregular gaps (daily)</Text>
        <Text style={styles.caption}>
          Jan 1–3, then Jan 13 and Jan 20. Spacing follows elapsed time.
        </Text>
        <View style={styles.chart}>
          <CartesianChart
            data={IRREGULAR_DATA}
            xKey="date"
            yKeys={["sales"]}
            axisOptions={{
              font,
              labelColor: axisColor,
              lineColor: isDark ? "#71717a" : "#d4d4d8",
              formatXLabel: (date) =>
                date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                }),
            }}
          >
            {({ points }) => (
              <>
                <Line
                  points={points.sales}
                  color={appColors.tint}
                  strokeWidth={3}
                  curveType="linear"
                />
                <Scatter
                  points={points.sales}
                  radius={5}
                  color={appColors.tint}
                />
              </>
            )}
          </CartesianChart>
        </View>

        <Text style={styles.heading}>Twelve months</Text>
        <Text style={styles.caption}>
          No formatXLabel supplied — ticks fall on calendar boundaries and use
          the default date formatting.
        </Text>
        <View style={styles.chart}>
          <CartesianChart
            data={EVEN_DATA}
            xKey="date"
            yKeys={["sales"]}
            axisOptions={{
              font,
              labelColor: axisColor,
              lineColor: isDark ? "#71717a" : "#d4d4d8",
              tickCount: { x: 4, y: 5 },
            }}
          >
            {({ points }) => (
              <Line
                points={points.sales}
                color={appColors.tint}
                strokeWidth={3}
              />
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
    $dark: { backgroundColor: appColors.viewBackground.dark },
  },
  scroll: {
    padding: 12,
    gap: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  caption: {
    fontSize: 13,
    opacity: 0.7,
  },
  chart: {
    height: 260,
  },
});
