import {
  DashPathEffect,
  LinearGradient,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Area, CartesianChart, Line } from "victory-native";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";
import { InfoCard } from "../components/InfoCard";
import { descriptionForRoute } from "../consts/routes";
import { Button } from "../components/Button";

const generateData = () =>
  Array.from({ length: 12 }, (_, index) => {
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

export default function DashedAxesPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const [data, setData] = React.useState(generateData);
  const [, setW] = React.useState(0);
  const [, setH] = React.useState(0);

  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <View style={styles.chart}>
          <CartesianChart
            data={data}
            xKey="month"
            yKeys={["low", "high"]}
            padding={{
              top: 20,
              right: 20,
              bottom: 40,
              left: 30,
            }}
            domain={{ y: [0, 65] }}
            // domainPadding={{ top: 20 }}
            xAxis={{
              font,
              labelOffset: 0,
              linePathEffect: <DashPathEffect intervals={[4, 4]} />,
              title: {
                text: "Month",
                font,
                position: "left",
                yOffset: 20,
              },
            }}
            yAxis={[
              {
                labelOffset: 8,

                font,
                title: {
                  text: "Temperature",
                  font,
                  position: "left",
                  yOffset: -20,
                },
                linePathEffect: <DashPathEffect intervals={[4, 4]} />,
              },
            ]}
            onChartBoundsChange={({ left, right, top, bottom }) => {
              setW(right - left);
              setH(bottom - top);
            }}
          >
            {({ points, chartBounds }) => (
              <>
                <Area
                  points={points.high}
                  y0={chartBounds.bottom}
                  color="black"
                  opacity={0.5}
                  curveType="natural"
                  animate={{ type: "timing" }}
                >
                  <LinearGradient
                    start={vec(0, 50)}
                    end={vec(0, 200)}
                    colors={["#f7ce64", "#f7ce6420"]}
                  />
                </Area>
                <Line
                  strokeWidth={3}
                  color={"#f7ce64"}
                  curveType="natural"
                  points={points.high}
                />
                <Area
                  points={points.low}
                  y0={chartBounds.bottom}
                  color="black"
                  opacity={0.5}
                  curveType="natural"
                  animate={{ type: "timing" }}
                >
                  <LinearGradient
                    start={vec(0, 50)}
                    end={vec(0, 200)}
                    colors={["#22dacd", "#22dacd20"]}
                  />
                </Area>
                <Line
                  strokeWidth={3}
                  color={"#22dacd"}
                  curveType="natural"
                  points={points.low}
                />
              </>
            )}
          </CartesianChart>
        </View>
        <ScrollView
          style={styles.optionsScrollView}
          contentContainerStyle={styles.options}
        >
          <InfoCard style={{ marginBottom: 16 }}>{description}</InfoCard>
          <Button
            title="Shuffle Data"
            onPress={() => setData(generateData())}
            style={{ width: "100%" }}
          />
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
    maxHeight: 350,
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
