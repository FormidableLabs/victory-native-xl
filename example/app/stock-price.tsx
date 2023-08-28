import React from "react";
import {
  CartesianChart,
  Line,
  type ChartBounds,
  type PointsArray,
  useAreaPath,
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
  const [isPressActive, setIsPressActive] = React.useState(false);
  const activeDateMS = useSharedValue(0);
  const activeHigh = useSharedValue(0);
  const textColor = isDark ? appColors.text.dark : appColors.text.light;

  const activeDate = useDerivedValue(() => {
    if (!isPressActive) return "";

    const date = new Date(activeDateMS.value);
    const M = MONTHS[date.getMonth()];
    const D = date.getDate();
    const Y = date.getFullYear();
    return `${M} ${D}, ${Y}`;
  });
  const activeHighDisplay = useDerivedValue(() =>
    isPressActive ? activeHigh.value.toFixed(2) : "",
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
        {isPressActive ? (
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
      <View style={{ flex: 1, marginBottom: 20 }}>
        <CartesianChart
          data={DATA}
          xKey="date"
          yKeys={["high"]}
          curve="linear"
          isPressEnabled
          activePressX={{ value: activeDateMS }}
          activePressY={{ high: { value: activeHigh } }}
          onPressActiveChange={setIsPressActive}
          onPressActiveStart={() => Haptics.selectionAsync()}
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
          renderOutside={({
            isPressActive,
            activePressX,
            activePressY,
            chartBounds,
          }) =>
            isPressActive && (
              <>
                <ActiveValueIndicator
                  xPosition={activePressX.position}
                  yPosition={activePressY.high.position}
                  bottom={chartBounds.bottom}
                  top={chartBounds.top}
                  activeValue={activePressY.high.value}
                  textColor={textColor}
                  lineColor={isDark ? "#71717a" : "#d4d4d8"}
                />
              </>
            )
          }
        >
          {({ isPressActive, activePressX, chartBounds, points }) => (
            <>
              <StockArea
                xPosition={activePressX.position}
                points={points.high}
                isPressActive={isPressActive}
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
  xPosition,
  isPressActive,
  left,
  right,
  bottom,
  top,
}: {
  points: PointsArray;
  xPosition: SharedValue<number>;
  isPressActive: boolean;
} & ChartBounds) => {
  const { path } = useAreaPath(points, bottom);
  const clipRectRight = useSharedValue(right);
  React.useEffect(() => {
    clipRectRight.value = right;
  }, [clipRectRight, right]);

  React.useEffect(() => {
    if (!isPressActive) {
      clipRectRight.value = xPosition.value;
      clipRectRight.value = withTiming(right, { duration: 200 });
    }
  }, [clipRectRight, isPressActive, right, xPosition.value]);

  const leftRect = useDerivedValue(() => {
    const path = Skia.Path.Make();
    path.addRect(
      Skia.XYWHRect(
        left,
        top,
        (isPressActive ? xPosition.value : clipRectRight.value) - left,
        bottom - top,
      ),
    );

    return path;
  });

  return (
    <Group clip={leftRect}>
      <Path path={path} style="fill">
        <LinearGradient
          start={vec(0, 0)}
          end={vec(top, bottom)}
          colors={[appColors.tint, `${appColors.tint}33`]}
        />
      </Path>
    </Group>
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
