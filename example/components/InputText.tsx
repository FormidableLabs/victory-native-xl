import React, { type ComponentProps } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = { label: string } & ComponentProps<typeof TextInput>;

export const InputText = ({ label, ...props }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.labelStyles}>{label}</Text>
      <TextInput style={styles.inputStyles} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    width: "48%",
  },
  inputStyles: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "lightgray",
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "100%",
  },
  labelStyles: {
    fontWeight: "bold",
    paddingBottom: 10,
  },
});
