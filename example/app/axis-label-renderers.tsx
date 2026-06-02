import {
  DashPathEffect,
  Group,
  LinearGradient,
  RoundedRect,
  Text as SkiaText,
  useFont,
  vec,
  type SkFont,
} from "@shopify/react-native-skia";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  Bar,
  CartesianChart,
  HorizontalBar,
  Line,
  Scatter,
  createParagraphLabelRenderer,
  type AxisLabelRenderer,
} from "victory-native";
import { InfoCard } from "example/components/InfoCard";
import { Text } from "example/components/Text";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";
import { descriptionForRoute } from "../consts/routes";

type MarketDatum = {
  market: string;
  value: number;
};

type PeriodDatum = {
  period: string;
  latency: number;
};

type BadgeDatum = {
  label: string;
  value: number;
};

const MULTILINGUAL_MARKETS: MarketDatum[] = [
  { market: "東京\nTokyo", value: 78 },
  { market: "القاهرة\nCairo", value: 52 },
  { market: "서울\nSeoul", value: 66 },
  { market: "São Paulo", value: 61 },
  { market: "München", value: 44 },
];

const LOCALIZED_PERIODS: PeriodDatum[] = [
  { period: "Jan\n北米", latency: 42 },
  { period: "Feb\nالقاهرة", latency: 58 },
  { period: "Mar\n서울", latency: 49 },
  { period: "Apr\nMünchen", latency: 63 },
  { period: "May\n東京", latency: 55 },
];

const BADGE_DATA: BadgeDatum[] = [
  { label: "Q1", value: 38 },
  { label: "Launch", value: 64 },
  { label: "Beta", value: 51 },
  { label: "GA", value: 86 },
  { label: "Scale", value: 72 },
];

const paragraphCategoryLabelRenderer = createParagraphLabelRenderer<string>({
  textStyle: { fontSize: 12 },
  maxWidth: 88,
});

const paragraphXAxisLabelRenderer = createParagraphLabelRenderer<string>({
  textStyle: { fontSize: 11 },
  maxWidth: 62,
});

const createBadgeLabelRenderer = (
  font: SkFont | null,
): AxisLabelRenderer<string> => ({
  measure: ({ text }) => ({
    width: Math.max(34, text.length * 7 + 16),
    height: 20,
    fontSize: font?.getSize() ?? 12,
    lineHeight: 20,
  }),
  render: ({ text, x, y, width, height, color }) => (
    <Group>
      <RoundedRect
        x={x}
        y={y}
        width={width}
        height={height}
        r={5}
        color="#ecfeff"
      />
      {font ? (
        <SkiaText text={text} font={font} color={color} x={x + 8} y={y + 14} />
      ) : null}
    </Group>
  ),
});

export default function AxisLabelRenderersPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const badgeLabelRenderer = createBadgeLabelRenderer(font);

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <InfoCard>{description}</InfoCard>

        <ChartSection
          title="Paragraph Multilingual Labels"
          description="Paragraph labels reserve space for mixed scripts and explicit line breaks on a horizontal category axis."
        >
          <View style={styles.horizontalChart}>
            <MultilingualHorizontalChart font={font} />
          </View>
        </ChartSection>

        <ChartSection
          title="Wrapped Paragraph X Labels"
          description="Paragraph labels can constrain width while newline labels keep the numeric axis compact."
        >
          <View style={styles.verticalChart}>
            <ParagraphXAxisChart font={font} />
          </View>
        </ChartSection>

        <ChartSection
          title="Measured Badge Labels"
          description="Custom renderers measure their own label boxes before the chart reserves axis space."
        >
          <View style={styles.verticalChart}>
            <BadgeAxisChart font={font} labelRenderer={badgeLabelRenderer} />
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

