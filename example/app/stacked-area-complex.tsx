import {
  Canvas,
  Circle,
  DashPathEffect,
  LinearGradient,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { CartesianChart, StackedArea } from "victory-native";
import { Text } from "example/components/Text";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";
import { InfoCard } from "../components/InfoCard";
import { descriptionForRoute } from "../consts/routes";
import { Button } from "../components/Button";

const generateData = () =>
  Array.from({ length: 12 }, (_, index) => {
    const low = Math.round(20 + 20 * Math.random());
    const med = Math.round(low - 5 * Math.random());
    const high = Math.round(low + 3 + 20 * Math.random());

    return {
      month: new Date(2020, index).toLocaleString("default", {
        month: "short",
      }),
      low,
      med,
      high,
    };
  });

export default function StackedAreaPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 12);
  const [data, setData] = React.useState(generateData());
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
            padding={8}
            domain={{ y: [0, 150] }}
            domainPadding={{ top: 0 }}
            xAxis={{
              font,
              labelOffset: 4,
              lineWidth: 0,
            }}
            yAxis={[
              {
                labelOffset: 8,
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
              <>
                <StackedArea
                  points={[points.low, points.med, points.high]}
                  y0={chartBounds.bottom}
                  curveType="natural"
                  animate={{ type: "spring" }}
                  areaOptions={({ rowIndex, lowestY, highestY }) => {
                    switch (rowIndex) {
                      case 0:
                        return {
                          children: (
                            <LinearGradient
                              start={vec(0, highestY - 25)}
                              end={vec(0, lowestY)}
                              colors={["#f7ce64", "#f7ce6420"]}
                            />
                          ),
                        };
                      case 1:
                        return {
                          children: (
                            <LinearGradient
                              start={vec(0, highestY - 100)}
                              end={vec(0, lowestY)}
                              colors={["#22dacd", "#22dacd20"]}
                            />
                          ),
                        };
                      case 2:
                        return {
                          children: (
                            <LinearGradient
                              start={vec(0, highestY - 100)}
                              end={vec(0, lowestY)}
                              colors={["#56aefb", "#56aefb20"]}
                            />
                          ),
                        };
                      default:
                        return {};
                    }
                  }}
                />
              </>
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
                  color={"#f7ce64"}
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
                  color={"#22dacd"}
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
                  color={"#56aefb"}
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
