import React, { useLayoutEffect } from "react";
import { Button } from "react-native";
import { CartesianChart, Line } from "victory-native-skia";
import { SimpleData } from "../components/SimpleData";
import { useNavigation } from "expo-router";
import {
  type OptionsNavigationProp,
  useChartOptionsContext,
} from "../components/OptionsProvider";

export default function LinePage() {
  const { state } = useChartOptionsContext();
  const navigation = useNavigation<OptionsNavigationProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Options"
          onPress={() =>
            navigation.navigate("chart-options-modal", { type: "stroke" })
          }
        />
      ),
    });
  }, [navigation]);

  return (
    <SimpleData
      renderChart={({ data }) => (
        <CartesianChart data={data}>
          <Line strokeColor={state.color1} strokeWidth={state.strokeWidth} />
        </CartesianChart>
      )}
    ></SimpleData>
  );
}
