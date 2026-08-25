import {
  DashPathEffect,
  LinearGradient,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CartesianChart,
  HorizontalStackedBar,
  useChartPressState,
} from "victory-native";
import { useDarkMode } from "react-native-dark";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";
import { Button } from "../components/Button";
import { InfoCard } from "../components/InfoCard";
import { InputSlider } from "../components/InputSlider";
import { Text } from "../components/Text";
import { descriptionForRoute } from "../consts/routes";

type ChannelDatum = {
  category: string;
  product: number;
  services: number;
  support: number;
};

type OptionalChannelDatum = {
  category: string;
  product?: number;
  services?: number;
  support?: number;
};

const SERIES_COLORS = ["#14b8a6", "#6366f1", "#f97316"];
const SERIES_LABELS = ["Product", "Services", "Support"];

const BASE_DATA: ChannelDatum[] = [
  { category: "North", product: 72, services: 44, support: 28 },
  { category: "West", product: 58, services: 62, support: 34 },
  { category: "South", product: 41, services: 38, support: 46 },
  { category: "East", product: 67, services: 52, support: 31 },
];

const MIXED_DATA: ChannelDatum[] = [
  { category: "Plan", product: 58, services: -22, support: 34 },
  { category: "Build", product: 74, services: 42, support: -18 },
  { category: "Ship", product: 45, services: 63, support: 28 },
  { category: "Support", product: -16, services: 36, support: 52 },
];

const TOUCHABLE_DATA: ChannelDatum[] = [
  { category: "Alpha", product: 48, services: 36, support: 24 },
  { category: "Beta", product: 34, services: -22, support: 38 },
  { category: "Gamma", product: 52, services: 28, support: -16 },
  { category: "Delta", product: -18, services: 44, support: 26 },
];

const CUSTOM_CHILDREN_DATA: ChannelDatum[] = [
  { category: "Core", product: 62, services: 34, support: 20 },
  { category: "Cloud", product: 48, services: 54, support: 28 },
  { category: "Edge", product: 32, services: 26, support: 42 },
];

const NON_UNIFORM_DATA: OptionalChannelDatum[] = [
  { category: "Full", product: 42, services: 36, support: 20 },
  { category: "No product", services: 48, support: 26 },
  { category: "Support only", support: 54 },
  { category: "Zero support", product: 38, services: 22, support: 0 },
  { category: "Mixed", product: 34, services: -18, support: 24 },
];

export default function HorizontalStackedBarPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const [data, setData] = React.useState(MIXED_DATA);
  const [innerPadding, setInnerPadding] = React.useState(0.4);
  const [roundedCorner, setRoundedCorner] = React.useState(8);

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
          title="Interactive Mixed Stacks"
          description="Positive and negative segments accumulate from the same zero baseline."
        >
          <View style={styles.largeChart}>
            <HorizontalStackedChart
              data={data}
              font={font}
              axisLabelColor={axisLabelColor}
              innerPadding={innerPadding}
              roundedCorner={roundedCorner}
              domain={[-50, 170]}
            />
          </View>

          <Legend />

          <View style={styles.row}>
            <Button
              accessibilityLabel="Shuffle horizontal stacked bar data"
              style={styles.rowButton}
              onPress={() => setData((current) => shuffleData(current))}
              title="Shuffle Data"
            />
            <Button
              accessibilityLabel="Toggle mixed horizontal stacked bar values"
              style={styles.rowButton}
              onPress={() =>
                setData((current) =>
                  current === MIXED_DATA ? BASE_DATA : MIXED_DATA,
                )
              }
              title="Toggle Mixed"
            />
          </View>

          <InputSlider
            label="Inner Padding"
            maxValue={0.8}
            minValue={0}
            step={0.05}
            value={innerPadding}
            onChange={setInnerPadding}
          />
          <InputSlider
            label="Value-End Corner Radius"
            maxValue={18}
            minValue={0}
            step={1}
            value={roundedCorner}
            onChange={setRoundedCorner}
          />
        </ChartSection>

        <ChartSection
          title="Touchable Segments"
          description="Press a segment to verify horizontal stacked segment lookup and selection styling."
        >
          <View style={styles.mediumChart}>
            <TouchableSegmentsChart
              font={font}
              axisLabelColor={axisLabelColor}
            />
          </View>
        </ChartSection>

        <ChartSection
          title="Custom Segment Children"
          description="Segments can provide Skia children such as gradients through barOptions."
        >
          <View style={styles.mediumChart}>
            <CustomChildrenChart font={font} axisLabelColor={axisLabelColor} />
          </View>
        </ChartSection>

        <ChartSection
          title="Missing And Zero Segments"
          description="Missing values are skipped, zero values stay zero-width, and outer corners remain on visible stack ends."
        >
          <View style={styles.tallChart}>
            <NonUniformChart font={font} axisLabelColor={axisLabelColor} />
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

