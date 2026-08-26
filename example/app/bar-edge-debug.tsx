import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFont } from "@shopify/react-native-skia";
import { Bar, CartesianChart } from "victory-native";
import { Button } from "../components/Button";
import { InfoCard } from "../components/InfoCard";
import { Text } from "../components/Text";
import { appColors } from "../consts/colors";
import inter from "../assets/inter-medium.ttf";

const COUNT_OPTIONS = [2, 7, 15, 32] as const;
const MAX_VISIBLE_BARS = 32;
const FIXED_BAR_WIDTH = 18;

const makeData = (length: number) =>
  Array.from({ length }, (_, index) => ({
    x: index + 1,
    value: 24 + ((index * 17) % 43),
  }));

type DomainPadding =
  | number
  | { left?: number; right?: number; top?: number; bottom?: number };

export default function BarEdgeDebugScreen() {
  const font = useFont(inter, 12);
  const [count, setCount] = React.useState<(typeof COUNT_OPTIONS)[number]>(7);
  const data = makeData(count);

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard>
          Debug fixture for issue #646. The first chart reproduces centered bars
          overflowing the chart bounds without x-domain padding. The following
          charts show stable-width options for dynamic data windows.
        </InfoCard>

        <View style={styles.controls}>
          {COUNT_OPTIONS.map((option) => (
            <Button
              key={option}
              title={`${option}`}
              onPress={() => setCount(option)}
              style={count === option ? styles.activeButton : undefined}
            />
          ))}
        </View>

        <Text style={styles.heading}>Default Width, No X Padding</Text>
        <BarCase font={font} data={data} />

        <Text style={styles.heading}>Max Bar Count Width</Text>
        <BarCase
          font={font}
          data={data}
          barCount={MAX_VISIBLE_BARS}
          domainPadding={{ left: 50, right: 50, top: 16 }}
        />

        <Text style={styles.heading}>Fixed Bar Width</Text>
        <BarCase
          font={font}
          data={data}
          barWidth={FIXED_BAR_WIDTH}
          domainPadding={{ left: 24, right: 24, top: 16 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function BarCase({
  font,
  data,
  domainPadding,
  barCount,
  barWidth,
}: {
  font: ReturnType<typeof useFont>;
  data: ReturnType<typeof makeData>;
  domainPadding?: DomainPadding;
  barCount?: number;
  barWidth?: number;
}) {
  return (
    <View style={styles.chartFrame}>
      <CartesianChart
        data={data}
        xKey="x"
        yKeys={["value"]}
        padding={{ left: 24, right: 12, top: 16, bottom: 28 }}
        domain={{ y: [0, 80] }}
        domainPadding={domainPadding}
        xAxis={{
          font,
          tickCount: Math.min(5, data.length),
          formatXLabel: (value) => `${value}`,
        }}
        yAxis={[
          {
            font,
            tickCount: 3,
          },
        ]}
        frame={{
          lineColor: "#a78bfa",
          lineWidth: StyleSheet.hairlineWidth,
        }}
      >
        {({ points, chartBounds }) => (
          <Bar
            points={points.value}
            chartBounds={chartBounds}
            color="#2563eb"
            innerPadding={0.25}
            barCount={barCount}
            barWidth={barWidth}
          />
        )}
      </CartesianChart>
    </View>
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
  content: {
    padding: 16,
    gap: 14,
  },
  controls: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  activeButton: {
    borderColor: "#2563eb",
    borderWidth: 2,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
  },
  chartFrame: {
    height: 260,
    borderColor: "#a78bfa",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
