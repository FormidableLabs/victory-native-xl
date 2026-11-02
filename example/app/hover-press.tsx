import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { useDarkMode } from "react-native-dark";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";
import {
  Circle,
  DashPathEffect,
  Line as SkiaLine,
  vec,
} from "react-native-skia";
import { InfoCard } from "example/components/InfoCard";
import { AnimatedText } from "../components/AnimatedText";
import { appColors } from "../consts/colors";
import { descriptionForRoute } from "../consts/routes";

const DATA = Array.from({ length: 12 }, (_, i) => ({
  day: i,
  highTmp: Math.round(40 + 30 * Math.random()),
}));

/** Vertical dashed line tracking the pointer while it hovers the chart. */
function HoverCursor({
  xPosition,
  chartBounds,
}: {
  xPosition: SharedValue<number>;
  chartBounds: { top: number; bottom: number };
}) {
  const start = useDerivedValue(() => vec(xPosition.value, chartBounds.top));
  const end = useDerivedValue(() => vec(xPosition.value, chartBounds.bottom));

  return (
    <SkiaLine p1={start} p2={end} color="hotpink" strokeWidth={1}>
      <DashPathEffect intervals={[6, 4]} />
    </SkiaLine>
  );
}

export default function HoverPress(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const isDark = useDarkMode();

  const { state: press, isActive: pressIsActive } = useChartPressState({
    x: 0,
    y: { highTmp: 0 },
  });
  const { state: hover, isActive: hoverIsActive } = useChartPressState({
    x: 0,
    y: { highTmp: 0 },
  });

  const hoverReadout = useDerivedValue(() => {
    if (!hoverIsActive) return "Hover the chart!";
    return `Hover day ${hover.x.value.value} / ${(
      hover.y.highTmp.value.value ?? 0
    ).toFixed(1)}°C`;
  });
  const pressReadout = useDerivedValue(() => {
    if (!pressIsActive) return "Nothing pressed.";
    return `Pressed day ${press.x.value.value} / ${(
      press.y.highTmp.value.value ?? 0
    ).toFixed(1)}°C`;
  });

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12, gap: 4 }}>
        <AnimatedText
          text={hoverReadout}
          defaultValue="Hover the chart!"
          style={[styles.readout, { color: "hotpink" }]}
        />
        <AnimatedText
          text={pressReadout}
          defaultValue="Nothing pressed."
          style={[
            styles.readoutValue,
            { color: isDark ? appColors.text.dark : appColors.text.light },
          ]}
        />
      </View>
      <View style={styles.chart}>
        <CartesianChart
          data={DATA}
          xKey="day"
          yKeys={["highTmp"]}
          chartPressState={press}
          chartHoverState={hover}
          enableHover
          chartHoverConfig={{
            activeCursor: "crosshair",
          }}
          renderOutside={({ chartBounds }) =>
            hoverIsActive ? (
              <HoverCursor
                xPosition={hover.x.position}
                chartBounds={chartBounds}
              />
            ) : null
          }
        >
          {({ points }) => (
            <>
              <Line
                points={points.highTmp}
                color="hotpink"
                strokeWidth={3}
                animate={{ type: "spring" }}
              />
              {pressIsActive && (
                <Circle
                  cx={press.x.position}
                  cy={press.y.highTmp.position}
                  r={9}
                  color="steelblue"
                  style="fill"
                />
              )}
              {hoverIsActive && (
                <Circle
                  cx={hover.x.position}
                  cy={hover.y.highTmp.position}
                  r={5}
                  color="hotpink"
                  style="fill"
                />
              )}
            </>
          )}
        </CartesianChart>
      </View>
      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <InfoCard style={{ flex: 0, marginBottom: 16 }}>{description}</InfoCard>
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
  readout: {
    fontSize: 18,
    fontWeight: "bold",
  },
  readoutValue: {
    fontSize: 16,
    fontWeight: "400",
    opacity: 0.75,
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
});
