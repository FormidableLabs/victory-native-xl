import { useFont } from "@shopify/react-native-skia";
import * as React from "react";
import { useState } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView } from "react-native";
import { AreaRange, CartesianChart, Line } from "victory-native";
import inter from "../assets/inter-medium.ttf";
import { Button } from "../components/Button";
import { descriptionForRoute } from "../consts/routes";
import { InfoCard } from "../components/InfoCard";

const randomNumber = (min = 25, max = 50) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const DATA = (numberPoints = 13, starting = 1) =>
  Array.from({ length: numberPoints }, (_, index) => {
    const middle = randomNumber(10, 40);
    const lower = randomNumber(middle - 12, middle - 2);
    const upper = randomNumber(middle + 2, middle + 12);

    return {
      day: index + starting,
      upper,
      middle,
      lower,
    };
  });

export default function AreaRangeChartPage(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);

  const font = useFont(inter, 12);
  const [data, setData] = useState(DATA);

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView contentContainerStyle={{ gap: 16, padding: 16 }}>
        <View style={{ height: 250 }}>
          <CartesianChart
            xKey="day"
            yKeys={["middle"]}
            axisOptions={{
              font,
            }}
            domain={{ y: [-10, 50] }}
            data={data}
          >
            {({ points }) => (
              <>
                <AreaRange
                  points={points.middle.map((p) => ({
                    ...p,
                    y: p.y! + 20,
                    y0: p.y! - 20,
                  }))}
                  animate={{ type: "timing" }}
                  color={"#6464FF"}
                  opacity={0.2}
                />
                <Line
                  points={points.middle}
                  animate={{ type: "timing" }}
                  color={"#6464FF"}
                  strokeWidth={1}
                />
              </>
            )}
          </CartesianChart>
        </View>
        <View style={{ height: 250 }}>
          <CartesianChart
            xKey="day"
            yKeys={["middle", "lower", "upper"]}
            axisOptions={{
              font,
            }}
            domain={{ y: [0, 50] }}
            data={data}
          >
            {({ points }) => (
              <>
                <AreaRange
                  upperPoints={points.upper}
                  lowerPoints={points.lower}
                  animate={{ type: "timing" }}
                  color={"#6464FF"}
                  opacity={0.2}
                />
                <Line
                  points={points.middle}
                  animate={{ type: "timing" }}
                  color={"#6464FF"}
                  strokeWidth={1}
                />
              </>
            )}
          </CartesianChart>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <InfoCard>{description}</InfoCard>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            paddingHorizontal: 16,
          }}
        >
          <Button
            style={{ flex: 1 }}
            onPress={() => setData(DATA())}
            title="Shuffle Data"
          />
          <Button
            style={{ flex: 1 }}
            onPress={() =>
              setData((data) => [...data, ...DATA(5, data.length)])
            }
            title="Add Points"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
});
