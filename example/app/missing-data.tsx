import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Area, Bar, CartesianChart, Line, Scatter } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import { appColors } from "./consts/colors";
import inter from "../assets/inter-medium.ttf";
import { Button } from "../components/Button";
import { InputSegment } from "../components/InputSegment";

export default function MissingDataScreen() {
  const font = useFont(inter, 12);
  const [data, setData] = React.useState(DATA);
  const [connectedData, setConnectedData] = React.useState(VALUES[0]!);

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{ flex: 1, maxHeight: 400, padding: 32 }}>
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={["y"]}
          domain={{ y: [0, 100] }}
          axisOptions={{ font }}
        >
          {({ points, chartBounds }) => (
            <>
              <Area
                points={points.y}
                color="pink"
                y0={chartBounds.bottom}
                curveType="catmullRom"
                animate={{ type: "timing" }}
                connectMissingData={connectedData === "connected"}
              />
              <Line
                points={points.y}
                color="blue"
                strokeWidth={3}
                curveType="catmullRom"
                animate={{ type: "timing" }}
                connectMissingData={connectedData === "connected"}
              />
              <Bar
                points={points.y}
                chartBounds={chartBounds}
                color="black"
                opacity={0.3}
                animate={{ type: "timing" }}
              />
              <Scatter
                points={points.y}
                radius={10}
                shape="star"
                animate={{ type: "timing" }}
              />
            </>
          )}
        </CartesianChart>
      </View>
      <ScrollView style={styles.controls}>
        <Button
          title="Shuffle data"
          onPress={() => setData(DATA())}
          style={{ marginBottom: 16 }}
        />
        <InputSegment
          label="Connect Missing Data"
          values={VALUES}
          value={connectedData}
          onChange={setConnectedData}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const VALUES = ["connected", "gap"];

const SKIP = [7, 8, 15];
const DATA = () =>
  Array.from({ length: 20 }, (_, i) => {
    return {
      x: i,
      y: SKIP.includes(i) ? undefined : Math.random() * 100,
    };
  });

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  controls: {
    padding: 16,
  },
});
