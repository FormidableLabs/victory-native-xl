import {
  DashPathEffect,
  LinearGradient,
  useFont,
  vec,
  type Color,
  type SkFont,
} from "@shopify/react-native-skia";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { CartesianChart, HorizontalBar } from "victory-native";
import { useDarkMode } from "react-native-dark";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";
import { Button } from "../components/Button";
import { InfoCard } from "../components/InfoCard";
import { InputColor } from "../components/InputColor";
import { InputSegment } from "../components/InputSegment";
import { InputSlider } from "../components/InputSlider";
import { InputSwitch } from "../components/InputSwitch";
import { Text } from "../components/Text";
import { descriptionForRoute } from "../consts/routes";

type HorizontalDatum = {
  category: string;
  value: number;
};

const MIXED_DATA: HorizontalDatum[] = [
  { category: "Audio", value: 46 },
  { category: "Books", value: 68 },
  { category: "Events", value: -28 },
  { category: "Merch", value: 12 },
  { category: "Video", value: -18 },
  { category: "Web", value: 75 },
];

const LEADERBOARD_DATA: HorizontalDatum[] = [
  { category: "North", value: 88 },
  { category: "West", value: 72 },
  { category: "South", value: 61 },
  { category: "East", value: 54 },
];

const DIVERGING_DATA: HorizontalDatum[] = [
  { category: "Quality", value: 42 },
  { category: "Support", value: -34 },
  { category: "Speed", value: 28 },
  { category: "Pricing", value: -46 },
  { category: "Reliability", value: 36 },
];

const LONG_LABEL_DATA: HorizontalDatum[] = [
  { category: "Enterprise services", value: 128 },
  { category: "Open-source maintenance", value: 96 },
  { category: "Developer education", value: 74 },
  { category: "Design systems", value: 66 },
];

const COMPACT_DATA: HorizontalDatum[] = [
  { category: "Jan", value: 31 },
  { category: "Feb", value: 42 },
  { category: "Mar", value: 36 },
  { category: "Apr", value: 54 },
  { category: "May", value: 49 },
  { category: "Jun", value: 63 },
  { category: "Jul", value: 58 },
  { category: "Aug", value: 71 },
  { category: "Sep", value: 67 },
  { category: "Oct", value: 76 },
  { category: "Nov", value: 84 },
  { category: "Dec", value: 91 },
];

const LABEL_POSITION_DATA: HorizontalDatum[] = [
  { category: "Top", value: 72 },
  { category: "Bottom", value: 56 },
  { category: "Left", value: 44 },
  { category: "Right", value: 88 },
];

export default function HorizontalBarPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const [data, setData] = useState(MIXED_DATA);
  const [barWidth, setBarWidth] = useState(26);
  const [roundedCorner, setRoundedCorner] = useState(8);
  const [showLabels, setShowLabels] = useState(true);
  const [labelColor, setLabelColor] = useState<Color>("#262626");
  const [labelPosition, setLabelPosition] = useState<
    "top" | "bottom" | "left" | "right"
  >("right");

  const axisLabelColor = isDark ? appColors.text.dark : appColors.text.light;

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <InfoCard>{description}</InfoCard>

        <ChartSection
          title="Interactive Mixed Values"
          description="Positive and negative bars share the zero baseline, with configurable labels and rounded value ends."
        >
          <View style={styles.largeChart}>
            <HorizontalBarExample
              data={data}
              font={font}
              axisLabelColor={axisLabelColor}
              domain={[-80, 160]}
              barWidth={barWidth}
              roundedCorner={roundedCorner}
              labelColor={labelColor}
              labelPosition={labelPosition}
              showLabels={showLabels}
              colors={["#14b8a6", "#6366f150"]}
            />
          </View>
          <View style={styles.row}>
            <Button
              accessibilityLabel="Reverse horizontal bar data"
              style={styles.rowButton}
              onPress={() => setData((current) => [...current].reverse())}
              title="Reverse Data"
            />
            <Button
              accessibilityLabel="Reset horizontal bar data"
              style={styles.rowButton}
              onPress={() => setData(MIXED_DATA)}
              title="Reset Data"
            />
          </View>
          <InputSlider
            label="Bar Width"
            maxValue={44}
            minValue={10}
            step={1}
            value={barWidth}
            onChange={setBarWidth}
          />
          <InputSlider
            label="Value-End Corner Radius"
            maxValue={20}
            minValue={0}
            step={1}
            value={roundedCorner}
            onChange={setRoundedCorner}
          />
          <InputSwitch
            label="Show Data Labels"
            value={showLabels}
            onChange={setShowLabels}
          />
          {showLabels && (
            <>
              <InputSegment<"top" | "bottom" | "left" | "right">
                value={labelPosition}
                label="Label Position"
                values={["top", "bottom", "left", "right"]}
                onChange={setLabelPosition}
              />
              <InputColor
                label="Label color"
                color={labelColor as string}
                onChange={setLabelColor}
              />
            </>
          )}
        </ChartSection>

        <ChartSection
          title="Positive Leaderboard"
          description="A simple positive-only chart with value labels outside the bar ends."
        >
          <View style={styles.mediumChart}>
            <HorizontalBarExample
              data={LEADERBOARD_DATA}
              font={font}
              axisLabelColor={axisLabelColor}
              domain={[0, 100]}
              barWidth={30}
              roundedCorner={10}
              labelColor={labelColor}
              labelPosition="right"
              showLabels
              colors={["#22c55e", "#16a34a70"]}
            />
          </View>
        </ChartSection>

        <ChartSection
          title="Diverging Values"
          description="Negative values extend left from zero, positive values extend right."
        >
          <View style={styles.mediumChart}>
            <HorizontalBarExample
              data={DIVERGING_DATA}
              font={font}
              axisLabelColor={axisLabelColor}
              domain={[-60, 60]}
              barWidth={24}
              roundedCorner={8}
              labelColor={labelColor}
              labelPosition="right"
              showLabels
              colors={["#f97316", "#0ea5e950"]}
            />
          </View>
        </ChartSection>

        <ChartSection
          title="Long Category Labels"
          description="The category axis reserves left-side label space before laying out the numeric value axis."
        >
          <View style={styles.mediumChart}>
            <HorizontalBarExample
              data={LONG_LABEL_DATA}
              font={font}
              axisLabelColor={axisLabelColor}
              domain={[0, 150]}
              barWidth={28}
              roundedCorner={6}
              labelColor={labelColor}
              labelPosition="right"
              showLabels
              colors={["#8b5cf6", "#06b6d450"]}
            />
          </View>
        </ChartSection>

        <ChartSection
          title="Compact Many Rows"
          description="A dense monthly chart with fixed bar thickness and no data labels."
        >
          <View style={styles.tallChart}>
            <HorizontalBarExample
              data={COMPACT_DATA}
              font={font}
              axisLabelColor={axisLabelColor}
              domain={[0, 100]}
              barWidth={14}
              roundedCorner={4}
              labelColor={labelColor}
              labelPosition="right"
              showLabels={false}
              colors={["#06b6d4", "#2563eb50"]}
            />
          </View>
        </ChartSection>

        <ChartSection
          title="Screen-Relative Label Positions"
          description="Labels use the same top, bottom, left, and right position names as vertical bars."
        >
          <View style={styles.labelGrid}>
            {(["top", "bottom", "left", "right"] as const).map((position) => (
              <View key={position} style={styles.labelChart}>
                <Text style={styles.labelChartTitle}>{position}</Text>
                <View style={styles.labelChartBody}>
                  <HorizontalBarExample
                    data={LABEL_POSITION_DATA.slice(0, 1)}
                    font={font}
                    axisLabelColor={axisLabelColor}
                    domain={[0, 100]}
                    domainPadding={{
                      left: 36,
                      right: 36,
                      top: 34,
                      bottom: 34,
                    }}
                    barWidth={18}
                    roundedCorner={6}
                    labelColor={labelColor}
                    labelPosition={position}
                    showLabels
                    colors={["#0891b2", "#a7f3d050"]}
                    hideXAxis
                    hideYAxis
                  />
                </View>
              </View>
            ))}
          </View>
        </ChartSection>
      </ScrollView>
    </SafeAreaView>
  );
}

