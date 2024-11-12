import * as React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "./Text";

type Props = {
  label?: string;
  checked: boolean;
  onChange(): void;
};

export const Checkbox = ({ label, checked, onChange }: Props) => {
  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
      <Pressable
        style={[styles.checkboxBase, checked && styles.checkboxChecked]}
        onPress={onChange}
      >
        {checked && <Ionicons name="checkmark" size={18} color="white" />}
      </Pressable>
      {label ? <Text>{label}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "coral",
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "coral",
  },
});
