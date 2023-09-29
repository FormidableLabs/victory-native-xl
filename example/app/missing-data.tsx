import * as React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Area, Bar, CartesianChart, Line, Scatter } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import { appColors } from "./consts/colors";
import inter from "../assets/inter-medium.ttf";
import { Button } from "../components/Button";

export default function MissingDataScreen() {
  const font = useFont(inter, 12);
  const [data, setData] = React.useState(DATA);

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
              />
              <Line
                points={points.y}
                color="blue"
                strokeWidth={3}
                curveType="catmullRom"
                animate={{ type: "timing" }}
              />
              <Bar
                points={points.y}
                chartBounds={chartBounds}
                color="black"
                opacity={0.3}
              />
              <Scatter points={points.y} radius={10} shape="star" />
            </>
          )}
        </CartesianChart>
      </View>
      <Button title="Shuffle data" onPress={() => setData(DATA())} />
    </SafeAreaView>
  );
}

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
});
