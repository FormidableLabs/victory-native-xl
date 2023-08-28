import React from "react";
import {
  CartesianChart,
  Line,
  type ChartBounds,
  type PointsArray,
  useAreaPath,
  useChartPressSharedValue,
  useIsPressActive,
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
import { SafeAreaView, StyleSheet, View } from "react-native";
import { format } from "date-fns";
import {
  type SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useDarkMode } from "react-native-dark";
import inter from "../assets/inter-medium.ttf";
import { AnimatedText } from "../components/AnimatedText";
import { appColors } from "./consts/colors";
import { Text } from "../components/Text";
import data from "../data/stockprice/tesla_stock.json";

const DATA = data.map((d) => ({ ...d, date: new Date(d.date).valueOf() }));

export default function StockPriceScreen() {
  const isDark = useDarkMode();
  const font = useFont(inter, 12);
  const textColor = isDark ? appColors.text.dark : appColors.text.light;
  const { state: firstTouch, isActive: isFirstPressActive } =
    useChartPressSharedValue(["high"]);
  const { state: secondTouch, isActive: isSecondPressActive } =
    useChartPressSharedValue(["high"]);

  const activeDateMs = firstTouch.x.value;
  const activeHigh = firstTouch.y.high.value;

  const activeDate = useDerivedValue(() => {
    if (!isFirstPressActive) return "";

    const date = new Date(activeDateMs.value);
    const M = MONTHS[date.getMonth()];
    const D = date.getDate();
    const Y = date.getFullYear();
    return `${M} ${D}, ${Y}`;
  });
  const activeHighDisplay = useDerivedValue(() =>
    isFirstPressActive ? activeHigh.value.toFixed(2) : "",
  );

  return (
    <SafeAreaView style={styles.scrollView}>
      <View
        style={{
          padding: 12,
          alignItems: "center",
          justifyContent: "center",
          height: 80,
        }}
      >
        {isFirstPressActive ? (
          <>
            <AnimatedText
              text={activeDate}
              style={{
                fontSize: 16,
                color: textColor,
              }}
            />
            <AnimatedText
              text={activeHighDisplay}
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: textColor,
              }}
            />
          </>
        ) : (
          <Text>Pan across the chart path to see more.</Text>
        )}
      </View>
      <View style={{ height: 500, marginBottom: 20 }}>
        <CartesianChart
          data={DATA}
          xKey="date"
          yKeys={["high"]}
          activePressSharedValue={[firstTouch, secondTouch]}
          curve="linear"
          isPressEnabled
          // TODO: Enable this somehow?
          // onPressActiveStart={() => Haptics.selectionAsync()}
          gridOptions={{
            lineColor: isDark ? "#71717a" : "#d4d4d8",
          }}
          axisOptions={{
            font,
            tickCount: 5,
            labelOffset: { x: 12, y: 8 },
            labelPosition: { x: "outset", y: "inset" },
            axisSide: { x: "bottom", y: "left" },
            formatXLabel: (ms) => format(new Date(ms), "MM-dd"),
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
                  />
                </>
              )}
            </>
          )}
        >
          {({ chartBounds, points }) => (
            <>
              <StockArea
                points={points.high}
                isWindowActive={isFirstPressActive && isSecondPressActive}
                startX={firstTouch.x.position}
                endX={secondTouch.x.position}
                {...chartBounds}
              />
              <Line
                points={points.high}
                color={appColors.tint}
                strokeWidth={2}
              />
            </>
          )}
        </CartesianChart>
      </View>
    </SafeAreaView>
  );
}

const StockArea = ({
  points,
  isWindowActive,
  startX,
  endX,
  left,
  right,
  top,
  bottom,
}: {
  points: PointsArray;
  isWindowActive: boolean;
  startX: SharedValue<number>;
  endX: SharedValue<number>;
} & ChartBounds) => {
  const { path } = useAreaPath(points, bottom);

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

  const grad = (
    <LinearGradient
      start={vec(0, 0)}
      end={vec(top, bottom)}
      colors={[appColors.tint, `${appColors.tint}33`]}
    />
  );

  return (
    <>
      <Group clip={backgroundClip} opacity={isWindowActive ? 0.3 : 1}>
        <Path path={path} style="fill">
          {grad}
        </Path>
      </Group>
      {isWindowActive && (
        <Group clip={windowClip}>
          <Path path={path} style="fill">
            {grad}
          </Path>
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
}: {
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
  activeValue: SharedValue<number>;
  bottom: number;
  top: number;
  textColor: string;
  lineColor: string;
}) => {
  const FONT_SIZE = 16;
  const font = useFont(inter, FONT_SIZE);
  const start = useDerivedValue(() => vec(xPosition.value, bottom));
  const end = useDerivedValue(() =>
    vec(xPosition.value, top + 1.5 * FONT_SIZE),
  );
  // Text label
  const activeValueDisplay = useDerivedValue(() =>
    activeValue.value.toFixed(2),
  );
  const activeValueWidth = useDerivedValue(
    () => font?.getTextWidth(activeValueDisplay.value) || 0,
  );
  const activeValueX = useDerivedValue(
    () => xPosition.value - activeValueWidth.value / 2,
  );

  return (
    <>
      <SkiaLine p1={start} p2={end} color={lineColor} />
      <Circle cx={xPosition} cy={yPosition} r={10} color={appColors.tint} />
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
        y={top + FONT_SIZE}
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

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: appColors.viewBackground.light,
    flex: 1,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
});
