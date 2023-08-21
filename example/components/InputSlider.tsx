import Slider from "@react-native-community/slider";
import * as React from "react";
import { Text, View } from "react-native";

type Props = {
  label: string;
  value: number;
  minValue: number;
  maxValue: number;
  step: number;
  onChange(value: number): void;
};

export const InputSlider = ({
  label,
  maxValue,
  minValue,
  step,
  value,
  onChange,
}: Props) => (
  <View style={{ marginVertical: 10 }}>
    <Text style={{ fontWeight: "bold" }}>{label}</Text>
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Slider
        onResponderGrant={() => true}
        style={{ width: "90%", height: 40 }}
        minimumValue={minValue}
        maximumValue={maxValue}
        step={step}
        value={value}
        onValueChange={onChange}
      />
      <Text style={{ alignSelf: "center" }}>{value}</Text>
    </View>
  </View>
);
