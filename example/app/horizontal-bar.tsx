import {
  DashPathEffect,
  LinearGradient,
  useFont,
  vec,
  type Color,
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
import { descriptionForRoute } from "../consts/routes";

const CATEGORIES = ["Audio", "Books", "Events", "Merch", "Video", "Web"];
const VALUES = [46, 68, -28, 12, -18, 75];

const DATA = (length: number = 6) =>
  CATEGORIES.slice(0, length).map((category, index) => ({
    category,
    revenue: VALUES[index] ?? 0,
  }));

export default function HorizontalBarPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const [data, setData] = useState(DATA());
  const [barWidth, setBarWidth] = useState(26);
  const [roundedCorner, setRoundedCorner] = useState(8);
  const [showLabels, setShowLabels] = useState(true);
  const [labelColor, setLabelColor] = useState<Color>("#262626");
  const [labelPosition, setLabelPosition] = useState<
    "top" | "bottom" | "left" | "right"
  >("right");

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.chart}>
        <CartesianChart
          orientation="horizontal"
          xKey="category"
          yKeys={["revenue"]}
          padding={5}
          domain={{ x: [-80, 160] }}
          domainPadding={{ top: 30, bottom: 30, right: 16 }}
          xAxis={{
            font,
            tickCount: 5,
            labelColor: isDark ? appColors.text.dark : appColors.text.light,
            linePathEffect: <DashPathEffect intervals={[4, 4]} />,
            formatXLabel: (value) => `${value}`,
          }}
          yAxis={[
            {
              yKeys: ["revenue"],
              font,
              tickCount: data.length,
              labelColor: isDark ? appColors.text.dark : appColors.text.light,
              lineWidth: 0,
              formatYLabel: (value) => String(value),
            },
          ]}
          frame={{ lineWidth: 0 }}
          data={data}
        >
          {({ points, chartBounds }) => (
            <HorizontalBar
              points={points.revenue}
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
              <LinearGradient
                start={vec(0, 0)}
                end={vec(400, 0)}
                colors={["#14b8a6", "#6366f150"]}
              />
            </HorizontalBar>
          )}
        </CartesianChart>
      </View>
      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <InfoCard style={{ marginBottom: 16 }}>{description}</InfoCard>
        <View style={styles.row}>
          <Button
            style={{ flex: 1 }}
            onPress={() => setData(DATA(data.length).reverse())}
            title="Reverse Data"
          />
          <Button
            style={{ flex: 1 }}
            onPress={() => setData(DATA(data.length))}
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
    flex: 1.5,
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
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    marginBottom: 16,
  },
});
