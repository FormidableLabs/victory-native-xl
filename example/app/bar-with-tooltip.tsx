import {
  BackdropBlur,
  DashPathEffect,
  Fill,
  Line,
  LinearGradient,
  Skia,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useDarkMode } from "react-native-dark";
import {
  type SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BarGroup, CartesianChart, useChartPressState } from "victory-native";
import inter from "../assets/inter-medium.ttf";
import { InfoCard } from "../components/InfoCard";
import { appColors } from "./consts/colors";
import { descriptionForRoute } from "./consts/routes";

const DATA = Array.from({ length: 6 }, (_, index) => {
  const low = Math.round(20 + 20 * Math.random());
  const high = Math.round(low + 3 + 20 * Math.random());

  return {
    month: new Date(2020, index).toLocaleString("default", {
      month: "short",
    }),
    low,
    high,
  };
});

export default function BarGroupWithTooltipPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const [groupWidth, setGroupWidth] = React.useState(0);
  const [chartBottom, setChartBottom] = React.useState(0);
  const [chartLeft, setChartLeft] = React.useState(0);
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const { state, isActive } = useChartPressState({
    x: "Jan",
    y: { low: 0, high: 0 },
  });

  // Bar highlight
  const barGap = 5;
  const animConfig = { duration: 300 };
  const ttX = useSharedValue(0);
  const ttY = useSharedValue(0);
  const ttH = useDerivedValue(() => chartBottom - ttY.value + barGap);
  useAnimatedReaction(
    () => state.x.position.value,
    (val) => {
      ttX.value = withTiming(val - groupWidth / 2 - barGap, animConfig);
    },
  );
  useAnimatedReaction(
    () => Math.min(state.y.low.position.value, state.y.high.position.value),
    (val) => {
      ttY.value = withTiming(val - barGap, animConfig);
    },
  );

  // Trace for low
  const low$ = useTiming(state.y.low.position);
  const w1 = useDerivedValue(() => ttX.value - chartLeft + groupWidth / 2);
  const p1Low = useDerivedValue(() => vec(chartLeft, low$.value));
  const p2Low = useDerivedValue(() => vec(chartLeft + w1.value, low$.value));
  // Trace for high
  const high$ = useTiming(state.y.high.position);
  const w2 = useDerivedValue(() => ttX.value + groupWidth / 2 - barGap);
  const p1High = useDerivedValue(() => vec(chartLeft, high$.value));
  const p2High = useDerivedValue(() => vec(chartLeft + w2.value, high$.value));

  const tooltipClip = useDerivedValue(() => {
    const p = Skia.Path.Make();
    p.addRRect(
      Skia.RRectXY(
        Skia.XYWHRect(ttX.value, ttY.value, groupWidth + barGap * 2, ttH.value),
        3,
        3,
      ),
    );

    return p;
  });

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.chart}>
        <CartesianChart
          data={DATA}
          xKey="month"
          yKeys={["low", "high"]}
          domain={{ y: [0, 50] }}
          padding={{ left: 10, right: 10, bottom: 5, top: 15 }}
          domainPadding={{ left: 50, right: 50, top: 30 }}
          axisOptions={{
            font,
            tickCount: { y: 10, x: 5 },
            lineColor: isDark ? "#71717a" : "#d4d4d8",
            labelColor: isDark ? appColors.text.dark : appColors.text.light,
          }}
          chartPressState={state}
          onChartBoundsChange={({ bottom, left }) => {
            setChartBottom(bottom);
            setChartLeft(left);
          }}
        >
          {({ points, chartBounds }) => (
            <>
              {isActive && (
                <>
                  <Line
                    p1={p1Low}
                    p2={p2Low}
                    strokeWidth={StyleSheet.hairlineWidth}
                  >
                    <DashPathEffect intervals={[8, 4]} />
                  </Line>
                  <Line
                    p1={p1High}
                    p2={p2High}
                    strokeWidth={StyleSheet.hairlineWidth}
                  >
                    <DashPathEffect intervals={[8, 4]} />
                  </Line>
                </>
              )}
              <BarGroup
                chartBounds={chartBounds}
                betweenGroupPadding={0.4}
                withinGroupPadding={0.1}
                onBarSizeChange={({ groupWidth }) => {
                  setGroupWidth(groupWidth);
                }}
              >
                <BarGroup.Bar points={points.low} animate={{ type: "timing" }}>
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, 540)}
                    colors={["#94cdec", "rgba(59,86,239,0.56)"]}
                  />
                </BarGroup.Bar>
                <BarGroup.Bar points={points.high} animate={{ type: "timing" }}>
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, 500)}
                    colors={["#fb9da0", "rgba(244,46,46,0.56)"]}
                  />
                </BarGroup.Bar>
              </BarGroup>
              {isActive && (
                <>
                  <BackdropBlur clip={tooltipClip} blur={10}>
                    <Fill color="gray" opacity={0.3} />
                  </BackdropBlur>
                </>
              )}
            </>
          )}
        </CartesianChart>
      </View>
      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <InfoCard>{description}</InfoCard>
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
    height: 350,
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

const useTiming = (val: SharedValue<number>) => {
  const value = useSharedValue(0);
  useAnimatedReaction(
    () => val.value,
    (v) => {
      value.value = withTiming(v, { duration: 300 });
    },
  );
  return value;
};
