import React, { useLayoutEffect } from "react";
import { CartesianChart, Scatter } from "victory-native-skia";
import { SimpleData } from "../components/SimpleData";
import { useNavigation } from "expo-router";
import {
  useChartOptionsContext,
  type OptionsNavigationProp,
} from "example/components/OptionsProvider";
import { Button } from "react-native";

export default function ScatterPage() {
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
          <Scatter fillColor={[state.color1, state.color2]} />
        </CartesianChart>
      )}
    ></SimpleData>
  );
}