function HorizontalStackedChart({
  data,
  font,
  axisLabelColor,
  innerPadding,
  roundedCorner,
  domain,
}: {
  data: ChannelDatum[];
  font: ReturnType<typeof useFont>;
  axisLabelColor: string;
  innerPadding: number;
  roundedCorner: number;
  domain: [number, number];
}) {
  return (
    <CartesianChart
      orientation="horizontal"
      data={data}
      xKey="category"
      yKeys={["product", "services", "support"]}
      domain={{ x: domain }}
      domainPadding={{ top: 36, bottom: 36, left: 18, right: 24 }}
      padding={5}
      xAxis={{
        font,
        tickCount: 6,
        labelColor: axisLabelColor,
        linePathEffect: <DashPathEffect intervals={[4, 4]} />,
        formatXLabel: (value) => `${value}`,
      }}
      yAxis={[
        {
          yKeys: ["product", "services", "support"],
          font,
          tickCount: data.length,
          labelColor: axisLabelColor,
          lineWidth: 0,
          formatYLabel: (value) => String(value),
        },
      ]}
      frame={{ lineWidth: 0 }}
    >
      {({ points, chartBounds }) => (
        <HorizontalStackedBar
          animate={{ type: "spring" }}
          chartBounds={chartBounds}
          innerPadding={innerPadding}
          points={[points.product, points.services, points.support]}
          colors={SERIES_COLORS}
          barOptions={({ isEnd }) => ({
            roundedCorners: isEnd
              ? {
                  topRight: roundedCorner,
                  bottomRight: roundedCorner,
                }
              : undefined,
          })}
        />
      )}
    </CartesianChart>
  );
}

function TouchableSegmentsChart({
  font,
  axisLabelColor,
}: {
  font: ReturnType<typeof useFont>;
  axisLabelColor: string;
}) {
  const { state, isActive } = useChartPressState({
    x: "Alpha",
    y: { product: 0, services: 0, support: 0 },
  });
  const selectedDatumIndex = state.matchedIndex.value;
  const selectedSeriesIndex = state.yIndex.value;
  const [tooltipText, setTooltipText] = React.useState(
    "Press a segment to inspect the stack.",
  );

  useAnimatedReaction(
    () => ({
      active: state.isActive.value,
      category: state.x.value.value,
      seriesIndex: state.yIndex.value,
      product: state.y.product.value.value,
      services: state.y.services.value.value,
      support: state.y.support.value.value,
    }),
    (next) => {
      if (!next.active) {
        return;
      }

      if (next.seriesIndex < 0) {
        runOnJS(setTooltipText)("No segment at this position.");
        return;
      }

      const values = [next.product, next.services, next.support];
      const label = SERIES_LABELS[next.seriesIndex] ?? "Segment";
      const value = values[next.seriesIndex] ?? 0;

      runOnJS(setTooltipText)(`${String(next.category)}: ${label} ${value}`);
    },
  );

  return (
    <View style={styles.chartWithTooltip}>
      <View style={styles.chartFill}>
        <CartesianChart
          orientation="horizontal"
          chartPressState={state}
          chartPressConfig={{ pan: { activateAfterLongPress: 0 } }}
          data={TOUCHABLE_DATA}
          xKey="category"
          yKeys={["product", "services", "support"]}
          domain={{ x: [-50, 140] }}
          domainPadding={{ top: 34, bottom: 34, left: 18, right: 24 }}
          padding={5}
          xAxis={{
            font,
            tickCount: 5,
            labelColor: axisLabelColor,
            linePathEffect: <DashPathEffect intervals={[4, 4]} />,
            formatXLabel: (value) => `${value}`,
          }}
          yAxis={[
            {
              yKeys: ["product", "services", "support"],
              font,
              tickCount: TOUCHABLE_DATA.length,
              labelColor: axisLabelColor,
              lineWidth: 0,
              formatYLabel: (value) => String(value),
            },
          ]}
          frame={{ lineWidth: 0 }}
        >
          {({ points, chartBounds }) => (
            <HorizontalStackedBar
              chartBounds={chartBounds}
              points={[points.product, points.services, points.support]}
              colors={SERIES_COLORS}
              barOptions={({ datumIndex, isEnd, seriesIndex }) => {
                const isSelected =
                  isActive &&
                  selectedDatumIndex === datumIndex &&
                  selectedSeriesIndex === seriesIndex;

                return {
                  color: isSelected ? "#ec4899" : undefined,
                  opacity: isActive && !isSelected ? 0.45 : 1,
                  roundedCorners: isEnd
                    ? {
                        topRight: 8,
                        bottomRight: 8,
                      }
                    : undefined,
                };
              }}
            />
          )}
        </CartesianChart>
      </View>
      <Text style={styles.tooltipText}>{tooltipText}</Text>
    </View>
  );
}

