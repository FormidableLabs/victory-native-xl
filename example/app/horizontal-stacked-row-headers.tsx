import {
  DashPathEffect,
  Text as SkiaText,
  useFont,
  type SkFont,
} from "@shopify/react-native-skia";
import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CartesianChart,
  HorizontalStackedBar,
  type AxisLabelRenderer,
} from "victory-native";
import { useDarkMode } from "react-native-dark";
import inter from "../assets/inter-medium.ttf";
import { InfoCard } from "../components/InfoCard";
import { Text } from "../components/Text";
import { appColors } from "../consts/colors";
import { descriptionForRoute } from "../consts/routes";

type UtilizationDatum = {
  team: string;
  planning: number;
  implementation: number;
  training: number;
  support: number;
  maintenance: number;
  reporting: number;
  research: number;
};

type SegmentKey = Exclude<keyof UtilizationDatum, "team">;

type SegmentConfig = {
  key: SegmentKey;
  label: string;
  color: string;
};

const BAR_WIDTH = 30;
const HEADER_GAP = 6;

const DATA: UtilizationDatum[] = [
  {
    team: "North Region",
    planning: 105,
    implementation: 75,
    training: 115,
    support: 125,
    maintenance: 35,
    reporting: 82,
    research: 110,
  },
  {
    team: "Central Region",
    planning: 118,
    implementation: 105,
    training: 42,
    support: 88,
    maintenance: 12,
    reporting: 48,
    research: 0,
  },
  {
    team: "South Region",
    planning: 24,
    implementation: 62,
    training: 58,
    support: 66,
    maintenance: 34,
    reporting: 82,
    research: 0,
  },
];

const SEGMENTS: SegmentConfig[] = [
  { key: "support", label: "Support", color: "#0875c9" },
  { key: "implementation", label: "Implementation", color: "#7ac300" },
  { key: "training", label: "Training", color: "#d9ecad" },
  { key: "planning", label: "Planning", color: "#f2b42b" },
  { key: "maintenance", label: "Maintenance", color: "#b5b8bb" },
  { key: "reporting", label: "Reporting", color: "#86a4b2" },
  { key: "research", label: "Research", color: "#578c0a" },
];

const MAX_TOTAL = 800;

const createRowHeaderRenderer = (
  font: SkFont | null,
  color: string,
): AxisLabelRenderer<string> => ({
  measure: ({ text }) => ({
    width: Math.max(92, text.length * 9),
    height: font?.getSize() ?? 16,
    fontSize: font?.getSize() ?? 16,
    lineHeight: font?.getSize() ?? 16,
  }),
  render: ({ text, y, height, chartBounds }) => {
    if (!font) return null;

    const tickCenterY = y + height / 2;
    const labelTopY = tickCenterY - BAR_WIDTH / 2 - height - HEADER_GAP;
    const labelBaselineY = labelTopY + height;

    return (
      <SkiaText
        text={text}
        font={font}
        color={color}
        x={chartBounds.left}
        y={labelBaselineY}
      />
    );
  },
});

export default function HorizontalStackedRowHeadersPage(props: {
  segment: string;
}) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 14);
  const rowHeaderFont = useFont(inter, 16);
  const isDark = useDarkMode();
  const axisLabelColor = isDark ? appColors.text.dark : "#6f8fa3";
  const rowHeaderColor = isDark ? appColors.text.dark : "#003b5c";
  const rowHeaderRenderer = createRowHeaderRenderer(
    rowHeaderFont,
    rowHeaderColor,
  );

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <InfoCard>{description}</InfoCard>

        <View style={styles.chartPanel}>
          <View style={styles.chart}>
            <CartesianChart
              orientation="horizontal"
              data={DATA}
              xKey="team"
              yKeys={SEGMENTS.map(({ key }) => key)}
              domain={{ x: [0, MAX_TOTAL] }}
              domainPadding={{ top: 64, bottom: 44, left: 0, right: 24 }}
              padding={{ top: 16, bottom: 6, left: 0, right: 4 }}
              xAxis={{
                font,
                tickCount: 4,
                labelColor: axisLabelColor,
                formatXLabel: (value) => `${value}h`,
                linePathEffect: <DashPathEffect intervals={[4, 4]} />,
              }}
              yAxis={[
                {
                  yKeys: SEGMENTS.map(({ key }) => key),
                  font,
                  tickCount: DATA.length,
                  labelColor: rowHeaderColor,
                  labelPosition: "inset",
                  labelOffset: 0,
                  labelRenderer: rowHeaderRenderer,
                  lineWidth: 0,
                  formatYLabel: (value) => String(value),
                },
              ]}
              frame={{ lineWidth: 0 }}
            >
              {({ points, chartBounds }) => (
                <HorizontalStackedBar
                  points={SEGMENTS.map(({ key }) => points[key])}
                  chartBounds={chartBounds}
                  barWidth={BAR_WIDTH}
                  colors={SEGMENTS.map(({ color }) => color)}
                  barOptions={({ isLeft, isRight }) => ({
                    roundedCorners: {
                      topLeft: isLeft ? 4 : 0,
                      bottomLeft: isLeft ? 4 : 0,
                      topRight: isRight ? 4 : 0,
                      bottomRight: isRight ? 4 : 0,
                    },
                  })}
                />
              )}
            </CartesianChart>
          </View>

          <Legend />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Legend() {
  return (
    <View style={styles.legend}>
      {SEGMENTS.map(({ color, label }) => (
        <LegendItem key={label} color={color} label={label} />
      ))}
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
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
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 14,
  },
  chartPanel: {
    gap: 10,
  },
  chart: {
    height: 300,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 18,
    rowGap: 8,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: "#6f8fa3",
    fontSize: 15,
    $dark: {
      color: appColors.text.dark,
    },
  },
});
