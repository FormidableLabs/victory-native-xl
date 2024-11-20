import {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const PanZoom = () => {};
import * as React from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import {
  CartesianChart,
  getTransformComponents,
  Line,
  setScale,
  setTranslate,
  useChartTransformState,
} from "victory-native";
import {
  multiply4,
  scale,
  translate,
  useFont,
} from "@shopify/react-native-skia";
import { useState } from "react";
import { appColors } from "./consts/colors";
import inter from "../assets/inter-medium.ttf";

import { Button } from "../components/Button";

export default function PanZoomPage() {
  const font = useFont(inter, 12);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const { state } = useChartTransformState();

  const k = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  useAnimatedReaction(
    () => {
      return state.panActive.value || state.zoomActive.value;
    },
    (cv, pv) => {
      if (!cv && pv) {
        const vals = getTransformComponents(state.matrix.value);
        k.value = vals.scaleX;
        tx.value = vals.translateX;
        ty.value = vals.translateY;

        k.value = withTiming(1);
        tx.value = withTiming(0);
        ty.value = withTiming(0);
      }
    },
  );

  useAnimatedReaction(
    () => {
      return { k: k.value, tx: tx.value, ty: ty.value };
    },
    ({ k, tx, ty }) => {
      const m = setTranslate(state.matrix.value, tx, ty);
      state.matrix.value = setScale(m, k);
    },
  );

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
              enableRescaling: true,
            },
          ]}
          xAxis={{
            enableRescaling: true,
            font: font,
          }}
          transformState={state}
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

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
});
