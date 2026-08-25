import {
  DashPathEffect,
  Line,
  LinearGradient,
  Rect,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CartesianChart,
  HorizontalBarGroup,
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

type MonthlyRangeDatum = {
  month: string;
  low: number;
  high: number;
};

type PlannedActualDatum = {
  category: string;
  planned: number;
  actual: number;
};

type DenseGroupDatum = {
  channel: string;
  direct: number;
  partner: number;
  renewal: number;
};

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

const TOOLTIP_DATA: MonthlyRangeDatum[] = [
  { month: "Jan", low: 25, high: 41 },
  { month: "Feb", low: 31, high: 42 },
  { month: "Mar", low: 35, high: 40 },
  { month: "Apr", low: 35, high: 39 },
  { month: "May", low: 24, high: 39 },
  { month: "Jun", low: 25, high: 34 },
];

const PLANNED_ACTUAL_DATA: PlannedActualDatum[] = [
  { category: "Core", planned: 88, actual: 76 },
  { category: "Cloud", planned: 64, actual: 81 },
  { category: "Edge", planned: 52, actual: 47 },
  { category: "Data", planned: 72, actual: 69 },
];

const DENSE_DATA: DenseGroupDatum[] = [
  { channel: "Search", direct: 82, partner: 44, renewal: 28 },
  { channel: "Social", direct: 68, partner: 52, renewal: 34 },
  { channel: "Email", direct: 54, partner: 39, renewal: 42 },
  { channel: "Events", direct: 47, partner: 61, renewal: 24 },
  { channel: "Sales", direct: 74, partner: 58, renewal: 36 },
  { channel: "Support", direct: 39, partner: 46, renewal: 53 },
  { channel: "Partner", direct: 45, partner: 72, renewal: 31 },
  { channel: "Retail", direct: 63, partner: 41, renewal: 37 },
];

export default function HorizontalBarGroupPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const [data, setData] = React.useState(BASE_DATA);
  const [betweenGroupPadding, setBetweenGroupPadding] = React.useState(0.35);
  const [withinGroupPadding, setWithinGroupPadding] = React.useState(0.2);
  const [roundedCorner, setRoundedCorner] = React.useState(6);
  const [barSize, setBarSize] = React.useState({
    barWidth: 0,
    groupWidth: 0,
    gapWidth: 0,
  });
  const [tooltipText, setTooltipText] = React.useState(
    "Press a row to inspect grouped values.",
  );
  const press = useChartPressState({
    x: "North",
    y: { product: 0, services: 0, support: 0 },
  });

  const axisLabelColor = isDark ? appColors.text.dark : appColors.text.light;

  useAnimatedReaction(
    () => ({
      active: press.state.isActive.value,
      category: press.state.x.value.value,
      product: press.state.y.product.value.value,
      services: press.state.y.services.value.value,
      support: press.state.y.support.value.value,
    }),
    (next) => {
      if (!next.active) return;

      runOnJS(setTooltipText)(
        `${String(next.category)}: Product ${next.product}, Services ${
          next.services
        }, Support ${next.support}`,
      );
    },
  );

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <InfoCard>{description}</InfoCard>
        <ChartSection
          title="Interactive Mixed Groups"
          description="Grouped horizontal bars with mixed positive and negative values."
        >
          <View style={styles.chart}>
            <CartesianChart
              orientation="horizontal"
              data={data}
              xKey="category"
              yKeys={["product", "services", "support"]}
              domain={{ x: [-40, 100] }}
              domainPadding={{ top: 38, bottom: 38, left: 16, right: 20 }}
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
              chartPressState={press.state}
              chartPressConfig={{ pan: { activateAfterLongPress: 0 } }}
            >
              {({ points, chartBounds }) => (
                <>
                  {press.isActive && (
                    <Rect
                      x={chartBounds.left}
                      y={
                        press.state.x.position.value -
                        barSize.groupWidth / 2 -
                        6
                      }
                      width={chartBounds.right - chartBounds.left}
                      height={barSize.groupWidth + 12}
                      color="#111827"
                      opacity={0.08}
                    />
                  )}
                  <HorizontalBarGroup
                    chartBounds={chartBounds}
                    betweenGroupPadding={betweenGroupPadding}
                    withinGroupPadding={withinGroupPadding}
                    roundedCorners={{
                      topRight: roundedCorner,
                      bottomRight: roundedCorner,
                    }}
                    onBarSizeChange={setBarSize}
                  >
                    <HorizontalBarGroup.Bar
                      points={points.product}
                      animate={{ type: "timing" }}
                    >
                      <LinearGradient
                        start={vec(0, 0)}
                        end={vec(420, 0)}
                        colors={["#14b8a6", "#0f766e80"]}
                      />
                    </HorizontalBarGroup.Bar>
                    <HorizontalBarGroup.Bar
                      points={points.services}
                      animate={{ type: "timing" }}
                    >
                      <LinearGradient
                        start={vec(0, 0)}
                        end={vec(420, 0)}
                        colors={["#6366f1", "#4338ca80"]}
                      />
                    </HorizontalBarGroup.Bar>
                    <HorizontalBarGroup.Bar
                      points={points.support}
                      animate={{ type: "timing" }}
                    >
                      <LinearGradient
                        start={vec(0, 0)}
                        end={vec(420, 0)}
                        colors={["#f97316", "#c2410c80"]}
                      />
                    </HorizontalBarGroup.Bar>
                  </HorizontalBarGroup>
                </>
              )}
            </CartesianChart>
          </View>

          <Text style={styles.tooltipText}>{tooltipText}</Text>

          <View style={styles.legend}>
            <LegendItem color="#14b8a6" label="Product" />
            <LegendItem color="#6366f1" label="Services" />
            <LegendItem color="#f97316" label="Support" />
          </View>

          <View style={styles.row}>
            <Button
              accessibilityLabel="Shuffle horizontal grouped bar data"
              style={styles.rowButton}
              onPress={() => setData((current) => shuffleData(current))}
              title="Shuffle Data"
            />
            <Button
              accessibilityLabel="Toggle mixed horizontal grouped bar values"
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
            label="Between Group Padding"
            maxValue={0.8}
            minValue={0}
            step={0.05}
            value={betweenGroupPadding}
            onChange={setBetweenGroupPadding}
          />
          <InputSlider
            label="Within Group Padding"
            maxValue={0.8}
            minValue={0}
            step={0.05}
            value={withinGroupPadding}
            onChange={setWithinGroupPadding}
          />
          <InputSlider
            label="Value-End Corner Radius"
            maxValue={16}
            minValue={0}
            step={1}
            value={roundedCorner}
            onChange={setRoundedCorner}
          />
          <Text style={styles.sizeText}>
            Bar {barSize.barWidth.toFixed(1)} / Group{" "}
            {barSize.groupWidth.toFixed(1)} / Gap {barSize.gapWidth.toFixed(1)}
          </Text>
        </ChartSection>

        <ChartSection
          title="Tooltip Pair"
          description="A horizontal version of the grouped bar tooltip example."
        >
          <View style={styles.mediumChart}>
            <TooltipPairChart font={font} axisLabelColor={axisLabelColor} />
          </View>
        </ChartSection>

        <ChartSection
          title="Compact Pair"
          description="Two grouped series with fixed bar thickness and plain colors."
        >
          <View style={styles.compactChart}>
            <CompactPairChart font={font} axisLabelColor={axisLabelColor} />
          </View>
        </ChartSection>

        <ChartSection
          title="Dense Fixed-Width Groups"
          description="Many categories with three narrow bars per group."
        >
          <View style={styles.denseChart}>
            <DenseFixedWidthChart font={font} axisLabelColor={axisLabelColor} />
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
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionDescription}>{description}</Text>
      </View>
      {children}
    </View>
  );
}

