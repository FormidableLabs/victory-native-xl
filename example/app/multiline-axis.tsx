import { useFont } from "@shopify/react-native-skia";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { CartesianChart, Line, Scatter } from "victory-native";
import { useDarkMode } from "react-native-dark";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";
import { InfoCard } from "../components/InfoCard";
import { descriptionForRoute } from "../consts/routes";

const DATA = Array.from({ length: 6 }, (_, index) => ({
  month: index,
  sales: Math.random() * 100 + 50,
  profit: Math.random() * 50 + 25,
}));

const MONTH_NAMES = [
  "January\n2024",
  "February\n2024",
  "March\n2024",
  "April\n2024",
  "May\n2024",
  "June\n2024",
];

const METRIC_LABELS = [
  "Low\nPerformance",
  "Below\nAverage",
  "Average\nPerformance",
  "Good\nPerformance",
  "Excellent\nPerformance",
];

export default function MultilineAxis(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const isDark = useDarkMode();
  const font = useFont(inter, 12);

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.chart}>
        <CartesianChart
          xKey="month"
          padding={20}
          yKeys={["sales", "profit"]}
          data={DATA}
          xAxis={{
            font,
            labelColor: isDark ? appColors.text.dark : appColors.text.light,
            formatXLabel: (value) =>
              MONTH_NAMES[value as number] || `Month ${value}`,
            labelOffset: 8,
          }}
          yAxis={[
            {
              font,
              labelColor: isDark ? appColors.text.dark : appColors.text.light,
              formatYLabel: (value) => {
                const index = Math.floor((value as number) / 25);
                return (
                  METRIC_LABELS[Math.min(index, METRIC_LABELS.length - 1)] ||
                  `${value}`
                );
              },
              labelOffset: 8,
              yKeys: ["sales", "profit"],
            },
          ]}
        >
          {({ points }) => (
            <>
              <Line
                points={points.sales}
                color="#8b5cf6"
                strokeWidth={3}
                animate={{ type: "spring" }}
              />
              <Line
                points={points.profit}
                color="#06b6d4"
                strokeWidth={3}
                animate={{ type: "spring" }}
              />
              <Scatter
                radius={4}
                points={points.sales}
                animate={{ type: "spring" }}
                color="#8b5cf6"
              />
              <Scatter
                radius={4}
                points={points.profit}
                animate={{ type: "spring" }}
                color="#06b6d4"
              />
            </>
          )}
        </CartesianChart>
      </View>
      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <InfoCard>
          {description ||
            "This example demonstrates multiline axis labels. X-axis shows months with years on separate lines, while Y-axis shows performance categories with descriptive text on multiple lines. Use \\n in your formatXLabel or formatYLabel functions to create multiline labels."}
        </InfoCard>
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
    flex: 1,
  },
  optionsScrollView: {
    flex: 0.3,
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
