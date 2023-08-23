import * as React from "react";
import { StyleSheet, View } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import { Text } from "./Text";
import { appColors } from "../app/consts/colors";

type Props = {
  label: string;
  color?: string;
  onChange(color: string): void;
};

export const InputColor = ({ label, color, onChange }: Props) => (
  <View style={{ marginVertical: 15, marginBottom: 25, width: "100%" }}>
    <Text style={{ fontWeight: "bold", marginBottom: 10 }}>{label}</Text>
    <View style={styles.pickerContainer}>
      <ColorPicker
        swatchesOnly
        palette={[
          appColors.tint,
          "#facc15",
          "#a78bfa",
          "#fafafa",
          "#d4d4d8",
          "#71717a",
          "#262626",
        ]}
        discrete
        color={color}
        onColorChange={onChange}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    $dark: {
      backgroundColor: "#444",
    },
  },
});
