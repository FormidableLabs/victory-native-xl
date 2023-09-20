import {
  BackdropBlur,
  Blur,
  BlurMask,
  DashPathEffect,
  Fill,
  Group,
  Line,
  LinearGradient,
  Path,
  Rect,
  RoundedRect,
  Shadow,
  Skia,
  Text,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useDarkMode } from "react-native-dark";
import {
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  AnimatedPath,
  BarGroup,
  CartesianChart,
  useAnimatedDerivedPath,
  useAnimatedPath,
  useChartPressState,
} from "victory-native";
import inter from "../assets/inter-medium.ttf";
import { InfoCard } from "../components/InfoCard";
import { appColors } from "./consts/colors";
import { descriptionForRoute } from "./consts/routes";

const DATA = Array.from({ length: 6 }, (_, index) => {
  const low = Math.round(20 + 20 * Math.random());
  const high = Math.round(low + 3 + 20 * Math.random());

  return {
    month: new Date(2020, index + 1).toLocaleString("default", {
      month: "short",
    }),
    low,
    high,
  };
});

export default function BarGroupWithTooltipPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const [groupWidth, setGroupWidth] = React.useState(0);
  const [barWidth, setBarWidth] = React.useState(0);
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

  // Trace lines
  const traceWidth = 1;
  const traceLine1 = useDerivedValue(() => {
    const barOffset = groupWidth / 2 - barWidth;
    const p = Skia.Path.Make();
    p.moveTo(chartLeft, state.y.low.position.value + traceWidth / 2);
    p.lineTo(
      state.x.position.value - barOffset,
      state.y.low.position.value + traceWidth / 2,
    );
    return p;
  });
  // const traceLine2 = useDerivedValue(() => {
  //   const barOffset = groupWidth / 2 - barWidth;
  //   const p = Skia.Path.Make();
  //   p.moveTo(chartLeft, state.y.high.position.value + traceWidth / 2);
  //   p.lineTo(
  //     state.x.position.value + 2 * barOffset,
  //     state.y.high.position.value + traceWidth / 2,
  //   );
  //   return p;
  // });

  const h = useDerivedValue(() => {
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
              <BarGroup
                chartBounds={chartBounds}
                betweenGroupPadding={0.4}
                withinGroupPadding={0.1}
                onBarSizeChange={({ groupWidth, barWidth }) => {
                  setBarWidth(barWidth);
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
                  {/*<Blur clip={h} blur={1} />*/}
                  <BackdropBlur clip={h} blur={10}>
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
