import {
  DashPathEffect,
  LinearGradient,
  useFont,
  vec,
  type Color,
} from "react-native-skia";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bar,
  CartesianChart,
  getTransformComponents,
  setScale,
  setTranslate,
  useChartPressState,
  useChartTransformState,
} from "victory-native";
import { useDarkMode } from "react-native-dark";
import {
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";
import { InputSwitch } from "../components/InputSwitch";
import { InputSlider } from "../components/InputSlider";
import { Button } from "../components/Button";
import { InfoCard } from "../components/InfoCard";
import { descriptionForRoute } from "../consts/routes";
import { InputSegment } from "../components/InputSegment";
import { InputColor } from "../components/InputColor";
import { AnimatedText } from "../components/AnimatedText";

const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
  }));

export default function BarChartPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const [data, setData] = useState(DATA(5));
  const [innerPadding, setInnerPadding] = useState(0.33);
  const [roundedCorner, setRoundedCorner] = useState(5);
  const [showLabels, setShowLabels] = useState(false);
  const [labelColor, setLabelColor] = useState<Color>("#262626");
  const [labelPosition, setLabelPosition] = useState<
    "top" | "bottom" | "left" | "right"
  >("top");
  const { state } = useChartTransformState();

  const k = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  useAnimatedReaction(
    () => {
      return state.panActive.value || state.zoomActive.value;
    },
    (cv, pv) => {
      if (!cv && pv) {
        const vals = getTransformComponents(state.matrix.value);
        k.value = vals.scaleX;
        tx.value = vals.translateX;
        ty.value = vals.translateY;

        k.value = withTiming(1);
        tx.value = withTiming(0);
        ty.value = withTiming(0);
      }
    },
  );

  useAnimatedReaction(
    () => {
      return { k: k.value, tx: tx.value, ty: ty.value };
    },
    ({ k, tx, ty }) => {
      const m = setTranslate(state.matrix.value, tx, ty);
      state.matrix.value = setScale(m, k);
    },
  );

  const { state: pressState, isActive: pressIsActive } = useChartPressState({
    x: 0,
    y: { listenCount: 0 },
  });

  const hoveredLabel = useDerivedValue(() => {
    if (!pressIsActive) return "Hover the chart!";
    const month = pressState.x.value.value;
    const date = new Date(2023, month - 1);
    return date.toLocaleString("default", { month: "short" });
  });
  const hoveredValue = useDerivedValue(() => {
    if (!pressIsActive) return "";
    return `${pressState.y.listenCount.value.value} plays`;
  });

  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <View style={{ paddingHorizontal: 20, paddingTop: 12, gap: 4 }}>
          <AnimatedText
            text={hoveredLabel}
            defaultValue="Hover the chart!"
            style={[
              styles.readout,
              { color: isDark ? appColors.text.dark : appColors.text.light },
            ]}
          />
          <AnimatedText
            text={hoveredValue}
            defaultValue=""
            style={[
              styles.readoutValue,
              { color: isDark ? appColors.text.dark : appColors.text.light },
            ]}
          />
        </View>
        <View style={styles.chart}>
          <CartesianChart
            transformState={state}
            xKey="month"
            padding={5}
            yKeys={["listenCount"]}
            domainPadding={{ left: 50, right: 50, top: 30 }}
            domain={{ y: [0, 100] }}
            chartPressState={pressState}
            enableHover
            chartHoverConfig={{
              activeCursor: "pointer",
            }}
            xAxis={{
              font,
              tickCount: 5,
              labelColor: isDark ? appColors.text.dark : appColors.text.light,
              lineWidth: 0,
              formatXLabel: (value) => {
                const date = new Date(2023, value - 1);
                return date.toLocaleString("default", { month: "short" });
              },
              linePathEffect: <DashPathEffect intervals={[4, 4]} />,
            }}
            frame={{
              lineWidth: 0,
            }}
            yAxis={[
              {
                yKeys: ["listenCount"],
                font,
                linePathEffect: <DashPathEffect intervals={[4, 4]} />,
              },
            ]}
            data={data}
          >
            {({ points, chartBounds }) => {
              return (
                <Bar
                  points={points.listenCount}
                  chartBounds={chartBounds}
                  animate={{ type: "spring" }}
                  innerPadding={innerPadding}
                  roundedCorners={{
                    topLeft: roundedCorner,
                    topRight: roundedCorner,
                  }}
                  labels={{
                    font,
                    color: labelColor,
                    position: labelPosition,
                    formatLabel: (value) =>
                      value == null ? "" : `${value} plays`,
                    rotate: labelPosition === "top" ? -25 : 0,
                  }}
                >
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, 400)}
                    colors={["#a78bfa", "#a78bfa50"]}
                  />
                </Bar>
              );
            }}
          </CartesianChart>
        </View>
        <ScrollView
          style={styles.optionsScrollView}
          contentContainerStyle={styles.options}
        >
          <InfoCard style={{ marginBottom: 16 }}>{description}</InfoCard>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 10,
              marginBottom: 16,
            }}
          >
            <Button
              style={{ flex: 1 }}
              onPress={() => setData((data) => DATA(data.length))}
              title="Shuffle Data"
            />
          </View>
          <InputSlider
            label="Number of bars"
            maxValue={20}
            minValue={3}
            step={1}
            value={data.length}
            onChange={(val) => setData(DATA(val))}
          />
          <InputSlider
            label="Inner Padding"
            maxValue={1}
            minValue={0}
            step={0.1}
            value={innerPadding}
            onChange={setInnerPadding}
          />
          <InputSlider
            label="Top Corner Radius"
            maxValue={16}
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
                label=" Label Position"
                values={["top", "bottom", "left", "right"]}
                onChange={setLabelPosition}
              />
              <InputColor
                label="Inset color"
                color={labelColor as string}
                onChange={setLabelColor}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
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
    fontSize: 20,
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