function ChartSection({
  title,
  description,
  children,
}: React.PropsWithChildren<{ title: string; description: string }>) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text selectable style={styles.sectionTitle}>
          {title}
        </Text>
        <Text selectable style={styles.sectionDescription}>
          {description}
        </Text>
      </View>
      {children}
    </View>
  );
}

function HorizontalBarExample({
  data,
  font,
  axisLabelColor,
  domain,
  barWidth,
  roundedCorner,
  labelColor,
  labelPosition,
  showLabels,
  colors,
  domainPadding = { top: 28, bottom: 28, right: 18 },
  hideXAxis,
  hideYAxis,
}: {
  data: HorizontalDatum[];
  font: SkFont | null;
  axisLabelColor: string;
  domain: [number, number];
  barWidth: number;
  roundedCorner: number;
  labelColor: Color;
  labelPosition: "top" | "bottom" | "left" | "right";
  showLabels: boolean;
  colors: [Color, Color];
  domainPadding?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  hideXAxis?: boolean;
  hideYAxis?: boolean;
}) {
  return (
    <CartesianChart
      orientation="horizontal"
      xKey="category"
      yKeys={["value"]}
      padding={5}
      domain={{ x: domain }}
      domainPadding={domainPadding}
      xAxis={{
        font,
        tickCount: hideXAxis ? 0 : 5,
        labelColor: axisLabelColor,
        linePathEffect: <DashPathEffect intervals={[4, 4]} />,
        formatXLabel: (value) => `${value}`,
      }}
      yAxis={[
        {
          yKeys: ["value"],
          font,
          tickCount: hideYAxis ? 0 : data.length,
          labelColor: axisLabelColor,
          lineWidth: 0,
          formatYLabel: (value) => String(value),
        },
      ]}
      frame={{ lineWidth: 0 }}
      data={data}
    >
      {({ points, chartBounds }) => (
        <HorizontalBar
          points={points.value}
          chartBounds={chartBounds}
          animate={{ type: "spring" }}
          barWidth={barWidth}
          roundedCorners={{
            topRight: roundedCorner,
            bottomRight: roundedCorner,
          }}
          labels={
            showLabels
              ? { font, color: labelColor, position: labelPosition }
              : undefined
          }
        >
          <LinearGradient start={vec(0, 0)} end={vec(420, 0)} colors={colors} />
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
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 24,
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 19,
    opacity: 0.72,
  },
  largeChart: {
    height: 430,
  },
  mediumChart: {
    height: 320,
  },
  tallChart: {
    height: 470,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowButton: {
    flex: 1,
  },
  labelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  labelChart: {
    width: "48%",
    gap: 6,
  },
  labelChartBody: {
    height: 112,
  },
  labelChartTitle: {
    fontSize: 13,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});
