import React from "react";
import {
  CartesianChart,
  type ChartBounds,
  type PointsArray,
  useAreaPath,
  useChartPressState,
  useLinePath,
} from "victory-native";
import {
  Circle,
  Group,
  Line as SkiaLine,
  LinearGradient,
  Path,
  Skia,
  Text as SkiaText,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  type TextStyle,
  View,
} from "react-native";
import { format } from "date-fns";
import {
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { useDarkMode } from "react-native-dark";
import * as Haptics from "expo-haptics";
import inter from "../assets/inter-medium.ttf";
import { AnimatedText } from "../components/AnimatedText";
import { appColors } from "./consts/colors";
import data from "../data/stockprice/tesla_stock.json";
import { InfoCard } from "../components/InfoCard";
import { descriptionForRoute } from "./consts/routes";

const DATA = data.map((d) => ({ ...d, date: new Date(d.date).valueOf() }));
const initChartPressState = { x: 0, y: { high: 0 } } as const;

export default function StockPriceScreen(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const isDark = useDarkMode();
  const colorPrefix = isDark ? "dark" : "light";
  const font = useFont(inter, 12);
  const textColor = isDark ? appColors.text.dark : appColors.text.light;
  const { state: firstTouch, isActive: isFirstPressActive } =
    useChartPressState(initChartPressState);
  const { state: secondTouch, isActive: isSecondPressActive } =
    useChartPressState(initChartPressState);

  // On activation of gesture, play haptic feedback
  React.useEffect(() => {
    if (isFirstPressActive) Haptics.selectionAsync().catch(() => null);
  }, [isFirstPressActive]);
  React.useEffect(() => {
    if (isSecondPressActive) Haptics.selectionAsync().catch(() => null);
  }, [isSecondPressActive]);

  // Active date display
  const activeDate = useDerivedValue(() => {
    if (!isFirstPressActive) return "Single or multi-touch the chart";

    // One-touch only
    if (!isSecondPressActive) return formatDate(firstTouch.x.value.value);
    // Two-touch
    const early =
      firstTouch.x.value.value < secondTouch.x.value.value
        ? firstTouch
        : secondTouch;
    const late = early === firstTouch ? secondTouch : firstTouch;
    return `${formatDate(early.x.value.value)} - ${formatDate(
      late.x.value.value,
    )}`;
  });

  // Active high display
  const activeHigh = useDerivedValue(() => {
    if (!isFirstPressActive) return "—";

    // One-touch
    if (!isSecondPressActive)
      return "$" + firstTouch.y.high.value.value.toFixed(2);

    // Two-touch
    const early =
      firstTouch.x.value.value < secondTouch.x.value.value
        ? firstTouch
        : secondTouch;
    const late = early === firstTouch ? secondTouch : firstTouch;

    return `$${early.y.high.value.value.toFixed(
      2,
    )} – $${late.y.high.value.value.toFixed(2)}`;
  });

  // Determine if the selected range has a positive delta, which will be used to conditionally pick colors.
  const isDeltaPositive = useDerivedValue(() => {
    if (!isSecondPressActive) return true;

    const early =
      firstTouch.x.value.value < secondTouch.x.value.value
        ? firstTouch
        : secondTouch;
    const late = early === firstTouch ? secondTouch : firstTouch;
    return early.y.high.value.value < late.y.high.value.value;
  });

  // Color the active high display based on the delta
  const activeHighStyle = useAnimatedStyle<TextStyle>(() => {
    const s: TextStyle = { fontSize: 24, fontWeight: "bold", color: textColor };

    // One-touch
    if (!isSecondPressActive) return s;
    s.color = isDeltaPositive.value
      ? appColors.success[colorPrefix]
      : appColors.error[colorPrefix];

    return s;
  });

  // Indicator color based on delta
  const indicatorColor = useDerivedValue(() => {
    if (!(isFirstPressActive && isSecondPressActive)) return appColors.tint;
    return isDeltaPositive.value
      ? appColors.success[colorPrefix]
      : appColors.error[colorPrefix];
  });

  return (
    <SafeAreaView style={styles.scrollView}>
      <View style={{ flex: 2, maxHeight: 500, marginBottom: 20 }}>
        <CartesianChart
          data={DATA}
          xKey="date"
          yKeys={["high"]}
          chartPressState={[firstTouch, secondTouch]}
          axisOptions={{
            font,
            tickCount: 5,
            labelOffset: { x: 12, y: 8 },
            labelPosition: { x: "outset", y: "inset" },
            axisSide: { x: "bottom", y: "left" },
            formatXLabel: (ms) => format(new Date(ms), "MM/yy"),
            formatYLabel: (v) => `$${v}`,
            lineColor: isDark ? "#71717a" : "#d4d4d8",
            labelColor: textColor,
          }}
          renderOutside={({ chartBounds }) => (
            <>
              {isFirstPressActive && (
                <>
                  <ActiveValueIndicator
                    xPosition={firstTouch.x.position}
                    yPosition={firstTouch.y.high.position}
                    bottom={chartBounds.bottom}
                    top={chartBounds.top}
                    activeValue={firstTouch.y.high.value}
                    textColor={textColor}
                    lineColor={isDark ? "#71717a" : "#d4d4d8"}
                    indicatorColor={indicatorColor}
                  />
                </>
              )}
              {isSecondPressActive && (
                <>
                  <ActiveValueIndicator
                    xPosition={secondTouch.x.position}
                    yPosition={secondTouch.y.high.position}
                    bottom={chartBounds.bottom}
                    top={chartBounds.top}
                    activeValue={secondTouch.y.high.value}
                    textColor={textColor}
                    lineColor={isDark ? "#71717a" : "#d4d4d8"}
                    indicatorColor={indicatorColor}
                    topOffset={16}
                  />
                </>
              )}
            </>
          )}
        >
          {({ chartBounds, points }) => (
            <>
              <StockArea
                colorPrefix={colorPrefix}
                points={points.high}
                isWindowActive={isFirstPressActive && isSecondPressActive}
                isDeltaPositive={isDeltaPositive}
                startX={firstTouch.x.position}
                endX={secondTouch.x.position}
                {...chartBounds}
              />
            </>
          )}
        </CartesianChart>
      </View>
      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <View
          style={{
            paddingBottom: 16,
            paddingTop: 0,
            alignItems: "center",
            justifyContent: "center",
            height: 80,
            width: "100%",
          }}
        >
          <>
            <AnimatedText
              text={activeDate}
              style={{
                fontSize: 16,
                color: textColor,
              }}
            />
            <AnimatedText text={activeHigh} style={activeHighStyle} />
          </>
        </View>
        <InfoCard style={{ marginBottom: 16 }}>{description}</InfoCard>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Show the line/area chart for the stock price, taking into account press state.
 */
const StockArea = ({
  colorPrefix,
  points,
  isWindowActive,
  isDeltaPositive,
  startX,
  endX,
  left,
  right,
  top,
  bottom,
}: {
  colorPrefix: "dark" | "light";
  points: PointsArray;
  isWindowActive: boolean;
  isDeltaPositive: SharedValue<boolean>;
  startX: SharedValue<number>;
  endX: SharedValue<number>;
} & ChartBounds) => {
  const { path: areaPath } = useAreaPath(points, bottom);
  const { path: linePath } = useLinePath(points);

  const backgroundClip = useDerivedValue(() => {
    const path = Skia.Path.Make();

    if (isWindowActive) {
      path.addRect(Skia.XYWHRect(left, top, startX.value - left, bottom - top));
      path.addRect(
        Skia.XYWHRect(endX.value, top, right - endX.value, bottom - top),
      );
    } else {
      path.addRect(Skia.XYWHRect(left, top, right - left, bottom - top));
    }

    return path;
  });

  const windowClip = useDerivedValue(() => {
    if (!isWindowActive) return Skia.Path.Make();

    const path = Skia.Path.Make();
    path.addRect(
      Skia.XYWHRect(startX.value, top, endX.value - startX.value, bottom - top),
    );
    return path;
  });

  const windowLineColor = useDerivedValue(() => {
    return isDeltaPositive.value
      ? appColors.success[colorPrefix]
      : appColors.error[colorPrefix];
  });

  return (
    <>
      {/* Base */}
      <Group clip={backgroundClip} opacity={isWindowActive ? 0.3 : 1}>
        <Path path={areaPath} style="fill">
          <LinearGradient
            start={vec(0, 0)}
            end={vec(top, bottom)}
            colors={
              isWindowActive
                ? [
                    appColors.cardBorder[colorPrefix],
                    `${appColors.cardBorder[colorPrefix]}33`,
                  ]
                : [appColors.tint, `${appColors.tint}33`]
            }
          />
        </Path>
        <Path
          path={linePath}
          style="stroke"
          strokeWidth={2}
          color={
            isWindowActive ? appColors.cardBorder[colorPrefix] : appColors.tint
          }
        />
      </Group>
      {/* Clipped window */}
      {isWindowActive && (
        <Group clip={windowClip}>
          <Path path={areaPath} style="fill">
            <LinearGradient
              start={vec(0, 0)}
              end={vec(top, bottom)}
              colors={
                !isWindowActive
                  ? [appColors.tint, `${appColors.tint}33`]
                  : isDeltaPositive.value
                    ? [
                        appColors.success[colorPrefix],
                        `${appColors.success[colorPrefix]}33`,
                      ]
                    : [
                        appColors.error[colorPrefix],
                        `${appColors.error[colorPrefix]}33`,
                      ]
              }
            />
          </Path>
          <Path
            path={linePath}
            style="stroke"
            strokeWidth={2}
            color={windowLineColor}
          />
        </Group>
      )}
    </>
  );
};

const ActiveValueIndicator = ({
  xPosition,
  yPosition,
  top,
  bottom,
  activeValue,
  textColor,
  lineColor,
  indicatorColor,
  topOffset = 0,
}: {
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
  activeValue: SharedValue<number>;
  bottom: number;
  top: number;
  textColor: string;
  lineColor: string;
  indicatorColor: SharedValue<string>;
  topOffset?: number;
}) => {
  const FONT_SIZE = 16;
  const font = useFont(inter, FONT_SIZE);
  const start = useDerivedValue(() => vec(xPosition.value, bottom));
  const end = useDerivedValue(() =>
    vec(xPosition.value, top + 1.5 * FONT_SIZE + topOffset),
  );
  // Text label
  const activeValueDisplay = useDerivedValue(
    () => "$" + activeValue.value.toFixed(2),
  );
  const activeValueWidth = useDerivedValue(
    () => font?.getTextWidth(activeValueDisplay.value) || 0,
  );
  const activeValueX = useDerivedValue(
    () => xPosition.value - activeValueWidth.value / 2,
  );

  return (
    <>
      <SkiaLine p1={start} p2={end} color={lineColor} strokeWidth={1} />
      <Circle cx={xPosition} cy={yPosition} r={10} color={indicatorColor} />
      <Circle
        cx={xPosition}
        cy={yPosition}
        r={8}
        color="hsla(0, 0, 100%, 0.25)"
      />
      <SkiaText
        color={textColor}
        font={font}
        text={activeValueDisplay}
        x={activeValueX}
        y={top + FONT_SIZE + topOffset}
      />
    </>
  );
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatDate = (ms: number) => {
  "worklet";

  const date = new Date(ms);
  const M = MONTHS[date.getMonth()];
  const D = date.getDate();
  const Y = date.getFullYear();
  return `${M} ${D}, ${Y}`;
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: appColors.viewBackground.light,
    flex: 1,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
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
