import * as React from "react";
import {
  DashPathEffect,
  Line as SkiaLine,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useDarkMode } from "react-native-dark";
import { type SharedValue, useDerivedValue } from "react-native-reanimated";
import {
  Candlestick,
  CartesianChart,
  useChartPressState,
} from "victory-native";
import inter from "../assets/inter-medium.ttf";
import { AnimatedText } from "../components/AnimatedText";
import { InfoCard } from "../components/InfoCard";
import { Text } from "../components/Text";
import { appColors } from "../consts/colors";
import { descriptionForRoute } from "../consts/routes";
import stockData from "../data/stockprice/tesla_stock.json";

const parseStockDate = (value: string) => {
  const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
  return new Date(year, month - 1, day).valueOf();
};

const STOCK_DATA = stockData.map((datum) => ({
  ...datum,
  date: parseStockDate(datum.date),
}));
const MAIN_DATA = STOCK_DATA.slice(20, 90);
const MAIN_TICK_VALUES = getMonthTickValues(MAIN_DATA);

type CandlestickExampleDatum = {
  session: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

const STYLE_DATA: CandlestickExampleDatum[] = [
  { session: "Mon", open: 12, high: 18, low: 9, close: 16 },
  { session: "Tue", open: 16, high: 20, low: 13, close: 14 },
  { session: "Wed", open: 14, high: 21, low: 12, close: 19 },
  { session: "Thu", open: 19, high: 23, low: 17, close: 18 },
  { session: "Fri", open: 18, high: 24, low: 15, close: 22 },
  { session: "Sat", open: 22, high: 25, low: 18, close: 20 },
];

const EDGE_DATA = [
  { label: "Up", open: 10, high: 18, low: 8, close: 16 },
  { label: "Down", open: 16, high: 19, low: 9, close: 11 },
  { label: "Doji", open: 12, high: 17, low: 7, close: 12 },
  { label: "Gap", open: null, high: 15, low: 10, close: 13 },
  { label: "Thin", open: 14, high: 18, low: 13, close: 13.8 },
] satisfies {
  label: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
}[];

const initChartPressState = {
  x: MAIN_DATA[0]?.date ?? 0,
  y: { open: 0, high: 0, low: 0, close: 0 },
};

export default function CandlestickPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const isDark = useDarkMode();
  const textColor = isDark ? appColors.text.dark : appColors.text.light;
  const axisColor = isDark ? "#71717a" : "#d4d4d8";
  const { state: pressState, isActive } =
    useChartPressState(initChartPressState);

  const activeDate = useDerivedValue(() =>
    isActive ? formatDate(pressState.x.value.value) : "TSLA",
  );
  const activeValues = useDerivedValue(() => {
    if (!isActive) return "O -  H -  L -  C -";

    return `O ${formatPrice(pressState.y.open.value.value)}  H ${formatPrice(
      pressState.y.high.value.value,
    )}  L ${formatPrice(pressState.y.low.value.value)}  C ${formatPrice(
      pressState.y.close.value.value,
    )}`;
  });

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.readout}>
          <AnimatedText
            text={activeDate}
            style={[styles.activeDate, { color: textColor }]}
          />
          <AnimatedText
            text={activeValues}
            style={[styles.activeValues, { color: textColor }]}
          />
        </View>

        <View style={styles.largeChart}>
          <CartesianChart
            data={MAIN_DATA}
            xKey="date"
            yKeys={["open", "high", "low", "close"]}
            padding={{ left: 10, right: 10, top: 20, bottom: 10 }}
            domainPadding={{ left: 18, right: 18, top: 20, bottom: 12 }}
            chartPressState={pressState}
            xAxis={{
              font,
              tickValues: MAIN_TICK_VALUES,
              lineColor: axisColor,
              labelColor: textColor,
              labelOffset: 8,
              formatXLabel: formatMonthLabel,
            }}
            yAxis={[
              {
                yKeys: ["open", "high", "low", "close"],
                font,
                tickCount: 5,
                lineColor: axisColor,
                labelColor: textColor,
                labelOffset: 6,
                formatYLabel: (value) => `$${Math.round(Number(value))}`,
              },
            ]}
            frame={{
              lineColor: axisColor,
              lineWidth: StyleSheet.hairlineWidth,
            }}
            renderOutside={({ chartBounds }) =>
              isActive ? (
                <ActiveCandlestickIndicator
                  xPosition={pressState.x.position}
                  top={chartBounds.top}
                  bottom={chartBounds.bottom}
                  lineColor={axisColor}
                />
              ) : null
            }
          >
            {({ points, chartBounds }) => (
              <Candlestick
                openPoints={points.open}
                highPoints={points.high}
                lowPoints={points.low}
                closePoints={points.close}
                chartBounds={chartBounds}
                candleRatio={0.65}
                wickStrokeWidth={1.5}
                candleColors={{
                  positive: "#16a34a",
                  negative: "#dc2626",
                  neutral: "#71717a",
                }}
              />
            )}
          </CartesianChart>
        </View>

        <View style={styles.infoCardContainer}>
          <InfoCard>{description}</InfoCard>
        </View>

        <Text style={styles.sectionTitle}>Custom styling</Text>
        <View style={styles.smallChart}>
          <CartesianChart
            data={STYLE_DATA}
            xKey="session"
            yKeys={["open", "high", "low", "close"]}
            padding={{ left: 8, right: 8, top: 12, bottom: 4 }}
            domain={{ y: [0, 28] }}
            domainPadding={{ left: 34, right: 34, top: 8 }}
            xAxis={{
              font,
              tickCount: 6,
              lineColor: axisColor,
              labelColor: textColor,
            }}
            yAxis={[
              {
                yKeys: ["open", "high", "low", "close"],
                font,
                tickCount: 4,
                lineColor: axisColor,
                labelColor: textColor,
              },
            ]}
          >
            {({ points, chartBounds }) => (
              <Candlestick
                openPoints={points.open}
                highPoints={points.high}
                lowPoints={points.low}
                closePoints={points.close}
                chartBounds={chartBounds}
                candleRatio={0.5}
                wickStrokeWidth={1}
                candleColors={{
                  positive: "#2563eb",
                  negative: "#f97316",
                  neutral: "#71717a",
                }}
                candleOptions={({ high, low, isNeutral }) => ({
                  body: {
                    opacity: isNeutral ? 1 : 0.86,
                  },
                  wick: {
                    strokeWidth: high - low > 7 ? 2 : 1,
                    opacity: 0.95,
                  },
                })}
              />
            )}
          </CartesianChart>
        </View>

        <Text style={styles.sectionTitle}>Doji and missing values</Text>
        <View style={styles.smallChart}>
          <CartesianChart
            data={EDGE_DATA}
            xKey="label"
            yKeys={["open", "high", "low", "close"]}
            padding={{ left: 8, right: 8, top: 12, bottom: 4 }}
            domain={{ y: [0, 22] }}
            domainPadding={{ left: 34, right: 34, top: 8 }}
            xAxis={{
              font,
              tickCount: 5,
              lineColor: axisColor,
              labelColor: textColor,
            }}
            yAxis={[
              {
                yKeys: ["open", "high", "low", "close"],
                font,
                tickCount: 4,
                lineColor: axisColor,
                labelColor: textColor,
              },
            ]}
          >
            {({ points, chartBounds }) => (
              <Candlestick
                openPoints={points.open}
                highPoints={points.high}
                lowPoints={points.low}
                closePoints={points.close}
                chartBounds={chartBounds}
                candleRatio={0.62}
                minBodyHeight={2}
                wickStrokeWidth={1.5}
              />
            )}
          </CartesianChart>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ActiveCandlestickIndicator = ({
  xPosition,
  top,
  bottom,
  lineColor,
}: {
  xPosition: SharedValue<number>;
  top: number;
  bottom: number;
  lineColor: string;
}) => {
  const start = useDerivedValue(() => vec(xPosition.value, top));
  const end = useDerivedValue(() => vec(xPosition.value, bottom));

  return (
    <SkiaLine p1={start} p2={end} color={lineColor} strokeWidth={1}>
      <DashPathEffect intervals={[6, 4]} />
    </SkiaLine>
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
  const month = MONTHS[date.getMonth()];
  return `${month} ${date.getDate()}, ${date.getFullYear()}`;
};

const formatPrice = (value: number) => {
  "worklet";

  return `$${value.toFixed(2)}`;
};

const formatMonthLabel = (ms: number) => {
  const date = new Date(ms);
  const month = MONTHS[date.getMonth()];
  return `${month} '${String(date.getFullYear()).slice(2)}`;
};

function getMonthTickValues(data: typeof STOCK_DATA) {
  const min = data[0]?.date;
  const max = data[data.length - 1]?.date;
  if (min == null || max == null) return [];

  const ticks: number[] = [];
  const cursor = new Date(min);
  cursor.setDate(1);
  cursor.setHours(0, 0, 0, 0);
  cursor.setMonth(cursor.getMonth() + 1);

  while (cursor.valueOf() <= max) {
    ticks.push(cursor.valueOf());
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return ticks;
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 28,
  },
  readout: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  activeDate: {
    fontSize: 16,
    fontWeight: "600",
  },
  activeValues: {
    fontSize: 15,
    marginTop: 4,
  },
  largeChart: {
    height: 420,
    paddingHorizontal: 12,
  },
  infoCardContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 10,
  },
  smallChart: {
    height: 260,
    paddingHorizontal: 12,
  },
});