function TooltipPairChart({
  font,
  axisLabelColor,
}: {
  font: ReturnType<typeof useFont>;
  axisLabelColor: string;
}) {
  const [barSize, setBarSize] = React.useState({
    barWidth: 0,
    groupWidth: 0,
    gapWidth: 0,
  });
  const [tooltipText, setTooltipText] = React.useState(
    "Press a month to inspect low and high values.",
  );
  const { state, isActive } = useChartPressState({
    x: "Jan",
    y: { low: 0, high: 0 },
  });

  useAnimatedReaction(
    () => ({
      active: state.isActive.value,
      month: state.x.value.value,
      low: state.y.low.value.value,
      high: state.y.high.value.value,
    }),
    (next) => {
      if (!next.active) return;
      runOnJS(setTooltipText)(
        `${String(next.month)}: Low ${next.low}, High ${next.high}`,
      );
    },
  );

  return (
    <View style={styles.chartWithReadout}>
      <View style={styles.chartFill}>
        <CartesianChart
          orientation="horizontal"
          data={TOOLTIP_DATA}
          xKey="month"
          yKeys={["low", "high"]}
          domain={{ x: [0, 50] }}
          domainPadding={{ top: 30, bottom: 30, left: 14, right: 24 }}
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
              yKeys: ["low", "high"],
              font,
              tickCount: TOOLTIP_DATA.length,
              labelColor: axisLabelColor,
              lineWidth: 0,
              formatYLabel: (value) => String(value),
            },
          ]}
          frame={{ lineWidth: 0 }}
          chartPressState={state}
          chartPressConfig={{ pan: { activateAfterLongPress: 0 } }}
        >
          {({ points, chartBounds }) => (
            <>
              {isActive && (
                <>
                  <Rect
                    x={chartBounds.left}
                    y={state.x.position.value - barSize.groupWidth / 2 - 6}
                    width={chartBounds.right - chartBounds.left}
                    height={barSize.groupWidth + 12}
                    color="#111827"
                    opacity={0.08}
                  />
                  <Line
                    p1={vec(state.y.low.position.value, chartBounds.top)}
                    p2={vec(state.y.low.position.value, chartBounds.bottom)}
                    color="#3b82f6"
                    strokeWidth={StyleSheet.hairlineWidth}
                  >
                    <DashPathEffect intervals={[6, 4]} />
                  </Line>
                  <Line
                    p1={vec(state.y.high.position.value, chartBounds.top)}
                    p2={vec(state.y.high.position.value, chartBounds.bottom)}
                    color="#ef4444"
                    strokeWidth={StyleSheet.hairlineWidth}
                  >
                    <DashPathEffect intervals={[6, 4]} />
                  </Line>
                </>
              )}
              <HorizontalBarGroup
                chartBounds={chartBounds}
                betweenGroupPadding={0.4}
                withinGroupPadding={0.1}
                roundedCorners={{ topRight: 4, bottomRight: 4 }}
                onBarSizeChange={setBarSize}
              >
                <HorizontalBarGroup.Bar
                  points={points.low}
                  animate={{ type: "timing" }}
                >
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(360, 0)}
                    colors={["#93c5fd", "rgba(37,99,235,0.56)"]}
                  />
                </HorizontalBarGroup.Bar>
                <HorizontalBarGroup.Bar
                  points={points.high}
                  animate={{ type: "timing" }}
                >
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(360, 0)}
                    colors={["#fca5a5", "rgba(239,68,68,0.56)"]}
                  />
                </HorizontalBarGroup.Bar>
              </HorizontalBarGroup>
            </>
          )}
        </CartesianChart>
      </View>
      <Text style={styles.tooltipText}>{tooltipText}</Text>
      <View style={styles.legend}>
        <LegendItem color="#93c5fd" label="Low" />
        <LegendItem color="#fca5a5" label="High" />
      </View>
    </View>
  );
}

