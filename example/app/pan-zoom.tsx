import {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const PanZoom = () => {};
import * as React from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { CartesianChart, Line, useChartTransformState } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import { useState } from "react";
import { appColors } from "./consts/colors";
import inter from "../assets/inter-medium.ttf";

import { Button } from "../components/Button";

export default function PanZoomPage() {
  const font = useFont(inter, 12);
  const [, setWidth] = useState(0);
  const [, setHeight] = useState(0);
  const { state, actions } = useChartTransformState();

  const k = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  useAnimatedReaction(
    () => {
      return state.panActive.value || state.zoomActive.value;
    },
    (cv, pv) => {
      if (!cv && pv) {
        const vals = actions.getTransformComponents();
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
      actions.setTranslate(tx, ty);
      actions.setScale(k);
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
          {({ points }) => (
            <>
              <Line points={points.highTmp} color="red" strokeWidth={3} />
            </>
          )}
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
                const { translateX: tx } = actions.getTransformComponents();
                actions.setTranslate(tx + 10, 0);
              }}
            />
            <Button
              title={"Pan Right"}
              style={{ flex: 1 }}
              onPress={() => {
                const { translateX: tx } = actions.getTransformComponents();
                actions.setTranslate(tx - 10, 0);
              }}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Button
              title={"Pan Up"}
              style={{ flex: 1 }}
              onPress={() => {
                const { translateY: ty } = actions.getTransformComponents();
                actions.setTranslate(0, ty + 10);
              }}
            />
            <Button
              title={"Pan Down"}
              style={{ flex: 1 }}
              onPress={() => {
                const { translateY: ty } = actions.getTransformComponents();
                actions.setTranslate(0, ty - 10);
              }}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Button
              title={"Zoom In"}
              style={{ flex: 1 }}
              onPress={() => {
                const { scaleX, scaleY } = actions.getTransformComponents();
                actions.setScale(scaleX + 1, scaleY + 1);
              }}
            />
            <Button
              title={"Zoom Out"}
              style={{ flex: 1 }}
              onPress={() => {
                const { scaleX, scaleY } = actions.getTransformComponents();
                actions.setScale(scaleX - 1, scaleY - 1);
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