function CustomChildrenChart({
  font,
  axisLabelColor,
}: {
  font: ReturnType<typeof useFont>;
  axisLabelColor: string;
}) {
  return (
    <CartesianChart
      orientation="horizontal"
      data={CUSTOM_CHILDREN_DATA}
      xKey="category"
      yKeys={["product", "services", "support"]}
      domain={{ x: [0, 150] }}
      domainPadding={{ top: 38, bottom: 38, left: 16, right: 24 }}
      padding={5}
      xAxis={{
        font,
        tickCount: 5,
        labelColor: axisLabelColor,
        linePathEffect: <DashPathEffect intervals={[4, 4]} />,
        formatXLabel: (value) => `${value}`,
      }}
      yAxis={[
        {
          yKeys: ["product", "services", "support"],
          font,
          tickCount: CUSTOM_CHILDREN_DATA.length,
          labelColor: axisLabelColor,
          lineWidth: 0,
          formatYLabel: (value) => String(value),
        },
      ]}
      frame={{ lineWidth: 0 }}
    >
      {({ points, chartBounds }) => (
        <HorizontalStackedBar
          chartBounds={chartBounds}
          innerPadding={0.42}
          points={[points.product, points.services, points.support]}
          colors={SERIES_COLORS}
          barOptions={({ datumIndex, isEnd, seriesIndex }) => ({
            roundedCorners: isEnd
              ? {
                  topRight: 8,
                  bottomRight: 8,
                }
              : undefined,
            children:
              seriesIndex === 1 ? (
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(260, 0)}
                  colors={["#818cf8", "#312e81"]}
                />
              ) : seriesIndex === 2 && datumIndex === 2 ? (
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(180, 0)}
                  colors={["#facc15", "#ea580c"]}
                />
              ) : undefined,
          })}
        />
      )}
    </CartesianChart>
  );
}

function NonUniformChart({
  font,
  axisLabelColor,
}: {
  font: ReturnType<typeof useFont>;
  axisLabelColor: string;
}) {
  return (
    <CartesianChart
      orientation="horizontal"
      data={NON_UNIFORM_DATA}
      xKey="category"
      yKeys={["product", "services", "support"]}
      domain={{ x: [-40, 120] }}
      domainPadding={{ top: 34, bottom: 34, left: 18, right: 24 }}
      padding={5}
      xAxis={{
        font,
        tickCount: 5,
        labelColor: axisLabelColor,
        linePathEffect: <DashPathEffect intervals={[4, 4]} />,
        formatXLabel: (value) => `${value}`,
      }}
      yAxis={[
        {
          yKeys: ["product", "services", "support"],
          font,
          tickCount: NON_UNIFORM_DATA.length,
          labelColor: axisLabelColor,
          lineWidth: 0,
          formatYLabel: (value) => String(value),
        },
      ]}
      frame={{ lineWidth: 0 }}
    >
      {({ points, chartBounds }) => (
        <HorizontalStackedBar
          chartBounds={chartBounds}
          barWidth={26}
          points={[points.product, points.services, points.support]}
          colors={SERIES_COLORS}
          barOptions={({ isLeft, isRight }) => ({
            roundedCorners: {
              topLeft: isLeft ? 7 : 0,
              bottomLeft: isLeft ? 7 : 0,
              topRight: isRight ? 7 : 0,
              bottomRight: isRight ? 7 : 0,
            },
          })}
        />
      )}
    </CartesianChart>
  );
}

function Legend() {
  return (
    <View style={styles.legend}>
      <LegendItem color={SERIES_COLORS[0]!} label="Product" />
      <LegendItem color={SERIES_COLORS[1]!} label="Services" />
      <LegendItem color={SERIES_COLORS[2]!} label="Support" />
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.swatch, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function shuffleData(data: ChannelDatum[]) {
  return data.map((datum) => ({
    ...datum,
    product: jitter(datum.product),
    services: jitter(datum.services),
    support: jitter(datum.support),
  }));
}

function jitter(value: number) {
  const direction = value < 0 ? -1 : 1;
  return (
    direction *
    Math.max(8, Math.round(Math.abs(value) * (0.7 + Math.random() * 0.6)))
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
    height: 360,
  },
  mediumChart: {
    height: 310,
  },
  chartWithTooltip: {
    flex: 1,
    gap: 8,
  },
  chartFill: {
    flex: 1,
  },
  tooltipText: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.8,
  },
  tallChart: {
    height: 390,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 13,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowButton: {
    flex: 1,
  },
});
