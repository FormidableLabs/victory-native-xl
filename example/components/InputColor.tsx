import * as React from "react";
import { View, Text } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";

type Props = {
  label: string;
  color?: string;
  onChange(color: string): void;
};

export const InputColor = ({ label, color, onChange }: Props) => (
  <View style={{ marginVertical: 10, width: "100%" }}>
    <Text style={{ fontWeight: "bold", marginBottom: 10 }}>{label}</Text>
    <ColorPicker swatchesOnly discrete color={color} onColorChange={onChange} />
  </View>
);