function CompactPairChart({
  font,
  axisLabelColor,
}: {
  font: ReturnType<typeof useFont>;
  axisLabelColor: string;
}) {
  return (
    <CartesianChart
      orientation="horizontal"
      data={PLANNED_ACTUAL_DATA}
      xKey="category"
      yKeys={["planned", "actual"]}
      domain={{ x: [0, 100] }}
      domainPadding={{ top: 30, bottom: 30, left: 12, right: 18 }}
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
          yKeys: ["planned", "actual"],
          font,
          tickCount: PLANNED_ACTUAL_DATA.length,
          labelColor: axisLabelColor,
          lineWidth: 0,
          formatYLabel: (value) => String(value),
        },
      ]}
      frame={{ lineWidth: 0 }}
    >
      {({ points, chartBounds }) => (
        <HorizontalBarGroup
          chartBounds={chartBounds}
          betweenGroupPadding={0.48}
          withinGroupPadding={0.18}
          roundedCorners={{ topRight: 5, bottomRight: 5 }}
          barWidth={12}
        >
          <HorizontalBarGroup.Bar points={points.planned} color="#0ea5e9" />
          <HorizontalBarGroup.Bar points={points.actual} color="#22c55e" />
        </HorizontalBarGroup>
      )}
    </CartesianChart>
  );
}

function DenseFixedWidthChart({
  font,
  axisLabelColor,
}: {
  font: ReturnType<typeof useFont>;
  axisLabelColor: string;
}) {
  return (
    <CartesianChart
      orientation="horizontal"
      data={DENSE_DATA}
      xKey="channel"
      yKeys={["direct", "partner", "renewal"]}
      domain={{ x: [0, 100] }}
      domainPadding={{ top: 28, bottom: 28, left: 12, right: 18 }}
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
          yKeys: ["direct", "partner", "renewal"],
          font,
          tickCount: DENSE_DATA.length,
          labelColor: axisLabelColor,
          lineWidth: 0,
          formatYLabel: (value) => String(value),
        },
      ]}
      frame={{ lineWidth: 0 }}
    >
      {({ points, chartBounds }) => (
        <HorizontalBarGroup
          chartBounds={chartBounds}
          betweenGroupPadding={0.42}
          withinGroupPadding={0.15}
          roundedCorners={{ topRight: 3, bottomRight: 3 }}
          barWidth={7}
        >
          <HorizontalBarGroup.Bar points={points.direct} color="#14b8a6" />
          <HorizontalBarGroup.Bar points={points.partner} color="#6366f1" />
          <HorizontalBarGroup.Bar points={points.renewal} color="#f97316" />
        </HorizontalBarGroup>
      )}
    </CartesianChart>
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
    product: offsetValue(datum.product, 14),
    services: offsetValue(datum.services, 12),
    support: offsetValue(datum.support, 10),
  }));
}

function offsetValue(value: number, amount: number) {
  const offset = Math.round((Math.random() - 0.5) * amount * 2);
  return Math.max(-40, Math.min(100, value + offset));
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
    gap: 12,
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
  chart: {
    height: 420,
  },
  mediumChart: {
    height: 360,
  },
  compactChart: {
    height: 280,
  },
  denseChart: {
    height: 440,
  },
  chartWithReadout: {
    flex: 1,
    gap: 8,
  },
  chartFill: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowButton: {
    flex: 1,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 13,
  },
  sizeText: {
    fontSize: 13,
    opacity: 0.7,
  },
  tooltipText: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.8,
  },
});
