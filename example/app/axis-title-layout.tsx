import {
  DashPathEffect,
  LinearGradient,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bar, CartesianChart, HorizontalBar, Line } from "victory-native";
import { InfoCard } from "example/components/InfoCard";
import { Text } from "example/components/Text";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";
import { descriptionForRoute } from "../consts/routes";

const NUMERIC_DATA = [
  { month: "Jan", booked: 34, forecast: 39 },
  { month: "Feb", booked: 42, forecast: 44 },
  { month: "Mar", booked: 37, forecast: 41 },
  { month: "Apr", booked: 48, forecast: 52 },
  { month: "May", booked: 55, forecast: 58 },
  { month: "Jun", booked: 51, forecast: 56 },
];

const CATEGORY_DATA = [
  { team: "North", hours: 64 },
  { team: "Central", hours: 42 },
  { team: "South", hours: 58 },
  { team: "West", hours: 36 },
];

export default function AxisTitleLayoutPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <InfoCard>{description}</InfoCard>

        <ChartSection title="Numeric Y Axes">
          <View style={styles.chart}>
            <NumericYAxisTitleChart font={font} />
          </View>
        </ChartSection>

        <ChartSection title="Category Y Axes">
          <View style={styles.chart}>
            <CategoryYAxisTitleChart font={font} />
          </View>
        </ChartSection>
      </ScrollView>
    </SafeAreaView>
  );
}

function ChartSection({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.section}>
      <Text selectable style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function NumericYAxisTitleChart({
  font,
}: {
  font: ReturnType<typeof useFont>;
}) {
  return (
    <CartesianChart
      data={NUMERIC_DATA}
      xKey="month"
      yKeys={["booked", "forecast"]}
      padding={{ top: 18, right: 4, bottom: 12, left: 4 }}
      domain={{ y: [0, 70] }}
      domainPadding={{ left: 24, right: 24, top: 12 }}
      xAxis={{
        font,
        tickCount: NUMERIC_DATA.length,
        labelColor: appColors.text.light,
      }}
      yAxis={[
        {
          yKeys: ["booked"],
          font,
          tickCount: 4,
          labelColor: "#0f766e",
          labelOffset: 4,
          title: {
            text: "Booked",
            font,
            color: "#0f766e",
            offset: 6,
          },
          linePathEffect: <DashPathEffect intervals={[4, 4]} />,
        },
        {
          yKeys: ["forecast"],
          axisSide: "right",
          font,
          tickCount: 4,
          labelColor: "#7c3aed",
          labelOffset: 4,
          title: {
            text: "Forecast\nHours",
            font,
            color: "#7c3aed",
            offset: 6,
          },
          linePathEffect: <DashPathEffect intervals={[4, 4]} />,
        },
      ]}
      frame={{ lineWidth: 0 }}
    >
      {({ points, chartBounds }) => (
        <>
          <Bar
            points={points.booked}
            chartBounds={chartBounds}
            roundedCorners={{ topLeft: 5, topRight: 5 }}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, 260)}
              colors={["#14b8a6", "#99f6e4"]}
            />
          </Bar>
          <Line points={points.forecast} color="#7c3aed" strokeWidth={3} />
        </>
      )}
    </CartesianChart>
  );
}

function CategoryYAxisTitleChart({
  font,
}: {
  font: ReturnType<typeof useFont>;
}) {
  return (
    <CartesianChart
      orientation="horizontal"
      data={CATEGORY_DATA}
      xKey="team"
      yKeys={["hours"]}
      domain={{ x: [0, 80] }}
      domainPadding={{ top: 28, bottom: 28, right: 18 }}
      padding={{ top: 12, right: 4, bottom: 12, left: 4 }}
      xAxis={{
        font,
        tickCount: 5,
        labelColor: appColors.text.light,
        formatXLabel: (value) => `${value}h`,
        linePathEffect: <DashPathEffect intervals={[4, 4]} />,
      }}
      yAxis={[
        {
          yKeys: ["hours"],
          font,
          tickCount: CATEGORY_DATA.length,
          labelColor: "#0369a1",
          labelOffset: 4,
          title: {
            text: "Delivery\nTeam",
            font,
            color: "#0369a1",
            offset: 6,
          },
          lineWidth: 0,
        },
        {
          yKeys: ["hours"],
          axisSide: "right",
          font,
          tickCount: CATEGORY_DATA.length,
          labelColor: "#be123c",
          labelOffset: 4,
          title: {
            text: "Capacity",
            font,
            color: "#be123c",
            offset: 6,
          },
          lineWidth: 0,
        },
      ]}
      frame={{ lineWidth: 0 }}
    >
      {({ points, chartBounds }) => (
        <HorizontalBar
          points={points.hours}
          chartBounds={chartBounds}
          barWidth={22}
          roundedCorners={{ topRight: 6, bottomRight: 6 }}
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(360, 0)}
            colors={["#0ea5e9", "#bae6fd"]}
          />
        </HorizontalBar>
      )}
    </CartesianChart>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 22,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: appColors.text.light,
    fontSize: 22,
    fontWeight: "700",
    $dark: {
      color: appColors.text.dark,
    },
  },
  chart: {
    height: 300,
  },
});