function MultilingualHorizontalChart({ font }: { font: SkFont | null }) {
  return (
    <CartesianChart
      orientation="horizontal"
      data={MULTILINGUAL_MARKETS}
      xKey="market"
      yKeys={["value"]}
      padding={{ left: 4, right: 8, top: 8, bottom: 8 }}
      domain={{ x: [0, 100] }}
      domainPadding={{ top: 24, bottom: 24, right: 18 }}
      xAxis={{
        font,
        tickCount: 5,
        labelColor: appColors.text.light,
        formatXLabel: (value) => `${value}`,
        title: {
          text: "Score",
          font,
          color: appColors.text.light,
          offset: 8,
        },
        linePathEffect: <DashPathEffect intervals={[4, 4]} />,
      }}
      yAxis={[
        {
          font,
          tickCount: MULTILINGUAL_MARKETS.length,
          labelColor: appColors.text.light,
          labelRenderer: paragraphCategoryLabelRenderer,
          formatYLabel: (value) => String(value),
          title: {
            text: "Market",
            font,
            color: appColors.text.light,
            offset: 8,
          },
          lineWidth: 0,
        },
      ]}
      frame={{ lineWidth: 0 }}
    >
      {({ points, chartBounds }) => (
        <HorizontalBar
          points={points.value}
          chartBounds={chartBounds}
          barWidth={24}
          roundedCorners={{ topRight: 7, bottomRight: 7 }}
          labels={{
            font,
            color: "#262626",
            position: "right",
            formatLabel: (value) => (value == null ? "" : `${value}%`),
          }}
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(360, 0)}
            colors={["#14b8a6", "#6366f150"]}
          />
        </HorizontalBar>
      )}
    </CartesianChart>
  );
}

function ParagraphXAxisChart({ font }: { font: SkFont | null }) {
  return (
    <CartesianChart
      data={LOCALIZED_PERIODS}
      xKey="period"
      yKeys={["latency"]}
      padding={{ top: 18, bottom: 18 }}
      domainPadding={{ left: 28, right: 28, top: 16 }}
      xAxis={{
        font,
        tickCount: LOCALIZED_PERIODS.length,
        labelColor: appColors.text.light,
        labelOffset: 8,
        labelRenderer: paragraphXAxisLabelRenderer,
        formatXLabel: (value) => String(value),
        title: {
          text: "Localized period",
          font,
          color: appColors.text.light,
          offset: 8,
        },
      }}
      yAxis={[
        {
          font,
          tickCount: 4,
          labelColor: appColors.text.light,
          formatYLabel: (value) => `${Math.round(Number(value))}\nms`,
          title: {
            text: "Latency",
            font,
            color: appColors.text.light,
            offset: 8,
          },
          linePathEffect: <DashPathEffect intervals={[4, 4]} />,
        },
      ]}
    >
      {({ points, chartBounds }) => (
        <Bar
          points={points.latency}
          chartBounds={chartBounds}
          roundedCorners={{ topLeft: 7, topRight: 7 }}
          labels={{
            font,
            color: "#262626",
            position: "top",
            formatLabel: (value) => (value == null ? "" : `${value} ms`),
            rotate: -18,
          }}
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, 260)}
            colors={["#a78bfa", "#22d3ee70"]}
          />
        </Bar>
      )}
    </CartesianChart>
  );
}

function BadgeAxisChart({
  font,
  labelRenderer,
}: {
  font: SkFont | null;
  labelRenderer: AxisLabelRenderer<string>;
}) {
  return (
    <CartesianChart
      data={BADGE_DATA}
      xKey="label"
      yKeys={["value"]}
      padding={{ top: 16, bottom: 16 }}
      domainPadding={{ left: 28, right: 28, top: 16 }}
      xAxis={{
        font,
        tickCount: BADGE_DATA.length,
        labelColor: "#155e75",
        labelOffset: 8,
        labelRenderer,
        title: {
          text: "Release phase",
          font,
          color: appColors.text.light,
          offset: 8,
        },
      }}
      yAxis={[
        {
          font,
          tickCount: 4,
          labelColor: appColors.text.light,
          formatYLabel: (value) => `${value}`,
        },
      ]}
    >
      {({ points }) => (
        <>
          <Line points={points.value} color="#0891b2" strokeWidth={3} />
          <Scatter points={points.value} color="#f97316" radius={5} />
        </>
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
    gap: 20,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    color: appColors.text.light,
    fontSize: 24,
    fontWeight: "700",
    $dark: {
      color: appColors.text.dark,
    },
  },
  sectionDescription: {
    color: "#52525b",
    fontSize: 15,
    lineHeight: 21,
    $dark: {
      color: "#d4d4d8",
    },
  },
  horizontalChart: {
    height: 340,
  },
  verticalChart: {
    height: 320,
  },
});
