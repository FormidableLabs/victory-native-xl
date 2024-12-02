export const PanZoom = () => {};
import * as React from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { CartesianChart, Line, useChartTransformState } from "victory-native";
import {
  multiply4,
  scale,
  translate,
  useFont,
} from "@shopify/react-native-skia";
import { useState } from "react";
import { appColors } from "../consts/colors";
import inter from "../assets/inter-medium.ttf";

import { Button } from "../components/Button";

export default function HorizontalScrollPage() {
  const font = useFont(inter, 12);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const { state } = useChartTransformState({
    scaleX: 1.5,
  });

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{ flex: 1, maxHeight: 400, padding: 32 }}>
        <CartesianChart
          data={DATA}
          xKey="day"
          yKeys={["highTmp"]}
          yAxis={[
            {
              font: font,
            },
          ]}
          xAxis={{
            font: font,
          }}
          transformState={state}
          transformConfig={{
            pan: {
              dimensions: "x",
            },
          }}
          onChartBoundsChange={({ top, left, right, bottom }) => {
            setWidth(right - left);
            setHeight(bottom - top);
          }}
        >
          {({ points }) => {
            return (
              <>
                <Line points={points.highTmp} color="red" strokeWidth={3} />
              </>
            );
          }}
        </CartesianChart>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
      >
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Button
              title={"Pan Left"}
              style={{ flex: 1 }}
              onPress={() => {
                state.matrix.value = multiply4(
                  state.matrix.value,
                  translate(10, 0),
                );
              }}
            />
            <Button
              title={"Pan Right"}
              style={{ flex: 1 }}
              onPress={() => {
                state.matrix.value = multiply4(
                  state.matrix.value,
                  translate(-10, 0, 0),
                );
              }}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Button
              title={"Pan Up"}
              style={{ flex: 1 }}
              onPress={() => {
                state.matrix.value = multiply4(
                  state.matrix.value,
                  translate(0, 10),
                );
              }}
            />
            <Button
              title={"Pan Down"}
              style={{ flex: 1 }}
              onPress={() => {
                state.matrix.value = multiply4(
                  state.matrix.value,
                  translate(0, -10),
                );
              }}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Button
              title={"Zoom In"}
              style={{ flex: 1 }}
              onPress={() => {
                state.matrix.value = multiply4(
                  state.matrix.value,
                  scale(1.25, 1.25, 1, { x: width / 2, y: height / 2 }),
                );
              }}
            />
            <Button
              title={"Zoom Out"}
              style={{ flex: 1 }}
              onPress={() => {
                state.matrix.value = multiply4(
                  state.matrix.value,
                  scale(0.75, 0.75, 1, { x: width / 2, y: height / 2 }),
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// const DATA = Array.from({ length: 31 }, (_, i) => ({
//   day: i,
//   highTmp: 40 + 30 * Math.random(),
// }));

const DATA = [
  { day: 0, highTmp: 59.30624201725173 },
  { day: 1, highTmp: 44.25635578608018 },
  { day: 2, highTmp: 68.19738539273173 },
  { day: 3, highTmp: 47.62255457719107 },
  { day: 4, highTmp: 69.36936311145384 },
  { day: 5, highTmp: 50.341333269749946 },
  { day: 6, highTmp: 54.73478765663331 },
  { day: 7, highTmp: 59.65742044241456 },
  { day: 8, highTmp: 48.221495620289595 },
  { day: 9, highTmp: 58.65209092238778 },
  { day: 10, highTmp: 41.03429979716762 },
  { day: 11, highTmp: 41.10630442396717 },
  { day: 12, highTmp: 45.47205847354351 },
  { day: 13, highTmp: 57.634709409230446 },
  { day: 14, highTmp: 65.87827901279721 },
  { day: 15, highTmp: 47.99811346139486 },
  { day: 16, highTmp: 43.29378262397241 },
  { day: 17, highTmp: 65.0593421561084 },
  { day: 18, highTmp: 56.312569508928775 },
  { day: 19, highTmp: 67.7442403533759 },
  { day: 20, highTmp: 62.84831567105093 },
  { day: 21, highTmp: 53.629213794422405 },
  { day: 22, highTmp: 45.06696838558802 },
  { day: 23, highTmp: 47.95068037187096 },
  { day: 24, highTmp: 45.93743256152696 },
  { day: 25, highTmp: 54.075911101211815 },
  { day: 26, highTmp: 43.777537229307036 },
  { day: 27, highTmp: 49.19553019689158 },
  { day: 28, highTmp: 46.771688955924674 },
  { day: 29, highTmp: 47.74835132388989 },
  { day: 30, highTmp: 40.1617262863485 },
];

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
});
