import {
  Canvas,
  Circle,
  DashPathEffect,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { CartesianChart, StackedArea } from "victory-native";
import { Text } from "example/components/Text";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "./consts/colors";
import { InfoCard } from "../components/InfoCard";
import { descriptionForRoute } from "./consts/routes";

const d = [
  { high: 5, low: 3, med: 4, month: "Jan" },
  { high: 5, low: 3, med: 4, month: "Feb" },
  { high: 5, low: 3, med: 4, month: "Mar" },
];

export default function StackedAreaPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const [data] = React.useState(d);
  const [, setW] = React.useState(0);
  const [, setH] = React.useState(0);

  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <View style={styles.chart}>
          <CartesianChart
            data={data}
            xKey="month"
            yKeys={["low", "med", "high"]}
            domain={{ y: [0, 20] }}
            xAxis={{
              font,
              tickCount: 2,
              labelOffset: 4,
              linePathEffect: <DashPathEffect intervals={[4, 4]} />,
            }}
            yAxis={[
              {
                labelOffset: 8,
                tickCount: 20,
                font,
                linePathEffect: <DashPathEffect intervals={[4, 4]} />,
              },
            ]}
            onChartBoundsChange={({ left, right, top, bottom }) => {
              setW(right - left);
              setH(bottom - top);
            }}
          >
            {({ points, chartBounds }) => (
              <StackedArea
                points={[points.low, points.med, points.high]}
                y0={chartBounds.bottom}
              />
            )}
          </CartesianChart>
          <View style={styles.legend}>
            <View style={styles.legendItemContainer}>
              <Canvas style={styles.legendItemCanvas}>
                <Circle
                  c={vec(
                    styles.legendItemCanvas.height / 2,
                    styles.legendItemCanvas.height / 2,
                  )}
                  r={styles.legendItemCanvas.height / 2 - 1} // - 1 to prevent clipping
                  color={"red"}
                />
              </Canvas>
              <Text>{"Low"}</Text>
            </View>
            <View style={styles.legendItemContainer}>
              <Canvas style={styles.legendItemCanvas}>
                <Circle
                  c={vec(
                    styles.legendItemCanvas.height / 2,
                    styles.legendItemCanvas.height / 2,
                  )}
                  r={styles.legendItemCanvas.height / 2 - 1} // - 1 to prevent clipping
                  color={"orange"}
                />
              </Canvas>
              <Text>{"Medium"}</Text>
            </View>
            <View style={styles.legendItemContainer}>
              <Canvas style={styles.legendItemCanvas}>
                <Circle
                  c={vec(
                    styles.legendItemCanvas.height / 2,
                    styles.legendItemCanvas.height / 2,
                  )}
                  r={styles.legendItemCanvas.height / 2 - 1} // - 1 to prevent clipping
                  color={"yellow"}
                />
              </Canvas>
              <Text>{"High"}</Text>
            </View>
          </View>
        </View>
        <ScrollView
          style={styles.optionsScrollView}
          contentContainerStyle={styles.options}
        >
          <InfoCard style={{ marginBottom: 16 }}>{description}</InfoCard>
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
    flex: 1,
    maxHeight: 450,
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
  legend: { flexDirection: "row", flexWrap: "wrap", paddingLeft: 15 },
  legendItemContainer: {
    flexDirection: "row",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  legendItemCanvas: {
    height: 12,
    width: 12,
    marginRight: 2,
  },
});
