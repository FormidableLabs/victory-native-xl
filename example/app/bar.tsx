import React, { useLayoutEffect } from "react";
import { SimpleData } from "../components/SimpleData";
import { CartesianChart, Bar } from "victory-native-skia";
import {
  useChartOptionsContext,
  type OptionsNavigationProp,
} from "example/components/OptionsProvider";
import { useNavigation } from "expo-router";
import { Button } from "react-native";

export default function BarPage() {
  const navigation = useNavigation<OptionsNavigationProp>();
  const { state } = useChartOptionsContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Options"
          onPress={() =>
            navigation.navigate("chart-options-modal", { type: "fill" })
          }
        />
      ),
    });
  }, [navigation]);

  return (
    <SimpleData
      renderChart={({ data }) => (
        <CartesianChart data={data}>
          <Bar fillColor={[state.color1, state.color2]} />
        </CartesianChart>
      )}
    ></SimpleData>
  );
}
