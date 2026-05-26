import {
  DashPathEffect,
  LinearGradient,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { CartesianChart, HorizontalBarGroup } from "victory-native";
import { useDarkMode } from "react-native-dark";
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

  const axisLabelColor = isDark ? appColors.text.dark : appColors.text.light;

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <InfoCard>{description}</InfoCard>
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
          >
            {({ points, chartBounds }) => (
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
            )}
          </CartesianChart>
        </View>

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
      </ScrollView>
    </SafeAreaView>
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
    gap: 18,
  },
  chart: {
    height: 420,
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
});
